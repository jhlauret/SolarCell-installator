import { clsxLite } from './clsxLite';

type ProgressBarProps = {
  value: number;
  className?: string;
};

export function ProgressBar({ value, className }: ProgressBarProps) {
  return (
    <div className={clsxLite('h-[7px] overflow-hidden rounded-full bg-ink-200', className)} aria-label={`Progression ${value}%`}>
      <div className="h-full rounded-full bg-solar-500 transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
