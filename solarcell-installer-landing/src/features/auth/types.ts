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
