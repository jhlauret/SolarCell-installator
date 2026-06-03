import axios from 'axios';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export type ApiEnvelope<T> = {
  data: T;
  meta?: Record<string, unknown>;
};
