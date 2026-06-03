import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { clsx } from './clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-solar-600 text-white shadow-[0_10px_24px_rgba(16,163,58,0.22)] hover:bg-solar-700',
  secondary: 'border border-ink-300 bg-white text-ink-800 hover:border-solar-300 hover:text-solar-700',
  ghost: 'bg-transparent text-solar-700 hover:bg-solar-50'
};

export function Button({ children, className, variant = 'primary', ...props }: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={clsx(
        'inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-solar-500/30',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
