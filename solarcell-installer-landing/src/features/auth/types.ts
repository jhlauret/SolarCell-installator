export type InstallerLoginRequest = {
  email: string;
  password: string;
};

/** Identifiants renvoyés par Odoo via le BFF après synchronisation. */
export type InstallerSession = {
  applicationId: number;
  partnerId: number;
  identityId: number;
};

/** Profil de l'utilisateur authentifié (Google ou email/mot de passe). */
export type InstallerProfile = {
  email: string;
  name?: string;
  picture?: string;
};

/** Réponse complète du BFF : session Odoo + profil. */
export type LoginResponse = InstallerSession & {
  user?: InstallerProfile;
};

/** Utilisateur connecté tel que conservé dans le store/localStorage. */
export type AuthUser = InstallerSession & InstallerProfile;
