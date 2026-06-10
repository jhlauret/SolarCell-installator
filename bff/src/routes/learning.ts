import { Router } from 'express';
import { config, assertOdooConfig } from '../config';
import { coursePath, resolveInstallerEmail, signSsoToken } from '../odooSso';

export const learningRouter = Router();

/**
 * GET /api/learning/odoo-sso?applicationId=…&course=…
 *
 * SSO « deep-link » vers un cours Odoo Learning. Navigation pleine page :
 * le BFF résout l'email (côté serveur, non spoofable), signe un jeton court,
 * puis redirige (302) vers le controller Odoo `/solar/sso/login` qui ouvre une
 * session portail et atterrit sur le cours. Le cookie de session est posé par
 * Odoo sur son propre domaine (navigation top-level → first-party).
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
    const email = await resolveInstallerEmail(applicationId);
    const token = signSsoToken(email, path);
    const base = config.odoo.url.replace(/\/$/, '');
    return res.redirect(302, `${base}/solar/sso/login?token=${encodeURIComponent(token)}`);
  } catch (err: unknown) {
    return res.status(502).send(`SSO Odoo impossible : ${(err as Error).message}`);
  }
});
