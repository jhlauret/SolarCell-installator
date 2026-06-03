import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { OdooHttpClient } from '../services/odooHttpClient.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const StepSchema = z.enum(['personal', 'professional', 'skills', 'documents', 'training', 'contract', 'wallet']);
const StartPayloadSchema = z.record(z.unknown());

export function createOnboardingRouter(odoo: OdooHttpClient): Router {
  const router = Router();

  router.post('/start', async (req, res, next) => {
    try {
      const payload = StartPayloadSchema.parse(req.body);
      const result = await odoo.jsonRpc('/solar/onboarding/start', { payload });
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post('/:applicationId/step/:step', async (req, res, next) => {
    try {
      const applicationId = Number.parseInt(req.params.applicationId, 10);
      const step = StepSchema.parse(req.params.step);
      if (!Number.isFinite(applicationId)) {
        return res.status(400).json({ ok: false, error: 'Invalid applicationId' });
      }
      const result = await odoo.jsonRpc(`/solar/onboarding/${applicationId}/step/${step}`, {
        payload: req.body,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:applicationId/status', async (req, res, next) => {
    try {
      const applicationId = Number.parseInt(req.params.applicationId, 10);
      if (!Number.isFinite(applicationId)) {
        return res.status(400).json({ ok: false, error: 'Invalid applicationId' });
      }
      const result = await odoo.jsonRpc(`/solar/onboarding/${applicationId}/status`, {});
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post('/:applicationId/documents/:requirementCode', upload.single('file'), async (req, res, next) => {
    try {
      const applicationId = Number.parseInt(req.params.applicationId, 10);
      if (!Number.isFinite(applicationId)) {
        return res.status(400).json({ ok: false, error: 'Invalid applicationId' });
      }
      if (!req.file) {
        return res.status(400).json({ ok: false, error: 'Missing file field' });
      }
      const result = await odoo.uploadDocument(applicationId, req.file, req.params.requirementCode);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
