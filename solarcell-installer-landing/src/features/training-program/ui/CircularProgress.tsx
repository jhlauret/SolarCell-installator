import { clsx } from './clsx';

interface CircularProgressProps {
  value: number;
  className?: string;
}

export function CircularProgress({ value, className }: CircularProgressProps) {
  const normalized = Math.max(0, Math.min(value, 100));
  const background = `conic-gradient(#10a33a ${normalized * 3.6}deg, #e5eaf0 0deg)`;

  return (
    <div
      className={clsx('relative grid h-[96px] w-[96px] place-items-center rounded-full', className)}
      style={{ background }}
      aria-label={`Progression ${normalized}%`}
    >
      <div className="grid h-[74px] w-[74px] place-items-center rounded-full bg-white text-[22px] font-extrabold text-solar-700">
        {normalized}%
      </div>
    </div>
  );
}
