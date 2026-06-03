import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from './clsx';

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

type SizePreset = {
  base: string;
  variants: Partial<Record<ButtonVariant, string>>;
};

// One Button shared across features. Each `size` is a self-contained design
// preset (the feature-specific looks that previously lived in three copies),
// so a given `variant` renders identically to before per size.
const sizes: Record<ButtonSize, SizePreset> = {
  // Landing CTAs — large, gradient primary.
  lg: {
    base: 'h-[53px] rounded-[7px] px-8 text-[15px] font-extrabold tracking-[-0.01em] transition',
    variants: {
      primary:
        'bg-gradient-to-r from-[#37A853] to-[#008E40] text-white shadow-button hover:brightness-[1.03] active:translate-y-px',
      secondary:
        'border border-[#86C78B] bg-white/82 text-solar-text shadow-[0_8px_22px_rgba(4,48,43,0.08)] hover:bg-white',
      outline: 'border border-[#168A3D] bg-white/68 text-[#0B7D37] hover:bg-white',
    },
  },
  // Training-program buttons — medium, rounded-xl.
  md: {
    base: 'h-11 gap-2 rounded-xl px-5 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-solar-500/30',
    variants: {
      primary: 'bg-solar-600 text-white shadow-[0_10px_24px_rgba(16,163,58,0.22)] hover:bg-solar-700',
      secondary: 'border border-ink-300 bg-white text-ink-800 hover:border-solar-300 hover:text-solar-700',
      ghost: 'bg-transparent text-solar-700 hover:bg-solar-50',
    },
  },
  // Onboarding flow buttons — compact, icon-friendly.
  sm: {
    base: 'h-[43px] min-w-[140px] gap-3 rounded-[7px] px-5 text-[13px] font-extrabold transition focus:outline-none focus:ring-4 focus:ring-solar-500/15',
    variants: {
      primary: 'bg-solar-600 text-white shadow-softGreen hover:bg-solar-700 disabled:bg-solar-200',
      outline: 'border border-solar-500 bg-white text-ink-900 hover:bg-solar-50',
      ghost: 'bg-transparent text-solar-700 hover:bg-solar-50',
    },
  },
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function Button({
  size = 'lg',
  variant = 'primary',
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  const preset = sizes[size];
  return (
    <button
      className={clsx('inline-flex items-center justify-center', preset.base, preset.variants[variant], className)}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
