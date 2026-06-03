import { SiteHeader } from '../../shared/layout/SiteHeader';
import { HeroSection } from './components/HeroSection';
import { BenefitStrip } from './components/BenefitStrip';
import { ImpactPanel } from './components/ImpactPanel';

export function SolarLandingPage() {
  return (
    <main className="solar-page-shell relative overflow-hidden" id="home">
      <HeroSection>
        <SiteHeader />
      </HeroSection>
      <section className="relative z-20 mx-auto -mt-[26px] w-full max-w-[1342px] px-4 sm:px-6 lg:px-0">
        <BenefitStrip />
        <ImpactPanel />
      </section>
    </main>
  );
}
