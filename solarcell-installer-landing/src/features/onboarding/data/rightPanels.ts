import { Award, BriefcaseBusiness, FileText, GraduationCap, ShieldCheck, User, WalletCards } from 'lucide-react';
import type { InfoPanel, OnboardingStepId } from '../types';

type RightPanels = {
  main: InfoPanel;
  secure?: { title: string; body: string; cta: string };
  tips?: { title: string; items: string[] };
  warning?: { title: string; body: string };
  summary?: boolean;
};

const securePanel = {
  title: 'Vos données sont sécurisées',
  body: 'Nous utilisons un chiffrement avancé pour protéger vos informations. Elles ne seront jamais partagées avec des tiers sans votre consentement.',
  cta: 'Voir notre politique de confidentialité'
};

export const rightPanels: Record<OnboardingStepId, RightPanels> = {
  personal: {
    main: {
      icon: User,
      title: 'Pourquoi ces informations ?',
      body: 'Ces informations nous permettent de créer votre profil, de vous proposer des missions adaptées et de vous rémunérer en SolarCells.',
      cta: 'En savoir plus'
    },
    secure: {
      title: 'Confidentialité',
      body: 'Nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles conformément au RGPD.',
      cta: 'Voir notre politique de confidentialité'
    }
  },
  professional: {
    main: {
      icon: BriefcaseBusiness,
      title: 'Pourquoi ces informations ?',
      body: 'Ces informations nous permettent de valider votre profil professionnel et de vous proposer des missions adaptées à votre structure et à votre activité.',
      cta: 'En savoir plus'
    },
    secure: securePanel,
    warning: {
      title: 'Important',
      body: 'Les informations saisies doivent être exactes et à jour. Elles pourront être vérifiées lors de l’étape de validation de votre dossier.'
    }
  },
  skills: {
    main: {
      icon: Award,
      title: 'Pourquoi ces informations ?',
      body: 'Vos compétences nous permettent de vous proposer des missions adaptées à votre niveau et de garantir la qualité des installations.',
      cta: 'En savoir plus'
    },
    secure: securePanel,
    warning: {
      title: 'Important',
      body: 'Soyez le plus précis possible dans l’évaluation de vos compétences. Des vérifications pourront être effectuées lors de vos premières missions.'
    }
  },
  documents: {
    main: {
      icon: ShieldCheck,
      title: 'Pourquoi ces documents ?',
      body: 'Ces documents nous permettent de vérifier votre identité et votre entreprise conformément aux exigences légales et d’assurer la sécurité de la plateforme.',
      cta: 'En savoir plus'
    },
    tips: {
      title: 'Conseils pour de meilleurs uploads',
      items: [
        'Assurez-vous que le document est bien lisible',
        'Utilisez des photos lumineuses et nettes',
        'Le document doit être complet (pas de découpe)',
        'Vérifiez la date de validité des documents'
      ]
    },
    warning: {
      title: 'Important',
      body: 'Les documents doivent être valides. Tout document expiré ou illisible peut entraîner un refus de votre candidature.'
    }
  },
  training: {
    main: {
      icon: GraduationCap,
      title: 'Pourquoi ces formations ?',
      body: 'Ces formations sont conçues pour vous donner les compétences nécessaires et assurer la qualité, la sécurité et la conformité de vos installations.',
      cta: 'En savoir plus'
    },
    secure: securePanel,
    warning: {
      title: 'Important',
      body: 'Vous devez compléter toutes les formations obligatoires pour pouvoir valider votre dossier et accéder aux missions.'
    }
  },
  contract: {
    main: {
      icon: FileText,
      title: 'À propos du contrat',
      body: 'Ce contrat formalise notre partenariat et garantit une collaboration transparente et sécurisée. Il inclut vos droits, vos obligations et les modalités de rémunération en SolarCells.',
      cta: 'En savoir plus'
    },
    secure: securePanel,
    warning: {
      title: 'Important',
      body: 'La signature électronique a la même valeur légale qu’une signature manuscrite. Vous pourrez télécharger une copie signée après validation.'
    }
  },
  wallet: {
    main: {
      icon: WalletCards,
      title: 'À propos de votre wallet',
      body: 'Recevez vos SolarCells, suivez vos gains et retirez à tout moment vers votre wallet externe ou utilisez-les dans l’écosystème SolarCell.',
      cta: 'En savoir plus'
    },
    summary: true
  }
};
