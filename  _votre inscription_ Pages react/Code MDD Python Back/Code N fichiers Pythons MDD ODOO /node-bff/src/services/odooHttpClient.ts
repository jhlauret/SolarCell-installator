import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';

export type OdooJsonRpcResult<T> = {
  jsonrpc?: '2.0';
  id?: number | string | null;
  result?: T;
  error?: { code?: number; message?: string; data?: unknown };
};

export class OdooHttpClient {
  private readonly client: AxiosInstance;

  constructor(baseURL: string, apiKey?: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30_000,
      headers: {
        ...(apiKey ? { 'X-SolarCell-Api-Key': apiKey } : {}),
      },
    });
  }

  async jsonRpc<T>(path: string, params: Record<string, unknown>): Promise<T> {
    const response = await this.client.post<OdooJsonRpcResult<T>>(path, {
      jsonrpc: '2.0',
      method: 'call',
      params,
      id: Date.now(),
    });

    if (response.data.error) {
      throw new Error(response.data.error.message || 'Odoo JSON-RPC error');
    }
    if (typeof response.data.result === 'undefined') {
      throw new Error('Odoo response does not contain result');
    }
    return response.data.result;
  }

  async uploadDocument<T>(applicationId: number, file: Express.Multer.File, requirementCode: string): Promise<T> {
    const form = new FormData();
    form.append('requirement_code', requirementCode);
    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
      knownLength: file.size,
    });

    const response = await this.client.post<T>(`/solar/onboarding/${applicationId}/documents`, form, {
      headers: form.getHeaders(),
      maxBodyLength: 12 * 1024 * 1024,
    });
    return response.data;
  }
}
