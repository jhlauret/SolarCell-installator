import type { HTMLAttributes } from 'react';
import { clsxLite } from './clsxLite';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsxLite('rounded-[9px] border border-ink-200 bg-white shadow-card', className)} {...props} />;
}
