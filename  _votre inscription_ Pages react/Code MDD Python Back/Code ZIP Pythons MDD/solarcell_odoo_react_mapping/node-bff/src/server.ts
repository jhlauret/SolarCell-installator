import 'dotenv/config';
import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';
import { createOnboardingRouter } from './routes/onboardingRoutes.js';
import { OdooHttpClient } from './services/odooHttpClient.js';

const port = Number(process.env.PORT || 8080);
const odooBaseUrl = process.env.ODOO_BASE_URL;
if (!odooBaseUrl) {
  throw new Error('Missing ODOO_BASE_URL');
}

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json({ limit: '2mb' }));

const odoo = new OdooHttpClient(odooBaseUrl, process.env.ODOO_API_KEY);
app.use('/api/onboarding', createOnboardingRouter(odoo));

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: err instanceof Error ? err.message : 'Internal server error' });
};
app.use(errorHandler);

app.listen(port, () => {
  console.log(`SolarCell onboarding BFF listening on http://localhost:${port}`);
});
