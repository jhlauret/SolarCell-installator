import type { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../../assets/solar-installer-hero.png';
import { heroCopy } from '../../../data/landingContent';
import { Button } from '../../../shared/ui/Button';
import { Icon } from '../../../shared/ui/Icon';
import { useSessionStore } from '../../auth/store/useSessionStore';

export function HeroSection({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const user = useSessionStore((s) => s.user);
  return (
    <section className="relative min-h-[611px] overflow-hidden lg:min-h-[612px]">
      <img
        src={heroImage}
        alt="Installateur SolarCell sur une toiture photovoltaïque"
        className="absolute right-0 top-[35px] h-[566px] w-[66.4vw] min-w-[780px] object-cover object-center opacity-100 max-lg:right-[-230px] max-lg:opacity-35"
      />
      <div className="hero-soft-mask absolute inset-0 z-10" />
      {children}

      <div className="relative z-20 mx-auto w-full max-w-[1342px] px-4 sm:px-6 lg:px-0">
        <div className="max-w-[615px] pt-[41px]">
          <p className="sr-only">{heroCopy.eyebrow}</p>
          <h1 className="text-[45px] font-black leading-[1.12] tracking-[-0.055em] text-solar-ink sm:text-[55px] sm:leading-[1.11]">
            <span className="block">{heroCopy.titleLines[0]}</span>
            <span className="block">{heroCopy.titleLines[1]}</span>
            <span className="block text-[#49A84C]">{heroCopy.titleLines[2]}</span>
          </h1>

          <p className="mt-[24px] max-w-[515px] text-[18px] font-semibold leading-[1.48] tracking-[-0.018em] text-[#132B33]">
            Rejoignez le réseau d’installateurs partenaires SolarCell et soyez récompensé en{' '}
            <strong className="font-extrabold text-[#248B3B]">SolarCells</strong> pour chaque installation réalisée.
          </p>

          <div className="mt-[34px] flex flex-wrap gap-[25px]">
            <Button className="w-[232px]" onClick={() => navigate('/onboarding/personal')}>
              {user ? 'Modifier mes informations' : 'Rejoindre le programme'}
            </Button>
            <Button variant="secondary" className="w-[178px] gap-[10px]">
              <Icon name="play" className="h-[21px] w-[21px] text-[#0B8A3A]" strokeWidth={2.3} />
              Voir la vidéo
            </Button>
          </div>

          <div className="mt-[28px] flex items-center gap-[10px] text-[14px] font-medium tracking-[-0.01em] text-[#39494E]">
            <Icon name="shield" className="h-[19px] w-[19px] text-[#43A047]" strokeWidth={2.2} />
            <span>{heroCopy.reassurance}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
