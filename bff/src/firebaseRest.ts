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

export async function signInWithPassword(email: string, password: string): Promise<FirebaseRestUser> {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.firebase.webApiKey}`;
  const { data } = await axios.post<FirebaseRestUser>(
    url,
    { email, password, returnSecureToken: true },
    { headers: { 'Content-Type': 'application/json' }, timeout: 15000 },
  );
  return data;
}
