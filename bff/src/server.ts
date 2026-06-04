import express from 'express';
import cors from 'cors';
import { config } from './config';
import { authRouter } from './routes/auth';

const app = express();

app.use(cors({ origin: config.allowedOrigin, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`SolarCell BFF à l'écoute sur http://localhost:${config.port} (origine front: ${config.allowedOrigin})`);
});
