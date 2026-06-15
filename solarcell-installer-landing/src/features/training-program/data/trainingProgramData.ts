import {
  Award,
  BarChart3,
  CalendarDays,
  GraduationCap,
  Headphones,
  HousePlug,
  Monitor,
  PanelTop,
  ShieldCheck,
  Target,
  WalletCards
} from 'lucide-react';
import type { LearningBenefit, TrainingModule } from '../types/training';

export const trainingModules: TrainingModule[] = [
  {
    id: 'autoconsommation',
    courseKey: 'solar.training.autoconsommation',
    route: '/programme/modules/autoconsommation',
    label: 'Module 1',
    title: 'Les principes de l’autoconsommation',
    description:
      'Comprenez les fondamentaux de l’autoconsommation solaire pour concevoir des solutions adaptées aux besoins de vos clients.',
    progress: 100,
    status: 'completed',
    duration: '4 h 00',
    videos: 12,
    resources: 8,
    icon: HousePlug,
    bullets: [
      'Comprendre l’autoconsommation solaire',
      'Production vs consommation',
      'Les flux d’énergie dans une installation',
      'Les bénéfices économiques',
      'Principes clés de sécurité et d’usage'
    ]
  },
  {
    id: 'panneaux-solaires',
    courseKey: 'solar.training.panneaux_solaires',
    route: '/programme/modules/panneaux-solaires',
    label: 'Module 2',
    title: 'L’installation des panneaux solaires',
    description:
      'Apprenez à installer des panneaux solaires en respectant les bonnes pratiques techniques et les normes en vigueur.',
    progress: 60,
    status: 'in_progress',
    duration: '5 h 00',
    videos: 14,
    resources: 9,
    icon: PanelTop,
    bullets: [
      'Préparation du site et analyse',
      'Positionnement et orientation des panneaux',
      'Structure de fixation et montage',
      'Raccordements électriques',
      'Mise en service et bonnes pratiques'
    ]
  },
  {
    id: 'zendure-4000-pro',
    courseKey: 'solar.training.zendure_4000_pro',
    route: '/programme/modules/zendure-4000-pro',
    // Le bouton « Accéder au cours » du Module 3 redirige vers le syllabus Odoo (Odoo Learning).
    externalUrl: 'https://odoo.82.165.111.126.sslip.io/slides/module-3-installation-du-zendure-solarflow-4000-pro-1',
    label: 'Module 3',
    title: 'L’installation du Zendure 4000 Pro',
    description:
      'Maîtrisez l’installation et la configuration du système de stockage Zendure 4000 Pro pour optimiser l’autoconsommation.',
    progress: 0,
    status: 'not_started',
    duration: '5 h 30',
    videos: 12,
    resources: 9,
    icon: WalletCards,
    bullets: [
      'Présentation du système Zendure 4000 Pro',
      'Câblage et configuration pas à pas',
      'Connexion à la production solaire',
      'Gestion du stockage et de l’énergie',
      'Vérifications de sécurité et recommandations'
    ]
  }
];

export const heroBenefits = [
  { title: '100% en ligne', description: 'À votre rythme', icon: Monitor },
  { title: 'Certificat SolarCell', description: 'à la clé', icon: Award },
  { title: 'Accès 12 mois', description: 'aux contenus', icon: CalendarDays },
  { title: 'Support expert', description: 'dédié', icon: Headphones }
];

export const learningBenefits: LearningBenefit[] = [
  {
    title: 'Certification reconnue',
    description: 'Obtenez le certificat SolarCell et valorisez votre expertise.',
    icon: Award
  },
  {
    title: 'Montée en compétence',
    description: 'Des contenus complets, concrets et directement applicables.',
    icon: GraduationCap
  },
  {
    title: 'Support expert',
    description: 'Nos experts vous accompagnent à chaque étape.',
    icon: Headphones
  },
  {
    title: 'Progression suivie',
    description: 'Votre avancement est suivi et vos acquis validés.',
    icon: BarChart3
  }
];

export const summaryStats = [
  { label: 'Durée totale', value: '14 h 30', icon: CalendarDays },
  { label: 'Vidéos', value: '38', icon: Monitor },
  { label: 'Ressources', value: '26', icon: ShieldCheck },
  { label: 'Quiz & exercices', value: '18', icon: Target }
];
