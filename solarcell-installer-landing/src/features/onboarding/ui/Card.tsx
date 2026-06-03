import type { HTMLAttributes } from 'react';
import { clsx } from '../../../shared/ui/clsx';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('rounded-[9px] border border-ink-200 bg-white shadow-card', className)} {...props} />;
}
