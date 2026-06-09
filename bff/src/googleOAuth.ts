import axios from 'axios';
import { config } from './config';
import type { InstallerClaims } from './odoo';

/**
 * OAuth Google côté serveur. Le navigateur ne voit jamais le client_secret :
 * le front ouvre `/auth/google` (redirection consentement Google), Google
 * renvoie un `code` sur `/auth/google/callback`, et le BFF échange ce code
 * contre un `id_token` (server-to-server, sur TLS) dont on lit les claims.
 */
type GoogleIdTokenPayload = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

function decodeJwtPayload(jwt: string): GoogleIdTokenPayload {
  const part = jwt.split('.')[1];
  const json = Buffer.from(part, 'base64').toString('utf8');
  return JSON.parse(json) as GoogleIdTokenPayload;
}

export function googleConfigMissing(): string[] {
  const missing: string[] = [];
  if (!config.google.clientId) missing.push('GOOGLE_OAUTH_CLIENT_ID');
  if (!config.google.clientSecret) missing.push('GOOGLE_OAUTH_CLIENT_SECRET');
  if (!config.google.redirectUri) missing.push('GOOGLE_OAUTH_REDIRECT_URI');
  return missing;
}

export async function exchangeCodeForClaims(code: string): Promise<InstallerClaims> {
  const body = new URLSearchParams({
    code,
    client_id: config.google.clientId,
    client_secret: config.google.clientSecret,
    redirect_uri: config.google.redirectUri,
    grant_type: 'authorization_code',
  });

  const { data } = await axios.post<{ id_token: string }>(
    'https://oauth2.googleapis.com/token',
    body.toString(),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 15000 },
  );

  const payload = decodeJwtPayload(data.id_token);
  return {
    uid: payload.sub,
    email: payload.email ?? '',
    email_verified: payload.email_verified,
    name: payload.name,
    picture: payload.picture,
    provider: 'google',
  };
}

/**
 * Petite page HTML rendue dans le popup : renvoie le résultat à la fenêtre
 * parente (le modal) via postMessage, puis se ferme. Si pas de parent, affiche
 * un message lisible.
 */
export function popupResultHtml(payload: Record<string, unknown>, targetOrigin: string): string {
  const safe = JSON.stringify(payload).replace(/</g, '\\u003c');
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>SolarCell SSO</title></head>
<body style="font-family:system-ui;padding:24px;color:#0C1A24">
<script>
(function(){
  var payload = ${safe};
  if (window.opener) {
    window.opener.postMessage(payload, ${JSON.stringify(targetOrigin)});
    window.close();
  } else {
    document.body.textContent = payload.ok ? 'Connexion Google réussie, vous pouvez fermer cette fenêtre.' : ('Échec de connexion Google : ' + (payload.error || ''));
  }
})();
</script>
<noscript>Activez JavaScript pour terminer la connexion.</noscript>
</body></html>`;
}
