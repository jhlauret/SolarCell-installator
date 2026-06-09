import { httpClient } from '../../../shared/api/httpClient';
import type { OnboardingStepId } from '../types';

export type OnboardingPrefillData = {
  personal?: {
    firstName?: string; lastName?: string; birthDate?: string;
    birthCountry?: string; nationality?: string; email?: string;
    phone?: string; address?: string; zip?: string; city?: string;
    country?: string; preferredLang?: string; timezone?: string;
  };
  professional?: {
    companyType?: string; companyName?: string; siret?: string;
    vatNumber?: string; apeCode?: string; proAddress?: string;
    proZip?: string; proCity?: string; proCountry?: string;
    proPhone?: string; proEmail?: string; creationYear?: string;
    employeeRange?: string; mainActivity?: string;
  };
  skills?: {
    selected: string[];
    levels: Record<string, string>;
    yearsExperience?: string;
    installations?: string;
  };
  wallet?: {
    walletType: 'integrated' | 'external';
    recoveryConfirmed: boolean;
  };
};

export type OnboardingStatus = {
  exists: boolean;
  installerId?: number;
  status?: string;
  onboardingStep?: OnboardingStepId;
  completedSteps: OnboardingStepId[];
};

export async function getOnboardingStatus(applicationId: number): Promise<OnboardingStatus> {
  const { data } = await httpClient.get<OnboardingStatus>('/onboarding/status', {
    params: { applicationId },
  });
  return data;
}

export async function savePersonalStep(applicationId: number, payload: {
  firstName: string;
  lastName: string;
  birthDate?: string;
  birthCountry?: string;
  nationality?: string;
  email: string;
  phone?: string;
  address?: string;
  zip?: string;
  city?: string;
  country?: string;
  preferredLang?: string;
  timezone?: string;
}): Promise<{ ok: boolean; installerId: number }> {
  const { data } = await httpClient.post('/onboarding/personal', { applicationId, ...payload });
  return data;
}

export async function saveProfessionalStep(applicationId: number, payload: {
  companyType?: string;
  companyName?: string;
  siret?: string;
  vatNumber?: string;
  apeCode?: string;
  proAddress?: string;
  proZip?: string;
  proCity?: string;
  proCountry?: string;
  proPhone?: string;
  proEmail?: string;
  creationYear?: number;
  employeeRange?: string;
  mainActivity?: string;
}): Promise<{ ok: boolean; installerId: number }> {
  const { data } = await httpClient.post('/onboarding/professional', { applicationId, ...payload });
  return data;
}

export async function saveSkillsStep(applicationId: number, payload: {
  skills: Array<{ domain: string; level: string }>;
  yearsExperience?: string;
  installations?: string;
}): Promise<{ ok: boolean; installerId: number }> {
  const { data } = await httpClient.post('/onboarding/skills', { applicationId, ...payload });
  return data;
}

export async function saveDocumentsStep(applicationId: number, payload: {
  documents: Array<{
    docType: string;
    category: string;
    filename: string;
    mimetype: string;
    fileBase64?: string;
  }>;
}): Promise<{ ok: boolean; installerId: number }> {
  const { data } = await httpClient.post('/onboarding/documents', { applicationId, ...payload });
  return data;
}

export async function saveWalletStep(applicationId: number, payload: {
  walletType: 'integrated' | 'external';
  walletAddress?: string;
  blockchain?: string;
  recoveryConfirmed?: boolean;
}): Promise<{ ok: boolean; installerId: number }> {
  const { data } = await httpClient.post('/onboarding/wallet', { applicationId, ...payload });
  return data;
}

export async function saveTrainingProgress(applicationId: number, payload: {
  progresses: Array<{ courseKey: string; progress: number; status: string }>;
}): Promise<{ ok: boolean; installerId: number }> {
  const { data } = await httpClient.post('/onboarding/training', { applicationId, ...payload });
  return data;
}

export async function finalizeOnboarding(applicationId: number): Promise<{ ok: boolean; status: string }> {
  const { data } = await httpClient.post('/onboarding/finalize', { applicationId });
  return data;
}

export async function getOnboardingData(applicationId: number): Promise<OnboardingPrefillData> {
  const { data } = await httpClient.get<OnboardingPrefillData>('/onboarding/data', {
    params: { applicationId },
  });
  return data;
}
