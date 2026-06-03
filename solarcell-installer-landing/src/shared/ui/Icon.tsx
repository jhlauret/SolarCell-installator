import type { BenefitItem, ImpactMetric } from '../../types/landing';

type IconName = BenefitItem['icon'] | ImpactMetric['icon'] | 'shield' | 'play' | 'language' | 'chevron';

type IconProps = {
  name: IconName;
  className?: string;
  strokeWidth?: number;
};

export function Icon({ name, className = 'h-6 w-6', strokeWidth = 2.2 }: IconProps) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'coin':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <circle cx="24" cy="24" r="18" {...common} />
          <circle cx="24" cy="24" r="12" {...common} />
          <path d="M28.5 18.6h-6.3a4 4 0 0 0 0 8h3.7a4 4 0 1 1 0 8h-6.6M24 15.8v4.1M24 32.2v4.1" {...common} />
        </svg>
      );
    case 'clipboard':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M16 10h-3.5A3.5 3.5 0 0 0 9 13.5v25A3.5 3.5 0 0 0 12.5 42h23a3.5 3.5 0 0 0 3.5-3.5v-25a3.5 3.5 0 0 0-3.5-3.5H32" {...common} />
          <rect x="16" y="6" width="16" height="8" rx="2.5" {...common} />
          <path d="m16 25 4 4 7-8M16 35h12M31.5 31.5l3 3 6-7" {...common} />
        </svg>
      );
    case 'graduation':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M5 18.5 24 9l19 9.5L24 28 5 18.5Z" {...common} />
          <path d="M13 23.2V31c0 4 5 7 11 7s11-3 11-7v-7.8M42.5 19v12" {...common} />
        </svg>
      );
    case 'growth':
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M9 39h31M12 34V22M22 34V15M32 34V25M13.5 18.5l7-6 8 8 10-12" {...common} />
          <path d="M33 8.5h5.5V14" {...common} />
        </svg>
      );
    case 'panel':
      return (
        <svg viewBox="0 0 56 56" className={className} aria-hidden="true">
          <path d="M17 24h22l5 21H12l5-21Z" {...common} />
          <path d="M22 24 20 45M34 24l2 21M15 34h26M28 8v7M14 14l5 5M42 14l-5 5M8 28h6M42 28h6" {...common} />
        </svg>
      );
    case 'users':
      return (
        <svg viewBox="0 0 56 56" className={className} aria-hidden="true">
          <circle cx="22" cy="20" r="8" {...common} />
          <path d="M8 46c1.8-9 7-14 14-14s12.2 5 14 14H8Z" {...common} />
          <circle cx="39" cy="22" r="6.5" {...common} />
          <path d="M34 34c5.8.4 10 4.7 11.7 12" {...common} />
        </svg>
      );
    case 'target':
      return (
        <svg viewBox="0 0 56 56" className={className} aria-hidden="true">
          <circle cx="28" cy="29" r="18" {...common} />
          <circle cx="28" cy="29" r="11" {...common} />
          <path d="M32.5 22h-7a4 4 0 1 0 0 8h4.7a4 4 0 0 1 0 8H23M28 18v4M28 38v4M39 15l5-5M40 10h4v4" {...common} />
        </svg>
      );
    case 'globe':
      return (
        <svg viewBox="0 0 56 56" className={className} aria-hidden="true">
          <circle cx="28" cy="28" r="19" {...common} />
          <path d="M10 27h10l5-7 6 15 5-8h10M27 9c-4.5 5.2-7 11.6-7 19s2.5 13.8 7 19M30 9c4.5 5.2 7 11.6 7 19s-2.5 13.8-7 19" {...common} />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12 3.3 18 6v5.2c0 4.2-2.4 7.1-6 9-3.6-1.9-6-4.8-6-9V6l6-2.7Z" {...common} />
          <path d="m9.3 12 1.9 1.9 4-4.4" {...common} />
        </svg>
      );
    case 'play':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M8.4 5.9v12.2L18 12 8.4 5.9Z" {...common} />
        </svg>
      );
    case 'language':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="9" {...common} />
          <path d="M3 12h18M12 3c2.4 2.7 3.5 5.7 3.5 9S14.4 18.3 12 21M12 3c-2.4 2.7-3.5 5.7-3.5 9S9.6 18.3 12 21" {...common} />
        </svg>
      );
    case 'chevron':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="m8 10 4 4 4-4" {...common} />
        </svg>
      );
    default:
      return null;
  }
}
