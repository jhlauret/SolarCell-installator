import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '../../../shared/ui/Button';
import { GoogleGlyph } from './GoogleGlyph';
import { useAuthModalStore } from '../store/useAuthModalStore';
import { useSessionStore } from '../store/useSessionStore';
import { loginWithEmail, googleLoginUrl, toAuthUser } from '../api/authApi';
import type { LoginResponse } from '../types';

type SubmitStatus = 'idle' | 'loading' | 'error';

/**
 * Modal « Connexion installateur » — overlay SSO conforme à la maquette.
 * S'ouvre via le store quand l'utilisateur clique sur « Se connecter ». Le login
 * email/mot de passe passe par le BFF sécurisé ; le bouton Google redirige vers
 * l'OAuth server-side. Aucune logique Firebase/Odoo n'est exécutée côté front.
 */
export function InstallerLoginModal() {
  const isOpen = useAuthModalStore((state) => state.isOpen);
  const close = useAuthModalStore((state) => state.close);
  const setUser = useSessionStore((state) => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // Connexion réussie : on enregistre l'utilisateur (store + localStorage),
  // on réinitialise le formulaire et on ferme le modal. Le SiteHeader bascule
  // alors automatiquement sur l'affichage « connecté ».
  const handleSuccess = (response: LoginResponse) => {
    setUser(toAuthUser(response));
    setStatus('idle');
    setError(null);
    setEmail('');
    setPassword('');
    close();
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  // Résultat du popup OAuth Google (postMessage envoyé par le BFF).
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setError(null);
    try {
      const result = await loginWithEmail({ email, password });
      handleSuccess(result);
    } catch {
      setStatus('error');
      setError('Connexion impossible. Vérifiez vos identifiants ou réessayez plus tard.');
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

      <div className="relative w-full max-w-[420px] overflow-hidden rounded-[20px] bg-white shadow-[0_30px_80px_rgba(6,20,30,0.35)]">
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
            Connexion installateur
          </h2>
          <p className="mt-1.5 text-[14px] leading-[1.5] text-[#5B6B73]">
            Accédez à votre espace formation, onboarding et synchronisation Odoo.
          </p>

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

          <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="installer-email" className="block text-[13px] font-bold text-[#2A3940]">
                    Email
                  </label>
                  <input
                    id="installer-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="installateur@solarcell.demo"
                    className="mt-1.5 h-[48px] w-full rounded-[12px] border border-[#E2E6E9] px-4 text-[15px] text-[#1A2B33] outline-none transition focus:border-[#37C97E] focus:ring-2 focus:ring-[#37C97E]/25"
                  />
                </div>
                <div>
                  <label htmlFor="installer-password" className="block text-[13px] font-bold text-[#2A3940]">
                    Mot de passe
                  </label>
                  <input
                    id="installer-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••••"
                    className="mt-1.5 h-[48px] w-full rounded-[12px] border border-[#E2E6E9] px-4 text-[15px] text-[#1A2B33] outline-none transition focus:border-[#37C97E] focus:ring-2 focus:ring-[#37C97E]/25"
                  />
                </div>

                {status === 'error' && error && (
                  <p role="alert" className="text-[13px] font-semibold text-[#C0392B]">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  size="md"
                  disabled={status === 'loading'}
                  className="h-[50px] w-full rounded-[12px] text-[15px] disabled:opacity-70"
                >
                  {status === 'loading' ? 'Connexion…' : 'Se connecter'}
                </Button>
              </form>

          <button
            type="button"
            className="mt-4 block w-full text-center text-[14px] font-bold text-[#16323D] transition hover:underline"
          >
            Connexion directe Odoo
          </button>

          <p className="mt-5 text-center text-[12px] leading-[1.5] text-[#9AA7AD]">
            Les identifiants sont transmis au BFF sécurisé. La clé interne Odoo ne doit jamais être exposée côté navigateur.
          </p>
        </div>
      </div>
    </div>
  );
}
