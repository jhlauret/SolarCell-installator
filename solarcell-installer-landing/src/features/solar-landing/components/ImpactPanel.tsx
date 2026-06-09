import { useNavigate } from 'react-router-dom';
import { metrics } from '../../../data/landingContent';
import { Button } from '../../../shared/ui/Button';
import { Icon } from '../../../shared/ui/Icon';
import { useSessionStore } from '../../auth/store/useSessionStore';

export function ImpactPanel() {
  const navigate = useNavigate();
  const user = useSessionStore((s) => s.user);
  return (
    <section
      id="program"
      data-testid="impact-panel"
      className="mt-[22px] grid min-h-[245px] overflow-hidden rounded-[15px] bg-[linear-gradient(135deg,#052D36_0%,#062B34_53%,#082D36_100%)] text-white shadow-[0_24px_58px_rgba(8,43,51,0.20)] lg:grid-cols-[385px_1fr_360px]"
    >
      <div className="relative px-[40px] pb-[32px] pt-[42px]">
        <h2 className="text-[25px] font-extrabold leading-[1.28] tracking-[-0.038em]">
          Ensemble, construisons
          <span className="block text-[#5DBD50]">un avenir plus durable.</span>
        </h2>
        <p className="mt-[20px] max-w-[330px] text-[14px] font-medium leading-[1.55] text-white/92">
          Chaque installation contribue à un monde plus propre et vous permet d’être récompensé pour votre expertise.
        </p>
        <svg className="absolute bottom-[29px] left-[39px] h-[20px] w-[20px] text-[#4EB654]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 19c8-1 12-6 14-14C11 6 6 11 5 19Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 19c3-5 6-8 11-11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="grid grid-cols-2 border-y border-white/10 md:grid-cols-4 lg:border-y-0 lg:border-l lg:border-r">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={`flex flex-col items-center justify-center px-4 py-8 text-center ${index > 0 ? 'md:border-l md:border-white/10' : ''}`}
          >
            <Icon name={metric.icon} className="h-[54px] w-[54px] text-[#4EB654]" strokeWidth={2.6} />
            <strong className="mt-[11px] block text-[26px] font-black leading-none tracking-[-0.045em] text-[#55B64F]">
              {metric.value}
            </strong>
            <span className="mt-[8px] max-w-[112px] text-[15px] font-medium leading-[1.35] text-white/96">{metric.label}</span>
          </div>
        ))}
      </div>

      <aside className="px-[52px] pb-[31px] pt-[43px]">
        <h3 className="text-[25px] font-extrabold tracking-[-0.04em]">Prêt à commencer ?</h3>
        <p className="mt-[14px] max-w-[240px] text-[16px] font-medium leading-[1.5] text-white/92">
          Rejoignez notre réseau d’installateurs partenaires.
        </p>
        <Button
          className="mt-[23px] h-[54px] w-[223px] rounded-[7px] text-[15px]"
          onClick={() => navigate('/onboarding/personal')}
        >
          {user ? 'Modifier mes informations' : 'Créer mon compte'}
        </Button>
      </aside>
    </section>
  );
}
