import { httpClient } from '../../shared/api/httpClient';

export interface TrainingProgressPayload {
  applicationId: number;
  moduleId: string;
  progressPercent: number;
}

export async function saveTrainingProgress(payload: TrainingProgressPayload) {
  const response = await httpClient.post('/training/progress', payload);
  return response.data as { ok: boolean; progressId?: number };
}
