import type {
  ContractPayload,
  OnboardingStepId,
  PersonalPayload,
  ProfessionalPayload,
  SkillsPayload,
  SolarApiResponse,
  SolarOnboardingApplication,
  TrainingCoursePayload,
  WalletPayload,
} from './types';

const API_BASE_URL = import.meta.env.VITE_SOLARCELL_API_BASE_URL || 'http://localhost:8080/api/onboarding';

type StepPayload =
  | PersonalPayload
  | ProfessionalPayload
  | SkillsPayload
  | TrainingCoursePayload[]
  | ContractPayload
  | WalletPayload;

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(init.headers || {}),
    },
  });
  const body = await response.json();
  if (!response.ok || body.ok === false) {
    throw new Error(body.error || `HTTP ${response.status}`);
  }
  return body as T;
}

export async function startOnboarding(payload: {
  personal?: PersonalPayload;
  professional?: ProfessionalPayload;
  skills?: SkillsPayload;
  training?: TrainingCoursePayload[];
  contract?: ContractPayload;
  wallet?: WalletPayload;
}): Promise<SolarApiResponse<never>> {
  return request('/start', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function saveOnboardingStep(
  applicationId: number,
  step: Exclude<OnboardingStepId, 'documents'>,
  payload: StepPayload,
): Promise<SolarApiResponse<never>> {
  return request(`/${applicationId}/step/${step}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function uploadOnboardingDocument(
  applicationId: number,
  requirementCode: 'identity_document' | 'address_proof' | 'kbis_extract' | 'eu_vat_certificate' | 'professional_insurance',
  file: File,
): Promise<SolarApiResponse<{ id: number; requirementCode: string; status: string; attachmentId: number; checksum: string }>> {
  const form = new FormData();
  form.append('file', file);
  return request(`/${applicationId}/documents/${requirementCode}`, {
    method: 'POST',
    body: form,
  });
}

export async function getOnboardingStatus(applicationId: number): Promise<SolarApiResponse<SolarOnboardingApplication>> {
  return request(`/${applicationId}/status`, { method: 'GET' });
}
