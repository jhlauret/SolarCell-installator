import express from 'express';
import cors from 'cors';
import { config } from './config';
import { authRouter } from './routes/auth';
import { onboardingRouter } from './routes/onboarding';

const app = express();

app.use(cors({ origin: config.allowedOrigin, credentials: true }));
app.use(express.json({ limit: '20mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/onboarding', onboardingRouter);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`SolarCell BFF à l'écoute sur http://localhost:${config.port} (origine front: ${config.allowedOrigin})`);
});
