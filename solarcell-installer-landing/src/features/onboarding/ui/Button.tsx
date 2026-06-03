import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsxLite } from './clsxLite';

type ButtonVariant = 'primary' | 'outline' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-solar-600 text-white shadow-softGreen hover:bg-solar-700 disabled:bg-solar-200',
  outline: 'border border-solar-500 bg-white text-ink-900 hover:bg-solar-50',
  ghost: 'bg-transparent text-solar-700 hover:bg-solar-50'
};

export function Button({ className, variant = 'primary', leftIcon, rightIcon, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsxLite(
        'inline-flex h-[43px] min-w-[140px] items-center justify-center gap-3 rounded-[7px] px-5 text-[13px] font-extrabold transition focus:outline-none focus:ring-4 focus:ring-solar-500/15',
        variants[variant],
        className
      )}
      {...props}
    >
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
}
