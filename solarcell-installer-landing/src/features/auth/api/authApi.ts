import { httpClient } from '../../../shared/api/httpClient';
import type { AuthUser, InstallerLoginRequest, LoginResponse } from '../types';

/**
 * Envoie email + mot de passe au BFF sécurisé. Le navigateur ne touche jamais
 * Firebase ni Odoo directement : tout passe par le BFF.
 */
export async function loginWithEmail(payload: InstallerLoginRequest): Promise<LoginResponse> {
  const { data } = await httpClient.post<LoginResponse>('/auth/login', payload);
  return data;
}

/**
 * Déconnexion : prévient le BFF (best-effort, pour une éventuelle révocation
 * côté serveur), puis le store local est purgé par l'appelant.
 */
export async function logout(): Promise<void> {
  try {
    await httpClient.post('/auth/logout');
  } catch {
    // best-effort : la déconnexion locale ne doit jamais échouer à cause du réseau.
  }
}

/** URL de redirection vers l'OAuth Google côté BFF (bouton « Continuer avec Google ID »). */
export function googleLoginUrl(): string {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '');
  return `${base}/auth/google`;
}

/** Aplatit la réponse BFF (session + profil) en un utilisateur stockable. */
export function toAuthUser(response: LoginResponse): AuthUser {
  return {
    applicationId: response.applicationId,
    partnerId: response.partnerId,
    identityId: response.identityId,
    email: response.user?.email ?? '',
    name: response.user?.name,
    picture: response.user?.picture,
  };
}
