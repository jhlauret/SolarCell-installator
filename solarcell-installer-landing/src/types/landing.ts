export type NavItem = {
  label: string;
  href: string;
  active?: boolean;
};

export type BenefitItem = {
  title: string;
  description: string;
  icon: 'coin' | 'clipboard' | 'graduation' | 'growth';
};

export type ImpactMetric = {
  label: string;
  value: string;
  icon: 'panel' | 'users' | 'target' | 'globe';
};

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
