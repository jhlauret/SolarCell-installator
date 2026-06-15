import { Router } from 'express';
import { assertOdooConfig } from '../config';
import { odooSearch, odooRead } from '../odooXmlRpc';
import { coursePath, odooSsoUrl } from '../sso';

export const learningRouter = Router();

/**
 * GET /api/learning/odoo-sso?applicationId=…&course=…
 *
 * SSO « deep-link » vers un cours Odoo Learning. Navigation pleine page :
 * le BFF résout l'email (côté serveur, non spoofable), signe un jeton court
 * (avec le chemin du cours), puis redirige (302) vers le controller Odoo
 * `/solar/sso/login` qui ouvre une session portail et atterrit sur le cours.
 */
learningRouter.get('/odoo-sso', async (req, res) => {
  const applicationId = Number(req.query.applicationId);
  const course = String(req.query.course ?? '');
  if (!applicationId) return res.status(400).send('applicationId requis');

  const path = coursePath(course);
  if (!path) return res.status(404).send('Cours inconnu');

  const missing = assertOdooConfig();
  if (missing.length) {
    return res.status(503).send(`Configuration Odoo manquante : ${missing.join(', ')}`);
  }

  try {
    const installerIds = await odooSearch('x_solarcell_installer', [['x_application_id', '=', applicationId]]);
    if (!installerIds.length) return res.status(404).send('Dossier installateur introuvable');
    const [inst] = await odooRead('x_solarcell_installer', [installerIds[0]], ['x_email']);
    const email = String(inst?.x_email ?? '').trim();
    if (!email) return res.status(404).send('Email installateur introuvable');

    return res.redirect(302, odooSsoUrl(email, path));
  } catch (err: unknown) {
    return res.status(502).send(`SSO Odoo impossible : ${(err as Error).message}`);
  }
});
