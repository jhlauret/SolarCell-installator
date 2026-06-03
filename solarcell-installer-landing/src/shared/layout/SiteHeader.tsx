import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '../ui/BrandLogo';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { useLandingNavigation } from '../../hooks/useLandingNavigation';
import { useLandingStore } from '../../store/useLandingStore';

/**
 * Unified site chrome shared by the marketing landing page and the onboarding
 * wizard. Navigation anchors are absolute (`/#section`) so they route back to
 * the landing sections even when rendered on an `/onboarding/*` route.
 */
export function SiteHeader() {
  const { items, setActiveSection } = useLandingNavigation();
  const language = useLandingStore((state) => state.language);
  const navigate = useNavigate();

  return (
    <header className="relative z-30 mx-auto flex h-[99px] w-full max-w-[1415px] items-center justify-between px-4 pt-[2px] sm:px-6 lg:px-0">
      <BrandLogo />

      <nav className="hidden items-center gap-[30px] lg:flex" aria-label="Navigation principale">
        {items.map((item) => (
          <a
            key={item.label}
            href={`/${item.href}`}
            onClick={() => setActiveSection(item.label)}
            className={`relative py-4 text-[14px] font-semibold tracking-[-0.01em] transition ${
              item.active ? 'text-[#278B39]' : 'text-[#0F2530] hover:text-[#278B39]'
            }`}
          >
            {item.label}
            {item.active && <span className="absolute bottom-[2px] left-0 h-[2px] w-full rounded-full bg-[#43A047]" />}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-[18px]">
        <button className="hidden items-center gap-[7px] text-[14px] font-semibold text-[#10262D] sm:flex" type="button" aria-label="Changer de langue">
          <Icon name="language" className="h-[21px] w-[21px]" />
          {language}
          <Icon name="chevron" className="h-[15px] w-[15px]" strokeWidth={2.7} />
        </button>
        <Button variant="outline" className="hidden h-[44px] w-[139px] rounded-[7px] px-0 text-[14px] sm:inline-flex">
          Se connecter
        </Button>
        <Button
          className="h-[44px] w-[132px] rounded-[7px] px-0 text-[14px]"
          onClick={() => navigate('/onboarding/personal')}
        >
          S’inscrire
        </Button>
      </div>
    </header>
  );
}
