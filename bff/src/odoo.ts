import axios from 'axios';
import { config } from './config';

/**
 * Appelle l'endpoint Odoo `POST /solar/firebase/sync`.
 * Le controller lit directement le body JSON (pas de wrapper JSON-RPC).
 * La clé secrète est transmise via l'en-tête `X-SolarCell-Api-Key`.
 */
export type InstallerClaims = {
  uid: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  provider?: string;
};

export type InstallerSession = {
  applicationId: number;
  partnerId: number;
  identityId: number;
};

export async function syncInstaller(claims: InstallerClaims): Promise<InstallerSession> {
  const endpoint = `${config.odoo.url.replace(/\/$/, '')}/solar/firebase/sync`;
  const { data } = await axios.post(
    endpoint,
    { ...claims },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-SolarCell-Api-Key': config.odoo.apiKey,
      },
      timeout: 15000,
    },
  );

  const result = data?.result ?? data;

  if (result?.error) {
    const message = result.error?.message ?? 'Erreur Odoo inconnue';
    throw new Error(`Odoo: ${message}`);
  }
  return {
    applicationId: result.applicationId,
    partnerId: result.partnerId,
    identityId: result.identityId,
  };
}
