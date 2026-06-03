import type { BenefitItem, ImpactMetric, NavItem } from '../types/landing';

export const navItems: NavItem[] = [
  { label: 'Accueil', href: '#home', active: true },
  { label: 'Le programme', href: '/formation' },
  { label: 'Avantages', href: '#benefits' },
  { label: 'Comment ça marche ?', href: '#how' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export const benefits: BenefitItem[] = [
  {
    title: 'Gagnez des SolarCells',
    description: 'Soyez rémunéré en SolarCells pour chaque installation validée.',
    icon: 'coin',
  },
  {
    title: 'Missions proches de vous',
    description: 'Accédez à des missions dans votre zone géographique selon vos compétences.',
    icon: 'clipboard',
  },
  {
    title: 'Formations incluses',
    description: 'Bénéficiez de formations et de ressources pour développer vos compétences.',
    icon: 'graduation',
  },
  {
    title: 'Évoluez avec nous',
    description: 'Progressez dans le programme et augmentez vos gains avec des bonus.',
    icon: 'growth',
  },
];

export const metrics: ImpactMetric[] = [
  { value: '12 450+', label: 'Installations réalisées', icon: 'panel' },
  { value: '2 850+', label: 'Installateurs actifs', icon: 'users' },
  { value: '1,2M+', label: 'SolarCells distribués', icon: 'target' },
  { value: '15+', label: 'Pays concernés', icon: 'globe' },
];

export const heroCopy = {
  eyebrow: 'Programme installateurs partenaires',
  titleLines: ['Installez.', 'Contribuez.', 'Gagnez des SolarCells.'],
  description:
    'Rejoignez le réseau d’installateurs partenaires SolarCell et soyez récompensé en SolarCells pour chaque installation réalisée.',
  reassurance: 'Inscription gratuite • Programme sécurisé • Paiement en SolarCells',
};
