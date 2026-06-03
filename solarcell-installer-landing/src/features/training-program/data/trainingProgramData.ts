import {
  Award,
  BatteryCharging,
  CalendarDays,
  GraduationCap,
  Headphones,
  LineChart,
  MonitorPlay,
  PanelTop,
  PlaySquare,
  Trophy,
  Zap,
  FileText,
  ClipboardCheck,
  Clock3
} from 'lucide-react';
import type { LearningOutcome, TrainingModule, TrainingStat } from '../types/training';

export const heroBadges: TrainingStat[] = [
  { label: '100% en ligne\nÀ votre rythme', value: '', icon: MonitorPlay },
  { label: 'Certificat SolarCell\nà la clé', value: '', icon: Award },
  { label: 'Accès 12 mois\naux contenus', value: '', icon: CalendarDays },
  { label: 'Support expert\ndédié', value: '', icon: Headphones }
];

export const summaryStats: TrainingStat[] = [
  { label: 'Durée totale', value: '14 h 30', icon: Clock3 },
  { label: 'Vidéos', value: '38', icon: PlaySquare },
  { label: 'Ressources', value: '26', icon: FileText },
  { label: 'Quiz & exercices', value: '18', icon: ClipboardCheck }
];

export const trainingModules: TrainingModule[] = [
  {
    id: 'autoconsommation',
    order: 1,
    label: 'Module 1',
    title: 'Les principes de l’autoconsommation',
    description:
      'Comprenez les fondamentaux de l’autoconsommation solaire pour concevoir des solutions adaptées aux besoins de vos clients.',
    icon: Zap,
    bullets: [
      'Comprendre l’autoconsommation solaire',
      'Production vs consommation',
      'Les flux d’énergie dans une installation',
      'Les bénéfices économiques',
      'Principes clés de sécurité et d’usage'
    ],
    meta: {
      duration: '4 h 00',
      videos: '12 vidéos',
      resources: '8 ressources',
      quiz: 'Quiz final'
    },
    progress: 100,
    status: 'completed',
    actionLabel: 'Revoir le module'
  },
  {
    id: 'panneaux-solaires',
    order: 2,
    label: 'Module 2',
    title: 'L’installation des panneaux solaires',
    description:
      'Apprenez à installer des panneaux solaires en respectant les bonnes pratiques techniques et les normes en vigueur.',
    icon: PanelTop,
    bullets: [
      'Préparation du site et analyse',
      'Positionnement et orientation des panneaux',
      'Structure de fixation et montage',
      'Raccordements électriques',
      'Mise en service et bonnes pratiques'
    ],
    meta: {
      duration: '5 h 00',
      videos: '14 vidéos',
      resources: '9 ressources',
      quiz: 'Quiz final'
    },
    progress: 60,
    status: 'in_progress',
    actionLabel: 'Continuer le module'
  },
  {
    id: 'zendure-4000-pro',
    order: 3,
    label: 'Module 3',
    title: 'L’installation du Zendure 4000 Pro',
    description:
      'Maîtrisez l’installation et la configuration du système de stockage Zendure 4000 Pro pour optimiser l’autoconsommation.',
    icon: BatteryCharging,
    bullets: [
      'Présentation du système Zendure 4000 Pro',
      'Câblage et configuration pas à pas',
      'Connexion à la production solaire',
      'Gestion du stockage et de l’énergie',
      'Vérifications de sécurité et recommandations'
    ],
    meta: {
      duration: '5 h 30',
      videos: '12 vidéos',
      resources: '9 ressources',
      quiz: 'Quiz final'
    },
    progress: 0,
    status: 'not_started',
    actionLabel: 'Démarrer le module'
  }
];

export const learningOutcomes: LearningOutcome[] = [
  {
    title: 'Certification reconnue',
    description: 'Obtenez le certificat SolarCell et valorisez votre expertise.',
    icon: Trophy
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
    icon: LineChart
  }
];

export const moduleStatusLabels = {
  completed: 'Terminé',
  in_progress: 'En cours',
  not_started: 'À démarrer'
} as const;
