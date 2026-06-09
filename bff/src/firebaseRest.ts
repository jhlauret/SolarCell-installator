import axios from 'axios';
import { config } from './config';

/**
 * Connexion email / mot de passe via l'API REST Identity Toolkit de Firebase.
 * C'est une opération entièrement côté serveur : Firebase valide le mot de
 * passe et renvoie un idToken + les infos du compte. On évite ainsi d'embarquer
 * le SDK Firebase dans le navigateur.
 */
export type FirebaseRestUser = {
  idToken: string;
  localId: string;
  email: string;
  displayName?: string;
  profilePicture?: string;
  registered?: boolean;
};

const BASE = 'https://identitytoolkit.googleapis.com/v1';

function apiKey() {
  return `?key=${config.firebase.webApiKey}`;
}

function fbPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  return axios
    .post<T>(`${BASE}${path}${apiKey()}`, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    })
    .then((r) => r.data);
}

export async function signInWithPassword(email: string, password: string): Promise<FirebaseRestUser> {
  return fbPost<FirebaseRestUser>('/accounts:signInWithPassword', { email, password, returnSecureToken: true });
}

export async function registerWithPassword(email: string, password: string): Promise<FirebaseRestUser> {
  return fbPost<FirebaseRestUser>('/accounts:signUp', { email, password, returnSecureToken: true });
}

export async function sendPasswordReset(email: string): Promise<void> {
  await fbPost('/accounts:sendOobCode', { requestType: 'PASSWORD_RESET', email });
}

export async function fetchSignInMethods(email: string): Promise<string[]> {
  const continueUri = config.allowedOrigin || 'https://localhost';
  const data = await fbPost<{ signinMethods?: string[] }>('/accounts:createAuthUri', {
    identifier: email,
    continueUri,
  });
  return data.signinMethods ?? [];
}
