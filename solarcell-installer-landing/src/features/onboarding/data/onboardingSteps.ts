import { Award, BriefcaseBusiness, ClipboardCheck, FileText, GraduationCap, User, WalletCards } from 'lucide-react';
import type { OnboardingStep } from '../types';

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'personal',
    index: 1,
    sidebarLabel: 'Informations personnelles',
    title: 'Informations personnelles',
    description: 'Merci de renseigner vos informations personnelles. Tous les champs sont obligatoires.',
    icon: User
  },
  {
    id: 'professional',
    index: 2,
    sidebarLabel: 'Informations professionnelles',
    title: 'Informations professionnelles',
    description: 'Renseignez les informations relatives à votre activité professionnelle. Ces informations nous permettent de mieux vous connaître.',
    icon: BriefcaseBusiness
  },
  {
    id: 'skills',
    index: 3,
    sidebarLabel: 'Compétences',
    title: 'Compétences',
    description: "Indiquez vos compétences techniques et votre expérience dans le domaine de l’installation solaire.",
    icon: Award
  },
  {
    id: 'documents',
    index: 4,
    sidebarLabel: 'Upload documents\nKYC / KYB',
    title: 'Upload de documents KYC / KYB',
    description: 'Afin de valider votre candidature et conformément à la réglementation, merci de fournir les documents ci-dessous.',
    icon: ClipboardCheck
  },
  {
    id: 'training',
    index: 5,
    sidebarLabel: 'Formation',
    title: 'Formation',
    description: 'Suivez les formations obligatoires pour intégrer notre réseau d’installateurs et garantir des installations sûres et de qualité.',
    icon: GraduationCap
  },
  {
    id: 'contract',
    index: 6,
    sidebarLabel: 'Contrat',
    title: 'Contrat',
    description: 'Veuillez lire attentivement votre contrat avant de le signer électroniquement. Ce contrat définit les conditions de collaboration et les modalités de rémunération en SolarCells.',
    icon: FileText
  },
  {
    id: 'wallet',
    index: 7,
    sidebarLabel: 'Wallet SolarCell',
    title: 'Wallet SolarCell',
    description: "Configurez votre wallet SolarCell pour recevoir vos récompenses en SolarCells. Vous pourrez suivre vos gains, vos transactions et l’historique de vos missions depuis votre tableau de bord.",
    icon: WalletCards
  }
];

export const stepById = Object.fromEntries(onboardingSteps.map((step) => [step.id, step])) as Record<string, OnboardingStep>;
