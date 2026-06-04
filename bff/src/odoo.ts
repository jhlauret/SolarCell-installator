import axios from 'axios';
import { config } from './config';

/**
 * Appelle l'endpoint Odoo `POST /solar/firebase/sync` (controller `type='json'`
 * du module `solarcell_installer_onboarding`). On envoie les claims Firebase
 * DÉJÀ vérifiés, protégés par l'en-tête secret `X-SolarCell-Api-Key`.
 *
 * Comme le controller Odoo est de type JSON-RPC, la charge utile est encapsulée
 * dans `{ jsonrpc, method, params }` et la réponse est lue dans `result`.
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
    { jsonrpc: '2.0', method: 'call', params: { ...claims, db: config.odoo.db } },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-SolarCell-Api-Key': config.odoo.apiKey,
      },
      timeout: 15000,
    },
  );

  if (data?.error) {
    const message = data.error?.data?.message ?? data.error?.message ?? 'Erreur Odoo inconnue';
    throw new Error(`Odoo: ${message}`);
  }

  const result = data?.result ?? data;
  return {
    applicationId: result.applicationId,
    partnerId: result.partnerId,
    identityId: result.identityId,
  };
}
