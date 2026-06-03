import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import type { ButtonVariant } from '../../types/landing';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-[#37A853] to-[#008E40] text-white shadow-button hover:brightness-[1.03] active:translate-y-px',
  secondary:
    'border border-[#86C78B] bg-white/82 text-solar-text shadow-[0_8px_22px_rgba(4,48,43,0.08)] hover:bg-white',
  outline: 'border border-[#168A3D] bg-white/68 text-[#0B7D37] hover:bg-white',
};

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    className?: string;
  }
>;

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-[53px] items-center justify-center rounded-[7px] px-8 text-[15px] font-extrabold tracking-[-0.01em] transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
