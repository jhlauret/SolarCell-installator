import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { clsxLite } from './clsxLite';

type IconBadgeProps = {
  icon: ComponentType<LucideProps>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClass = {
  sm: 'h-[44px] w-[44px]',
  md: 'h-[58px] w-[58px]',
  lg: 'h-[68px] w-[68px]'
};

const iconSize = {
  sm: 24,
  md: 32,
  lg: 38
};

export function IconBadge({ icon: Icon, size = 'md', className }: IconBadgeProps) {
  return (
    <div className={clsxLite('grid shrink-0 place-items-center rounded-[9px] bg-solar-50 text-solar-600', sizeClass[size], className)}>
      <Icon size={iconSize[size]} strokeWidth={2.1} />
    </div>
  );
}
