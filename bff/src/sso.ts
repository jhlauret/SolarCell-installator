import crypto from 'crypto';
import { config } from './config';

/** Chemins Odoo Learning autorisés (anti open-redirect). Clé = `id` du module côté front. */
const COURSE_PATHS: Record<string, string> = {
  // Module 3 — installation du Zendure SolarFlow 4000 Pro (syllabus Odoo Learning).
  'zendure-4000-pro': '/slides/module-3-installation-du-zendure-solarflow-4000-pro-1',
};

/** Renvoie le chemin Odoo d'un cours connu, ou null si l'identifiant est inconnu. */
export function coursePath(course: string): string | null {
  return COURSE_PATHS[course] ?? null;
}

/**
 * Génère un jeton SSO court-vécu (60s) pour le contrôleur Odoo
 * `/solar/sso/login`. Signé avec la même clé que `/solar/firebase/sync`
 * (`solarcell.internal_api_key` côté Odoo, `ODOO_API_KEY` ici).
 *
 * Si `redirect` est fourni, il est inclus dans le payload signé et le
 * controller Odoo redirigera vers ce chemin (deep-link, ex. cours Odoo
 * Learning) après ouverture de session, au lieu du fallback `/my`/`/odoo`.
 */
export function buildOdooSsoToken(email: string, redirect?: string): string {
  const payload = Buffer.from(
    JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + 60, ...(redirect ? { redirect } : {}) }),
  ).toString('base64url');
  const signature = crypto.createHmac('sha256', config.odoo.apiKey).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function odooSsoUrl(email: string, redirect?: string): string {
  const token = buildOdooSsoToken(email, redirect);
  return `${config.odoo.url.replace(/\/$/, '')}/solar/sso/login?token=${encodeURIComponent(token)}`;
}
