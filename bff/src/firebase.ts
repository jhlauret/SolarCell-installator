import * as admin from 'firebase-admin';
import { config } from './config';

/**
 * Firebase Admin — utilisé uniquement pour vérifier un idToken fourni par le
 * client (route /auth/firebase/session). Optionnel : nécessite un compte de
 * service (GOOGLE_APPLICATION_CREDENTIALS). Le login email/mot de passe via
 * l'API REST n'en a pas besoin.
 */
let app: admin.app.App | null = null;

export function firebaseAdminAvailable(): boolean {
  return Boolean(config.firebase.serviceAccountPath);
}

function getApp(): admin.app.App {
  if (app) return app;
  app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: config.firebase.projectId || undefined,
  });
  return app;
}

export async function verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  return getApp().auth().verifyIdToken(idToken);
}
