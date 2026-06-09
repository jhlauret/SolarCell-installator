import 'dotenv/config';

/**
 * Configuration centralisée du BFF, lue depuis l'environnement (bff/.env).
 * Aucune valeur secrète n'est codée en dur : les secrets (clé API Odoo,
 * compte de service Firebase) restent côté serveur et ne transitent jamais
 * vers le navigateur.
 */
export const config = {
  port: Number(process.env.PORT ?? 8787),
  allowedOrigin: process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173',
  firebase: {
    webApiKey: process.env.FIREBASE_WEB_API_KEY ?? '',
    projectId: process.env.FIREBASE_PROJECT_ID ?? '',
    // Présence => Firebase Admin disponible (via GOOGLE_APPLICATION_CREDENTIALS).
    serviceAccountPath: process.env.GOOGLE_APPLICATION_CREDENTIALS ?? '',
  },
  odoo: {
    url: process.env.ODOO_URL ?? '',
    db: process.env.ODOO_DB ?? '',
    apiKey: process.env.ODOO_API_KEY ?? '',
    adminUser: process.env.ODOO_ADMIN_USER ?? 'gpttrace@gmail.com',
    adminPassword: process.env.ODOO_ADMIN_PASSWORD ?? '',
  },
  google: {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? '',
    redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI ?? '',
  },
};

/** Renvoie la liste des variables Odoo manquantes (vide = config OK). */
export function assertOdooConfig(): string[] {
  const missing: string[] = [];
  if (!config.odoo.url) missing.push('ODOO_URL');
  if (!config.odoo.db) missing.push('ODOO_DB');
  if (!config.odoo.apiKey) missing.push('ODOO_API_KEY');
  return missing;
}

/** Renvoie la liste des variables Firebase REST manquantes (vide = config OK). */
export function assertFirebaseRest(): string[] {
  const missing: string[] = [];
  if (!config.firebase.webApiKey) missing.push('FIREBASE_WEB_API_KEY');
  return missing;
}
