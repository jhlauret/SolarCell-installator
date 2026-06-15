import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '../../../shared/ui/Button';
import { GoogleGlyph } from './GoogleGlyph';
import { useAuthModalStore } from '../store/useAuthModalStore';
import { useSessionStore } from '../store/useSessionStore';
import { loginWithEmail, registerWithEmail, forgotPassword, checkProvider, googleLoginUrl, toAuthUser } from '../api/authApi';
import type { LoginResponse } from '../types';

type SubmitStatus = 'idle' | 'loading' | 'error' | 'success';
type View = 'login' | 'register' | 'forgot';

export function InstallerLoginModal() {
  const isOpen = useAuthModalStore((state) => state.isOpen);
  const close = useAuthModalStore((state) => state.close);
  const setUser = useSessionStore((state) => state.setUser);

  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [googleSuggestion, setGoogleSuggestion] = useState(false);

  const reset = () => {
    setStatus('idle');
    setError(null);
    setGoogleSuggestion(false);
    setPassword('');
    setConfirmPassword('');
  };

  const switchView = (v: View) => {
    reset();
    setView(v);
  };

  const handleSuccess = (response: LoginResponse) => {
    setUser(toAuthUser(response));
    reset();
    setEmail('');
    setView('login');
    close();
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;
    const bffOrigin = new URL(googleLoginUrl()).origin;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== bffOrigin) return;
      const data = event.data as { type?: string; ok?: boolean; session?: LoginResponse; error?: string };
      if (data?.type !== 'solarcell-sso') return;
      if (data.ok && data.session) {
        handleSuccess(data.session);
      } else {
        setStatus('error');
        setError(`Connexion Google impossible. ${data.error ?? ''}`.trim());
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const startGoogleLogin = () => {
    setStatus('loading');
    setError(null);
    window.open(googleLoginUrl(), 'solarcell-google-sso', 'width=480,height=640,menubar=no,toolbar=no');
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setError(null);
    setGoogleSuggestion(false);
    try {
      const result = await loginWithEmail({ email, password });
      handleSuccess(result);
    } catch {
      // Si identifiants invalides, vérifier le provider pour suggérer Google
      try {
        const methods = await checkProvider(email);
        if (methods.includes('google.com') && !methods.includes('password')) {
          setGoogleSuggestion(true);
          setStatus('error');
          setError('Ce compte utilise Google. Connectez-vous avec le bouton ci-dessus.');
          return;
        }
      } catch { /* noop */ }
      setStatus('error');
      setError('Identifiants incorrects ou compte inexistant.');
    }
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setStatus('error');
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 8) {
      setStatus('error');
      setError('Le mot de passe doit faire au moins 8 caractères.');
      return;
    }
    setStatus('loading');
    setError(null);
    try {
      const result = await registerWithEmail({ email, password });
      handleSuccess(result);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      if (msg === 'EMAIL_EXISTS') {
        setStatus('error');
        setError('Un compte existe déjà avec cet email. Connectez-vous ou réinitialisez votre mot de passe.');
      } else {
        setStatus('error');
        setError('Création impossible. Vérifiez vos informations et réessayez.');
      }
    }
  };

  const handleForgot = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setError(null);
    try {
      await forgotPassword(email);
      setStatus('success');
    } catch {
      setStatus('error');
      setError("Impossible d'envoyer l'email. Vérifiez l'adresse saisie.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="installer-login-title"
    >
      <div
        className="absolute inset-0 bg-[#0B1F2A]/45 backdrop-blur-[2px]"
        onClick={close}
        aria-hidden="true"
      />

      <div className="relative max-h-[90vh] w-full max-w-[420px] overflow-y-auto overflow-x-hidden rounded-[20px] bg-white shadow-[0_30px_80px_rgba(6,20,30,0.35)]">
        <div className="h-[6px] w-full bg-gradient-to-r from-[#1FB36A] via-[#37C97E] to-[#39D0E0]" />

        <div className="px-7 pb-7 pt-6">
          <div className="flex items-start justify-between">
            <span className="rounded-full bg-[#E8F6EC] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1E8E4C]">
              SolarCell SSO
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Fermer"
              className="-mr-1 -mt-1 flex h-8 w-8 items-center justify-center rounded-full text-[#5B6B73] transition hover:bg-[#F1F4F5] hover:text-[#0C1A24]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <h2 id="installer-login-title" className="mt-4 text-[24px] font-extrabold tracking-[-0.01em] text-[#0C1A24]">
            {view === 'login' && 'Connexion installateur'}
            {view === 'register' && 'Créer un compte'}
            {view === 'forgot' && 'Mot de passe oublié'}
          </h2>
          <p className="mt-1.5 text-[14px] leading-[1.5] text-[#5B6B73]">
            {view === 'login' && 'Accédez à votre espace formation, onboarding et synchronisation Odoo.'}
            {view === 'register' && 'Créez votre compte installateur SolarCell avec un email et un mot de passe.'}
            {view === 'forgot' && 'Entrez votre email pour recevoir un lien de réinitialisation.'}
          </p>

          {/* Vue Login */}
          {view === 'login' && (
            <>
              <button
                type="button"
                onClick={startGoogleLogin}
                className="mt-5 flex h-[50px] w-full items-center justify-center gap-3 rounded-[12px] border border-[#E2E6E9] bg-white text-[15px] font-bold text-[#1A2B33] transition hover:bg-[#F7F9FA]"
              >
                <GoogleGlyph className="h-5 w-5" />
                Continuer avec Google ID
              </button>

              <div className="my-4 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#9AA7AD]">
                <span className="h-px flex-1 bg-[#E6EAEC]" />
                ou
                <span className="h-px flex-1 bg-[#E6EAEC]" />
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <EmailField value={email} onChange={setEmail} />
                <PasswordField id="installer-password" label="Mot de passe" value={password} onChange={setPassword} />

                {status === 'error' && error && (
                  <p role="alert" className="text-[13px] font-semibold text-[#C0392B]">{error}</p>
                )}
                {googleSuggestion && (
                  <button type="button" onClick={startGoogleLogin}
                    className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-[#E2E6E9] bg-white py-2 text-[13px] font-bold text-[#1A2B33] transition hover:bg-[#F7F9FA]">
                    <GoogleGlyph className="h-4 w-4" /> Continuer avec Google
                  </button>
                )}

                <Button type="submit" size="md" disabled={status === 'loading'}
                  className="h-[50px] w-full rounded-[12px] text-[15px] disabled:opacity-70">
                  {status === 'loading' ? 'Connexion…' : 'Se connecter'}
                </Button>
              </form>

              <div className="mt-4 flex items-center justify-between text-[13px] font-bold text-[#16323D]">
                <button type="button" onClick={() => switchView('forgot')} className="hover:underline">
                  Mot de passe oublié ?
                </button>
                <button type="button" onClick={() => switchView('register')} className="hover:underline">
                  Créer un compte
                </button>
              </div>
            </>
          )}

          {/* Vue Register */}
          {view === 'register' && (
            <form onSubmit={handleRegister} className="mt-5 space-y-4">
              <EmailField value={email} onChange={setEmail} />
              <PasswordField id="reg-password" label="Mot de passe (min. 8 caractères)" value={password} onChange={setPassword} />
              <PasswordField id="reg-confirm" label="Confirmer le mot de passe" value={confirmPassword} onChange={setConfirmPassword} />

              {status === 'error' && error && (
                <p role="alert" className="text-[13px] font-semibold text-[#C0392B]">{error}</p>
              )}

              <Button type="submit" size="md" disabled={status === 'loading'}
                className="h-[50px] w-full rounded-[12px] text-[15px] disabled:opacity-70">
                {status === 'loading' ? 'Création…' : 'Créer mon compte'}
              </Button>

              <button type="button" onClick={() => switchView('login')}
                className="block w-full text-center text-[13px] font-bold text-[#16323D] hover:underline">
                Déjà un compte ? Se connecter
              </button>
            </form>
          )}

          {/* Vue Forgot */}
          {view === 'forgot' && (
            <form onSubmit={handleForgot} className="mt-5 space-y-4">
              <EmailField value={email} onChange={setEmail} />

              {status === 'error' && error && (
                <p role="alert" className="text-[13px] font-semibold text-[#C0392B]">{error}</p>
              )}
              {status === 'success' && (
                <p className="rounded-[10px] bg-[#E8F6EC] px-4 py-3 text-[13px] font-semibold text-[#1E8E4C]">
                  Email envoyé à <strong>{email}</strong>. Vérifiez votre boîte de réception.
                </p>
              )}

              {status !== 'success' && (
                <Button type="submit" size="md" disabled={status === 'loading'}
                  className="h-[50px] w-full rounded-[12px] text-[15px] disabled:opacity-70">
                  {status === 'loading' ? 'Envoi…' : 'Envoyer le lien'}
                </Button>
              )}

              <button type="button" onClick={() => switchView('login')}
                className="block w-full text-center text-[13px] font-bold text-[#16323D] hover:underline">
                Retour à la connexion
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-[12px] leading-[1.5] text-[#9AA7AD]">
            Les identifiants sont transmis au BFF sécurisé. La clé interne Odoo ne doit jamais être exposée côté navigateur.
          </p>
        </div>
      </div>
    </div>
  );
}

function EmailField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label htmlFor="installer-email" className="block text-[13px] font-bold text-[#2A3940]">Email</label>
      <input
        id="installer-email"
        type="email"
        required
        autoComplete="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="installateur@solarcell.demo"
        className="mt-1.5 h-[48px] w-full rounded-[12px] border border-[#E2E6E9] px-4 text-[15px] text-[#1A2B33] outline-none transition focus:border-[#37C97E] focus:ring-2 focus:ring-[#37C97E]/25"
      />
    </div>
  );
}

function PasswordField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-bold text-[#2A3940]">{label}</label>
      <input
        id={id}
        type="password"
        required
        autoComplete="current-password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••••"
        className="mt-1.5 h-[48px] w-full rounded-[12px] border border-[#E2E6E9] px-4 text-[15px] text-[#1A2B33] outline-none transition focus:border-[#37C97E] focus:ring-2 focus:ring-[#37C97E]/25"
      />
    </div>
  );
}
