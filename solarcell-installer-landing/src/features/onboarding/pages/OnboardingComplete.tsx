import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { CheckCircle2, GraduationCap, Home, WalletCards } from 'lucide-react';
import { SiteHeader } from '../../../shared/layout/SiteHeader';
import { Button } from '../../../shared/ui/Button';
import { useSessionStore } from '../../auth/store/useSessionStore';
import { useOnboardingStore } from '../store/onboardingStore';
import { onboardingSteps } from '../data/onboardingSteps';
import { finalizeOnboarding } from '../api/onboardingApi';

type FinalizeStatus = 'finalizing' | 'done' | 'error';

/**
 * Écran de fin de parcours, affiché après l'étape 7 (wallet). Au montage, il
 * finalise le dossier côté serveur (statut Odoo « submitted ») puis propose la
 * suite : accéder à la formation ou revenir à l'accueil. La finalisation est
 * non bloquante — l'étape wallet est déjà enregistrée, donc même si l'appel
 * échoue on confirme l'inscription à l'utilisateur.
 */
export function OnboardingComplete() {
  const navigate = useNavigate();
  const user = useSessionStore((s) => s.user);
  const completedSteps = useOnboardingStore((s) => s.completedSteps);
  const [status, setStatus] = useState<FinalizeStatus>('finalizing');

  const applicationId = user?.applicationId;

  useEffect(() => {
    if (!applicationId) return;
    let active = true;
    finalizeOnboarding(applicationId)
      .then(() => active && setStatus('done'))
      .catch(() => active && setStatus('error'));
    return () => {
      active = false;
    };
  }, [applicationId]);

  // Accès direct à l'URL sans dossier : on renvoie au début du parcours.
  if (!applicationId) {
    return <Navigate to="/onboarding/personal" replace />;
  }

  const totalSteps = onboardingSteps.length;
  const doneCount = Math.min(completedSteps.length, totalSteps);

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-ink-200">
        <SiteHeader />
      </div>

      <main className="flex justify-center px-4 py-[56px]">
        <div className="w-full max-w-[520px] overflow-hidden rounded-[20px] bg-white shadow-[0_30px_80px_rgba(6,20,30,0.18)] ring-1 ring-ink-100">
          <div className="h-[6px] w-full bg-gradient-to-r from-[#1FB36A] via-[#37C97E] to-[#39D0E0]" />

          <div className="px-8 pb-9 pt-8 text-center">
            <span className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#E8F6EC]">
              <CheckCircle2 className="text-solar-600" size={44} strokeWidth={2.2} />
            </span>

            <h1 className="mt-5 text-[28px] font-black tracking-[-0.02em] text-ink-900">
              Inscription terminée !
            </h1>
            <p className="mt-2 text-[15px] leading-[1.55] text-ink-700">
              Votre dossier est soumis et en cours de validation. Nos équipes reviennent vers vous
              après vérification de vos informations.
            </p>

            <div className="mt-6 space-y-3 rounded-[12px] bg-[#F6FAF7] px-5 py-4 text-left">
              <RecapRow
                icon={<CheckCircle2 className="text-solar-600" size={20} />}
                label={`${doneCount}/${totalSteps} étapes complétées`}
              />
              <RecapRow
                icon={<WalletCards className="text-solar-600" size={20} />}
                label="Wallet : activé"
              />
            </div>

            {status === 'error' && (
              <p className="mt-4 text-[13px] leading-[1.5] text-ink-500">
                La synchronisation finale sera réessayée automatiquement. Votre inscription est bien enregistrée.
              </p>
            )}

            <div className="mt-7 flex flex-col gap-3">
              <Button
                size="md"
                className="h-[50px] w-full rounded-[12px] text-[15px]"
                leftIcon={<GraduationCap size={20} />}
                onClick={() => navigate('/formation')}
              >
                Accéder à la formation
              </Button>
              <Button
                size="md"
                variant="secondary"
                className="h-[50px] w-full rounded-[12px] text-[15px]"
                leftIcon={<Home size={20} />}
                onClick={() => navigate('/')}
              >
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function RecapRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 text-[14px] font-semibold text-ink-900">
      <span className="shrink-0">{icon}</span>
      {label}
    </div>
  );
}
