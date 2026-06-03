import type { LucideIcon } from 'lucide-react';

interface MetricBadgeProps {
  icon: LucideIcon;
  label: string;
  value?: string;
}

export function MetricBadge({ icon: Icon, label, value }: MetricBadgeProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Icon className="h-6 w-6 shrink-0 text-solar-600" aria-hidden="true" />
      <div className="leading-tight">
        {value && <p className="text-[15px] font-extrabold text-ink-950">{value}</p>}
        <p className="whitespace-pre-line text-[13px] font-semibold text-ink-700">{label}</p>
      </div>
    </div>
  );
}
