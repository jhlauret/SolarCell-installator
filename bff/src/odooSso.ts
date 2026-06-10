import crypto from 'node:crypto';
import { config } from './config';
import { odooSearch, odooRead } from './odooXmlRpc';

/**
 * SSO « deep-link » vers Odoo Learning.
 *
 * Le navigateur (utilisateur déjà connecté à la webapp) est redirigé vers le
 * BFF, qui résout l'email côté serveur, signe un jeton court (HMAC) et redirige
 * vers le controller Odoo `/solar/sso/login`. Le navigateur ne voit jamais la
 * clé interne ; le chemin du cours est dans le jeton signé (anti-tampering).
 */

/** Chemins Odoo autorisés (anti open-redirect). Clé = `id` du module côté front. */
const COURSE_PATHS: Record<string, string> = {
  // Module 3 — installation du Zendure SolarFlow 4000 Pro (syllabus Odoo Learning).
  'zendure-4000-pro': '/slides/module-3-installation-du-zendure-solarflow-4000-pro-1',
};

/** Renvoie le chemin Odoo d'un cours connu, ou null si l'identifiant est inconnu. */
export function coursePath(course: string): string | null {
  return COURSE_PATHS[course] ?? null;
}

function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Résout l'email vérifié de l'installateur à partir de son applicationId (côté serveur). */
export async function resolveInstallerEmail(applicationId: number): Promise<string> {
  const ids = await odooSearch('x_solarcell_installer', [['x_application_id', '=', applicationId]]);
  if (!ids.length) throw new Error('Dossier installateur introuvable');
  const [rec] = await odooRead('x_solarcell_installer', [ids[0]], ['x_email']);
  const email = String(rec?.x_email ?? '').trim();
  if (!email) throw new Error('Email installateur manquant');
  return email;
}

/**
 * Jeton SSO signé HMAC-SHA256 avec la clé interne partagée (`ODOO_API_KEY` =
 * paramètre système Odoo `solarcell.internal_api_key`). Durée de vie courte.
 * Format : `<payload base64url>.<signature base64url>`.
 */
export function signSsoToken(email: string, redirect: string, ttlSeconds = 60): string {
  const payload = { email, redirect, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const body = b64url(Buffer.from(JSON.stringify(payload)));
  const sig = b64url(crypto.createHmac('sha256', config.odoo.apiKey).update(body).digest());
  return `${body}.${sig}`;
}
