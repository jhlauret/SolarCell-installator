import axios from 'axios';
import { config } from './config';
import { odooSearch, odooRead, odooWrite } from './odooXmlRpc';

/**
 * Appelle l'endpoint Odoo `POST /solar/firebase/sync`.
 * Le controller lit directement le body JSON (pas de wrapper JSON-RPC).
 * La clé secrète est transmise via l'en-tête `X-SolarCell-Api-Key`.
 *
 * Avant d'appeler le controller, on recherche une identité existante par email
 * pour éviter les doublons si le même utilisateur se connecte avec un provider
 * différent (ex. Google puis email/password).
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
  // Recherche d'abord par firebase_uid (cas nominal), puis par email (changement de provider).
  const existing = await findExistingByEmail(claims.email, claims.uid);
  if (existing) return existing;

  // Aucun compte existant → création via le controller Odoo.
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
    throw new Error(`Odoo: ${result.error?.message ?? 'Erreur inconnue'}`);
  }
  return {
    applicationId: result.applicationId,
    partnerId: result.partnerId,
    identityId: result.identityId,
  };
}

/**
 * Cherche une identité existante par email.
 * Si trouvée avec un firebase_uid différent (changement de provider), on met à jour
 * le uid pour que les prochains logins retrouvent directement le bon compte.
 * Retourne null si aucun compte n'existe pour cet email.
 */
async function findExistingByEmail(email: string, newUid: string): Promise<InstallerSession | null> {
  try {
    const ids = await odooSearch('solarcell.installer.identity', [['email', '=', email]]);
    if (!ids.length) return null;

    const identityId = ids[0];
    const [identity] = await odooRead('solarcell.installer.identity', [identityId], [
      'firebase_uid', 'partner_id',
    ]);

    // Mettre à jour le firebase_uid si le provider a changé.
    if (identity.firebase_uid !== newUid) {
      await odooWrite('solarcell.installer.identity', [identityId], { firebase_uid: newUid });
    }

    // Retrouver le dossier application lié à cette identité.
    const appIds = await odooSearch('solarcell.installer.application', [['identity_id', '=', identityId]]);
    if (!appIds.length) return null;

    const applicationId = appIds[0];
    const partnerId = Array.isArray(identity.partner_id)
      ? (identity.partner_id[0] as number)
      : (identity.partner_id as number);

    return { applicationId, partnerId, identityId };
  } catch {
    // Si la recherche échoue (Odoo indisponible), on laisse passer vers le controller.
    return null;
  }
}
