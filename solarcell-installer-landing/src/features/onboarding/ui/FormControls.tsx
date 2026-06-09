import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from '../../../shared/ui/clsx';

type FieldShellProps = {
  label: string;
  className?: string;
  children: ReactNode;
};

export function FieldShell({ label, className, children }: FieldShellProps) {
  return (
    <label className={clsx('block', className)}>
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}

export const TextField = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => <input ref={ref} className={clsx('input-base', props.className)} {...props} />,
);
TextField.displayName = 'TextField';

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  (props, ref) => <textarea ref={ref} className={clsx('min-h-[65px] resize-none rounded-[7px] border border-ink-300 bg-white px-3 py-3 text-[14px] text-ink-900 outline-none transition placeholder:text-ink-500 focus:border-solar-500 focus:ring-4 focus:ring-solar-500/10', props.className)} {...props} />,
);
TextAreaField.displayName = 'TextAreaField';

export const SelectField = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ children, className, ...props }, ref) => (
    <div className="relative">
      <select ref={ref} className={clsx('input-base appearance-none pr-10', className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-500" size={15} />
    </div>
  ),
);
SelectField.displayName = 'SelectField';
