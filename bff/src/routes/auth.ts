import { Router, type Response } from 'express';
import { config, assertFirebaseRest, assertOdooConfig } from '../config';
import { signInWithPassword } from '../firebaseRest';
import { firebaseAdminAvailable, verifyIdToken } from '../firebase';
import { syncInstaller } from '../odoo';
import { exchangeCodeForClaims, googleConfigMissing, popupResultHtml } from '../googleOAuth';

export const authRouter = Router();

function configMissing(res: Response, missing: string[]) {
  return res.status(503).json({
    error: 'config_missing',
    message: `Configuration BFF manquante : ${missing.join(', ')}. Renseignez bff/.env.`,
  });
}

/**
 * Login email / mot de passe — chemin fonctionnel principal.
 * Firebase REST valide le mot de passe (server-side), puis on synchronise Odoo.
 */
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: 'bad_request', message: 'email et password requis.' });
  }
  const missing = [...assertFirebaseRest(), ...assertOdooConfig()];
  if (missing.length) return configMissing(res, missing);

  try {
    const user = await signInWithPassword(email, password);
    const session = await syncInstaller({
      uid: user.localId,
      email: user.email,
      name: user.displayName,
      provider: 'password',
      email_verified: true,
    });
    return res.json({
      ...session,
      user: { email: user.email, name: user.displayName, picture: user.profilePicture },
    });
  } catch (err: unknown) {
    const fbError = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
    const message = fbError ?? (err as Error)?.message ?? 'login_failed';
    const isAuthError = ['INVALID_PASSWORD', 'EMAIL_NOT_FOUND', 'INVALID_LOGIN_CREDENTIALS', 'USER_DISABLED'].includes(message);
    return res.status(isAuthError ? 401 : 502).json({ error: 'login_failed', message });
  }
});

/**
 * Session à partir d'un idToken Firebase déjà obtenu côté client (compat. .md).
 * Nécessite Firebase Admin (compte de service) pour vérifier le token.
 */
authRouter.post('/firebase/session', async (req, res) => {
  const { idToken } = req.body ?? {};
  if (!idToken) {
    return res.status(400).json({ error: 'bad_request', message: 'idToken requis.' });
  }
  if (!firebaseAdminAvailable()) {
    return res.status(501).json({
      error: 'admin_unavailable',
      message: 'Firebase Admin non configuré (GOOGLE_APPLICATION_CREDENTIALS).',
    });
  }
  const missing = assertOdooConfig();
  if (missing.length) return configMissing(res, missing);

  try {
    const decoded = await verifyIdToken(idToken);
    const session = await syncInstaller({
      uid: decoded.uid,
      email: decoded.email ?? '',
      name: decoded.name as string | undefined,
      picture: decoded.picture,
      email_verified: decoded.email_verified,
      provider: decoded.firebase?.sign_in_provider,
    });
    return res.json({
      ...session,
      user: { email: decoded.email ?? '', name: decoded.name as string | undefined, picture: decoded.picture },
    });
  } catch (err: unknown) {
    return res.status(401).json({ error: 'invalid_token', message: (err as Error)?.message ?? 'Token invalide.' });
  }
});

/**
 * Déconnexion. Aucune session serveur n'est conservée (l'état vit côté client),
 * donc on confirme simplement. Point d'extension si une révocation de token
 * Firebase/Google côté serveur devient nécessaire.
 */
authRouter.post('/logout', (_req, res) => res.json({ ok: true }));

/**
 * Bouton "Continuer avec Google ID" — étape 1 : redirige vers le consentement
 * Google. Activé dès que GOOGLE_OAUTH_CLIENT_ID / SECRET / REDIRECT_URI sont fournis.
 */
authRouter.get('/google', (_req, res) => {
  const missing = googleConfigMissing();
  if (missing.length) {
    return res.status(501).json({
      error: 'not_implemented',
      message: `OAuth Google non configuré (${missing.join(', ')}).`,
    });
  }
  const params = new URLSearchParams({
    client_id: config.google.clientId,
    redirect_uri: config.google.redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
  });
  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

/**
 * Étape 2 : Google renvoie un `code`. On l'échange contre un id_token, on lit
 * les claims, on synchronise Odoo, puis on renvoie le résultat au modal (popup).
 */
authRouter.get('/google/callback', async (req, res) => {
  const origin = config.allowedOrigin;
  const code = typeof req.query.code === 'string' ? req.query.code : undefined;

  if (req.query.error) {
    return res.send(popupResultHtml({ type: 'solarcell-sso', ok: false, error: String(req.query.error) }, origin));
  }
  if (!code) {
    return res.status(400).send(popupResultHtml({ type: 'solarcell-sso', ok: false, error: 'missing_code' }, origin));
  }
  const missing = [...googleConfigMissing(), ...assertOdooConfig()];
  if (missing.length) {
    return res.send(popupResultHtml({ type: 'solarcell-sso', ok: false, error: `config_missing: ${missing.join(', ')}` }, origin));
  }

  try {
    const claims = await exchangeCodeForClaims(code);
    const session = await syncInstaller(claims);
    return res.send(
      popupResultHtml(
        {
          type: 'solarcell-sso',
          ok: true,
          session: { ...session, user: { email: claims.email, name: claims.name, picture: claims.picture } },
        },
        origin,
      ),
    );
  } catch (err: unknown) {
    return res.send(popupResultHtml({ type: 'solarcell-sso', ok: false, error: (err as Error)?.message ?? 'google_failed' }, origin));
  }
});
