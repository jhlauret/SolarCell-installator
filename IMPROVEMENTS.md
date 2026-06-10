# 📋 Axes d'amélioration — SolarCell Installer Platform

Document listant les améliorations et features à ajouter, organisées par priorité et effort estimé.

---

## 🔴 **Priorité HAUTE** — Impact fort + Effort raisonnable

### 1. Validation robuste des formulaires
**Fichiers concernés :**
- `solarcell-installer-landing/src/features/onboarding/components/steps/*.tsx` (tous les steps)
- `solarcell-installer-landing/src/features/auth/components/InstallerLoginModal.tsx`
- `bff/src/routes/onboarding.ts`
- `bff/src/routes/auth.ts`

**Problème actuel :** 
- Frontend : `useState` brut sans validation, pas d'erreurs temps réel
- Backend : validation inline, pas de schéma centralisé

**Solution :**
- **Front** : Migrer vers `react-hook-form` + `zod`
  ```bash
  npm install react-hook-form zod
  ```
  Exemple :
  ```typescript
  // PersonalStep.tsx
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { z } from 'zod';
  
  const PersonalSchema = z.object({
    firstName: z.string().min(2, 'Min 2 caractères'),
    lastName: z.string().min(2, 'Min 2 caractères'),
    email: z.string().email('Email invalide'),
    phone: z.string().optional(),
  });
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(PersonalSchema),
    defaultValues: initialData,
  });
  ```

- **BFF** : Ajouter validation Zod avant d'écrire en Odoo
  ```typescript
  import { z } from 'zod';
  
  const PersonalStepSchema = z.object({
    applicationId: z.number().positive(),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
  });
  
  router.post('/personal', async (req, res) => {
    const validation = PersonalStepSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }
    // proceed
  });
  ```

**Bénéfices :** 
- UX : erreurs temps réel, validation client avant envoi
- Sécurité : validation stricte côté serveur
- Maintenabilité : schémas centralisés = source de vérité unique

**Effort estimé :** 2-3 jours

---

### 2. Gestion centralisée des erreurs & Logging BFF
**Fichiers concernés :**
- `bff/src/server.ts`
- Toutes les routes `bff/src/routes/*.ts`

**Problème actuel :**
- Pas de logs structurés
- Erreurs gérées inline (try/catch répétés)
- Difficile de déboguer en prod

**Solution :**
```bash
# Ajouter dépendances
cd bff
npm install pino pino-http express-async-errors
npm install --save-dev @types/express-async-errors
```

Exemple structure :
```typescript
// bff/src/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
  },
});
```

```typescript
// bff/src/middleware/errorHandler.ts
import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(
    {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    },
    'Unhandled error',
  );

  res.status(500).json({
    error: 'internal_error',
    message: 'Une erreur est survenue',
  });
}

// Dans server.ts
app.use(errorHandler);
```

**Bénéfices :**
- Debug en prod : logs structurés en JSON
- Observabilité : facilement intégrable à Datadog/New Relic
- Maintenance : erreurs trackées centralement

**Effort estimé :** 1-2 jours

**Bonus (optionnel) :** Intégrer Sentry pour crash tracking
```bash
npm install @sentry/node
```

---

### 3. Tests d'intégration BFF
**Fichiers concernés :**
- À créer : `bff/src/routes/__tests__/auth.test.ts`
- À créer : `bff/src/routes/__tests__/onboarding.test.ts`
- À créer : `bff/src/__mocks__/odooXmlRpc.ts` (mocks)

**Problème actuel :**
- Zéro tests backend
- Risque de régression sur les workflows critiques (login → sync → prefill)

**Solution :**
```bash
cd bff
npm install --save-dev vitest supertest @vitest/ui
```

Exemple :
```typescript
// bff/src/routes/__tests__/auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server';

vi.mock('../firebaseRest', () => ({
  signInWithPassword: vi.fn(),
}));

describe('POST /api/auth/login', () => {
  it('should return 401 on invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' });
    
    expect(res.status).toBe(401);
  });

  it('should sync user to Odoo on successful login', async () => {
    // test du flow complet
  });
});
```

**Bénéfices :**
- Confiance : regressions détectées tôt
- CI/CD : tests auto à chaque PR
- Documentation : tests = specs exécutables

**Effort estimé :** 2-3 jours

---

### 4. Email verification & Password reset
**Fichiers concernés :**
- À créer : `bff/src/services/emailService.ts`
- À créer : `bff/src/routes/passwordReset.ts`
- À créer : `solarcell-installer-landing/src/features/auth/components/EmailVerificationModal.tsx`
- À créer : `solarcell-installer-landing/src/features/auth/components/PasswordResetModal.tsx`

**Problème actuel :**
- Pas de vérification email après signup
- Pas de récupération de mot de passe perdu
- Incomplètement du flow d'authentification

**Solution — Backend :**
```typescript
// bff/src/services/emailService.ts
import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email: string, code: string) {
  // Implémenter avec SMTP provider (SendGrid, AWS SES, etc.)
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  // Idem
}
```

```typescript
// bff/src/routes/auth.ts — ajouter endpoints
router.post('/verify-email', async (req, res) => {
  const { code, email } = req.body;
  // Vérifier le code (stocké en cache/DB temporaire)
  // Marquer l'email comme vérifiée en Odoo
  res.json({ ok: true });
});

router.post('/request-password-reset', async (req, res) => {
  const { email } = req.body;
  // Générer token + envoyer email
  res.json({ ok: true, message: 'Email envoyé' });
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  // Vérifier token + appeler Firebase pour reset
  res.json({ ok: true });
});
```

**Solution — Frontend :**
```typescript
// solarcell-installer-landing/src/features/auth/components/EmailVerificationModal.tsx
export function EmailVerificationModal({ email, onVerified }: Props) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    setLoading(true);
    try {
      await httpClient.post('/api/auth/verify-email', { email, code });
      onVerified();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <h2>Vérifiez votre email</h2>
      <p>Code envoyé à {email}</p>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="000000"
      />
      <Button onClick={handleVerify} loading={loading}>
        Vérifier
      </Button>
    </Dialog>
  );
}
```

**Dépendances :**
```bash
cd bff
npm install nodemailer @sendgrid/mail  # ou autre provider
npm install --save-dev @types/nodemailer
```

**Bénéfices :**
- UX pro : flow d'auth complet
- Sécurité : confirmation email authentique
- Rétention : users peuvent récupérer accès perdu

**Effort estimé :** 2-3 jours

---

## 🟡 **Priorité MOYENNE** — Améliore UX/maintenabilité

### 5. File upload pour étape Documents
**Fichiers concernés :**
- `solarcell-installer-landing/src/features/onboarding/components/steps/DocumentsStep.tsx`
- À créer : `bff/src/services/storageService.ts`
- À créer : `bff/src/routes/documents.ts`

**Problème actuel :**
- Étape "Documents" incompléte, pas d'upload de fichiers
- Utilisateurs doivent envoyer docs par email

**Solution — Backend :**
```bash
cd bff
npm install multer aws-sdk  # ou local storage
```

```typescript
// bff/src/routes/documents.ts
import multer from 'multer';
import { uploadToS3 } from '../services/storageService';

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  },
});

router.post('/upload', requireAppId, upload.single('document'), async (req, res) => {
  const url = await uploadToS3(req.file, req.applicationId);
  
  await odooCreate('x_solarcell_document', {
    x_application_id: req.applicationId,
    x_file_url: url,
    x_file_name: req.file.originalname,
  });

  res.json({ url, ok: true });
});
```

**Solution — Frontend :**
```typescript
// solarcell-installer-landing/src/features/onboarding/components/steps/DocumentsStep.tsx
import { useState } from 'react';
import { httpClient } from '../../../../shared/api/httpClient';

export function DocumentsStep({ goNext }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = useSessionStore((s) => s.user);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('applicationId', user.applicationId);

      await httpClient.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFiles([...files, file]);
      setError('');
    } catch (err) {
      setError('Erreur lors de l\'upload');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={handleUpload}
        accept=".pdf,.jpg,.png"
        disabled={loading}
      />
      {files.map((f) => (
        <div key={f.name}>{f.name} ✅</div>
      ))}
      <Button onClick={goNext} disabled={files.length === 0}>
        Continuer
      </Button>
    </div>
  );
}
```

**Bénéfices :**
- UX : complète le wizard
- Automatisation : docs stockées côté serveur

**Effort estimé :** 1-2 jours

**Stockage :** S3 recommandé pour la scalabilité, local OK pour MVP

---

### 6. API Documentation (Swagger/OpenAPI)
**Fichiers concernés :**
- À créer : `bff/src/swagger.ts`
- À modifier : `bff/src/server.ts`

**Problème actuel :**
- Pas de doc pour les endpoints BFF
- Difficile pour frontend/tests de connaître les paramètres

**Solution :**
```bash
cd bff
npm install swagger-jsdoc swagger-ui-express
npm install --save-dev @types/swagger-jsdoc
```

```typescript
// bff/src/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SolarCell BFF API',
      version: '1.0.0',
    },
    servers: [
      { url: 'http://localhost:8787', description: 'Dev' },
      { url: process.env.API_URL, description: 'Prod' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
```

```typescript
// bff/src/routes/auth.ts
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email/password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => { /* ... */ });
```

**Accès :** `http://localhost:8787/api-docs`

**Bénéfices :**
- Documentation : auto-générée et à jour
- Testable : Swagger UI pour tester les endpoints

**Effort estimé :** 1 jour

---

### 7. Security hardening
**Fichiers concernés :**
- `bff/src/server.ts`
- À créer : `bff/src/middleware/security.ts`

**Problème actuel :**
- Pas de rate limiting
- Pas de CSRF protection
- Headers de sécurité manquants

**Solution :**
```bash
cd bff
npm install helmet express-rate-limit express-validator
```

```typescript
// bff/src/middleware/security.ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Rate limiting
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, // 5 tentatives
  message: 'Trop de tentatives de connexion',
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 30, // 30 requêtes par minute
});

// Headers de sécurité
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
    },
  },
});
```

```typescript
// bff/src/server.ts
import { securityHeaders, apiLimiter, loginLimiter } from './middleware/security';

app.use(securityHeaders);
app.use('/api/', apiLimiter);
app.use('/api/auth/login', loginLimiter);
```

**Bénéfices :**
- Sécurité : protection contre brute-force, XSS, clickjacking
- Stabilité : rate limiting prévient les abus

**Effort estimé :** 1 jour

---

### 8. React Error Boundary
**Fichiers concernés :**
- À créer : `solarcell-installer-landing/src/shared/ui/ErrorBoundary.tsx`
- À modifier : `solarcell-installer-landing/src/app/App.tsx`

**Problème actuel :**
- Erreur React non capturée = crash complet de la page

**Solution :**
```typescript
// solarcell-installer-landing/src/shared/ui/ErrorBoundary.tsx
import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, info);
    // Optionnel: envoyer à Sentry
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-800 font-bold">Oups, une erreur est survenue</h2>
          <p className="text-red-600 mt-2">Veuillez recharger la page.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
          >
            Recharger
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

```typescript
// App.tsx
import { ErrorBoundary } from '../shared/ui/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* ... */}
      </Routes>
      <InstallerLoginModal />
    </ErrorBoundary>
  );
}
```

**Bénéfices :**
- UX : graceful degradation au lieu de crash blanc
- Debug : erreurs capturées et loggées

**Effort estimé :** 0.5 jour

---

### 9. PWA Support
**Fichiers concernés :**
- À créer : `solarcell-installer-landing/public/manifest.json`
- À créer : `solarcell-installer-landing/src/serviceWorker.ts`
- À modifier : `solarcell-installer-landing/index.html`

**Problème actuel :**
- Pas installable sur mobile
- Pas de support offline

**Solution :**
```json
// public/manifest.json
{
  "name": "SolarCell Installer",
  "short_name": "SolarCell",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    }
  ]
}
```

```typescript
// src/serviceWorker.ts
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
```

```html
<!-- index.html -->
<link rel="manifest" href="/manifest.json" />
```

**Bénéfices :**
- Mobile : installable comme app native
- Offline : support offline basique avec service worker

**Effort estimé :** 1 jour

---

### 10. Analytics & Event tracking
**Fichiers concernés :**
- À créer : `solarcell-installer-landing/src/shared/analytics/tracker.ts`
- À modifier : tous les steps + routes principales

**Problème actuel :**
- Pas de visibilité sur l'usage (taux d'abandon, temps par étape, etc.)
- Difficile d'identifier les points d'amélioration UX

**Solution — Avec Segment (optionnel, ou custom) :**
```bash
cd solarcell-installer-landing
npm install @segment/analytics-next
```

```typescript
// src/shared/analytics/tracker.ts
import { AnalyticsBrowser } from '@segment/analytics-next';

const analytics = AnalyticsBrowser.load({
  writeKey: import.meta.env.VITE_SEGMENT_WRITE_KEY,
});

export function trackEvent(event: string, properties?: Record<string, any>) {
  analytics.track(event, properties);
}

export function trackPageView(path: string) {
  analytics.page({ path });
}
```

```typescript
// Exemple : PersonalStep.tsx
import { trackEvent } from '../../../../shared/analytics/tracker';

async function handleSave() {
  trackEvent('onboarding_step_completed', {
    step: 'personal',
    timestamp: new Date(),
  });
  const ok = await submit({...});
  if (ok) goNext();
}
```

**Dashboard :** Accès via Segment ou custom analytics

**Bénéfices :**
- Analytics : compréhension du user journey
- Conversion : identifiez les drop-off
- Optimisation : data-driven improvements

**Effort estimé :** 1-2 jours

---

## 🟢 **Priorité BASSE** — Long terme

### 11. Admin Dashboard
**Scope :** 
- Module `solarcell-installer-landing/src/features/admin/`
- Routes BFF pour récupérer les inscriptions : `GET /api/admin/applications`

**Features :**
- Liste des inscriptions (filtrage, search)
- Statut de chaque étape
- Exporter CSV
- Vue détail par utilisateur

**Effort estimé :** 3-5 jours

---

### 12. Internationalization (i18n)
**Dépendances :**
```bash
cd solarcell-installer-landing
npm install i18next react-i18next
```

**Fichiers :**
- À créer : `src/i18n/locales/fr.json`
- À créer : `src/i18n/locales/en.json`
- À créer : `src/i18n/config.ts`

**Exemple :**
```json
// src/i18n/locales/fr.json
{
  "onboarding": {
    "personal": {
      "title": "Informations personnelles",
      "firstName": "Prénom"
    }
  }
}
```

```typescript
// Usage dans les composants
import { useTranslation } from 'react-i18next';

export function PersonalStep() {
  const { t } = useTranslation();
  return <h1>{t('onboarding.personal.title')}</h1>;
}
```

**Effort estimé :** 2-3 jours

---

### 13. Caching & Performance
**Optimisations :**
- Cache HTTP headers au BFF (`Cache-Control`, `ETag`)
- Redis pour cache des appels Odoo (optionnel)
- React Query / SWR pour gestion du cache côté client
- Code splitting du bundle Vite

**Effort estimé :** 2-3 jours

---

### 14. Accessibility Audit (a11y)
**À faire :**
- ARIA labels sur tous les inputs
- Keyboard navigation (Tab, Enter)
- Tests axe-core
- Contrast ratios vérifiés

**Dépendances :**
```bash
npm install --save-dev @axe-core/react
```

**Effort estimé :** 2 jours

---

## ⚡ **Quick Wins** — À faire rapidement (1-2 heures chacun)

- [ ] Ajouter `.github/workflows/test.yml` (run tests + lint on PR)
- [ ] Créer `DEPLOYMENT.md` (env vars, secrets, CI/CD)
- [ ] Créer component `<ErrorAlert />` réutilisable pour erreurs API
- [ ] Ajouter `.env.example` pour documenter les variables requises
- [ ] Tester composants critiques : `PersonalStep.test.tsx`, `InstallerLoginModal.test.tsx`
- [ ] Ajouter `robots.txt` + `sitemap.xml` (SEO landing)
- [ ] Ajouter métadonnées OpenGraph au `index.html`
- [ ] Vérifier que les secrets (`.env`) ne sont jamais committés

---

## 📊 Matrice de priorité

| Feature | Priorité | Effort | Impact | À faire |
|---------|----------|--------|--------|----------|
| Validation formulaires | 🔴 HAUTE | 2-3j | Sécurité + UX | ASAP |
| Logging BFF | 🔴 HAUTE | 1-2j | Observabilité | Prochaine sprint |
| Tests BFF | 🔴 HAUTE | 2-3j | Confiance | Prochaine sprint |
| Email verification | 🔴 HAUTE | 2-3j | UX complète | Après tests |
| File upload | 🟡 MOYEN | 1-2j | Feature complète | Semaine 2 |
| Swagger docs | 🟡 MOYEN | 1j | Maintenance | Semaine 2 |
| Security hardening | 🟡 MOYEN | 1j | Sécurité | Semaine 2 |
| Error Boundary | 🟡 MOYEN | 0.5j | UX | Semaine 2 |
| PWA | 🟡 MOYEN | 1j | Mobile | Semaine 3 |
| Analytics | 🟡 MOYEN | 1-2j | Insights | Semaine 3 |
| Admin Dashboard | 🟢 BASSE | 3-5j | Maintenance | Mois 2 |
| i18n | 🟢 BASSE | 2-3j | Multi-marché | Futur |
| Caching | 🟢 BASSE | 2-3j | Performance | Futur |
| a11y | 🟢 BASSE | 2j | Inclusivité | Futur |

---

## 📝 Notes pour la mise en place

**Avant de démarrer chaque feature :**
1. Créer une branche `feature/nom-feature`
2. Mettre à jour ce fichier avec la date de démarrage
3. Créer des commits petits et atomiques
4. Faire des tests (ou couvrir des tests existants)
5. PR review avant merge

**Outils recommandés :**
- Postman ou Insomnia pour tester les endpoints BFF
- React DevTools pour debug frontend
- Chrome DevTools Network pour perf

---

**Dernière mise à jour :** 2026-06-10
**Auteur :** Claude Code
