import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsxLite } from './clsxLite';

type FieldShellProps = {
  label: string;
  className?: string;
  children: ReactNode;
};

export function FieldShell({ label, className, children }: FieldShellProps) {
  return (
    <label className={clsxLite('block', className)}>
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}

export function TextField(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsxLite('input-base', props.className)} {...props} />;
}

export function TextAreaField(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={clsxLite('min-h-[65px] resize-none rounded-[7px] border border-ink-300 bg-white px-3 py-3 text-[14px] text-ink-900 outline-none transition placeholder:text-ink-500 focus:border-solar-500 focus:ring-4 focus:ring-solar-500/10', props.className)} {...props} />;
}

export function SelectField({ children, className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={clsxLite('input-base appearance-none pr-10', className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-500" size={15} />
    </div>
  );
}
