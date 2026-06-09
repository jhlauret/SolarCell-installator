import { initializeApp, applicationDefault, type App } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { config } from './config';

/**
 * Firebase Admin — utilisé uniquement pour vérifier un idToken fourni par le
 * client (route /auth/firebase/session). Optionnel : nécessite un compte de
 * service (GOOGLE_APPLICATION_CREDENTIALS). Le login email/mot de passe via
 * l'API REST n'en a pas besoin.
 */
let app: App | null = null;

export function firebaseAdminAvailable(): boolean {
  return Boolean(config.firebase.serviceAccountPath);
}

function getApp(): App {
  if (app) return app;
  app = initializeApp({
    credential: applicationDefault(),
    projectId: config.firebase.projectId || undefined,
  });
  return app;
}

export async function verifyIdToken(idToken: string): Promise<DecodedIdToken> {
  return getAuth(getApp()).verifyIdToken(idToken);
}
