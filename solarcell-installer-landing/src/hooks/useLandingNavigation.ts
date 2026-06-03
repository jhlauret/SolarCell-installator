import { navItems } from '../data/landingContent';
import { useLandingStore } from '../store/useLandingStore';

export function useLandingNavigation() {
  const activeSection = useLandingStore((state) => state.activeSection);
  const setActiveSection = useLandingStore((state) => state.setActiveSection);

  return {
    items: navItems.map((item) => ({ ...item, active: item.label === activeSection })),
    setActiveSection,
  };
}
