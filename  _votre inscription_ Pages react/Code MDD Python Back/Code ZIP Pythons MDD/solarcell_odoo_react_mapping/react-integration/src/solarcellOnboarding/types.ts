export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type OnboardingStepId = 'personal' | 'professional' | 'skills' | 'documents' | 'training' | 'contract' | 'wallet';

export type PersonalPayload = {
  firstName: string;
  lastName: string;
  birthDate: string; // YYYY-MM-DD or DD/MM/YYYY; Odoo mapper accepts both
  birthCountry: string;
  nationality: string;
  email: string;
  phone: string;
  street: string;
  zip: string;
  city: string;
  country: string;
  language?: string;
  timezone?: string;
  privacyAccepted?: boolean;
};

export type ProfessionalPayload = {
  structureType: 'sole_trader' | 'company' | 'freelance' | 'association' | 'other' | 'ei';
  companyName: string;
  siret?: string;
  vat?: string;
  apeNaf?: string;
  street: string;
  zip: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
  creationYear?: number;
  employeeRange?: '0' | '1_5' | '6_20' | '21_50' | '50_plus';
  mainActivity?: string;
};

export type SkillPayload = {
  code: string;
  label: string;
  level: SkillLevel | 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
};

export type SkillsPayload = {
  skills: SkillPayload[];
  yearsExperience?: '1_3' | '3_5' | '5_plus' | '1 à 3 ans' | '3 à 5 ans' | 'Plus de 5 ans';
  installationsRange?: '1_10' | '10_50' | '50_plus' | '1 à 10' | '10 à 50' | '50+';
};

export type TrainingCoursePayload = {
  code: string;
  title: string;
  progress: number;
  status?: 'not_started' | 'in_progress' | 'completed' | 'failed';
  score?: number;
};

export type ContractPayload = {
  acceptedTerms: boolean;
  version?: string;
  signatureProvider?: 'none' | 'oca' | 'yousign' | 'docusign';
  providerEnvelopeId?: string;
};

export type WalletPayload = {
  walletType: 'integrated' | 'external';
  network?: 'solarcell' | 'polygon' | 'ethereum';
  publicAddress?: string;
  providerRef?: string;
  recoveryConfirmed?: boolean;
};

export type SolarOnboardingApplication = {
  id: number;
  reference: string;
  currentStep: string;
  progressPercent: number;
  partnerId: number;
  companyPartnerId?: number | null;
  statuses: {
    kyc: string;
    kyb: string;
    training: string;
    contract: string;
    wallet: string;
  };
};

export type SolarApiResponse<T> = {
  ok: boolean;
  application?: SolarOnboardingApplication;
  document?: T;
  error?: string;
};
