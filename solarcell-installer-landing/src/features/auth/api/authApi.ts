import { httpClient } from '../../../shared/api/httpClient';
import type { InstallerLoginRequest, InstallerSession } from '../types';

/**
 * Envoie email + mot de passe au BFF sécurisé. Le navigateur ne touche jamais
 * Firebase ni Odoo directement : tout passe par le BFF.
 */
export async function loginWithEmail(payload: InstallerLoginRequest): Promise<InstallerSession> {
  const { data } = await httpClient.post<InstallerSession>('/auth/login', payload);
  return data;
}

/** URL de redirection vers l'OAuth Google côté BFF (bouton « Continuer avec Google ID »). */
export function googleLoginUrl(): string {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '');
  return `${base}/auth/google`;
}
