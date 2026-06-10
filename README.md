# SolarCell Installer Platform

**Une webapp d'onboarding en 7 étapes pour les installateurs solaires** — modulaire, sécurisée, prête pour la production.

## 🏗️ Architecture

Monorepo **deux-parties** (BFF + SPA React) — zéro dépendance Firebase côté client, sécurité maximale.

```
Solarcell-installator/
├── 📱 solarcell-installer-landing/      (Frontend - React 18 + Vite + TS)
│   ├── src/
│   │   ├── features/                     ⭐ Modulaire : features indépendantes
│   │   │   ├── auth/                     Authentification (email, Google SSO)
│   │   │   ├── onboarding/               Wizard 7 étapes pour les installateurs
│   │   │   ├── solar-landing/            Page d'accueil marketing
│   │   │   └── training-program/         Programme de formation intégré
│   │   ├── shared/                       Composants & utilitaires réutilisables
│   │   │   ├── api/                      Client HTTP (axios) → BFF
│   │   │   └── ui/                       Boutons, modals, formulaires
│   │   ├── store/                        État global (Zustand)
│   │   └── hooks/                        React hooks personnalisés
│   └── package.json                      npm dev | npm build | npm test
│
└── 🔧 bff/                               (Backend For Frontend - Node + Express + TS)
    ├── src/
    │   ├── config.ts                     Validation env (Firebase, Odoo, Google OAuth)
    │   ├── firebaseRest.ts               Identity Toolkit REST API
    │   ├── firebase.ts                   Firebase Admin (lazily initialized)
    │   ├── googleOAuth.ts                OAuth 2.0 server-side (pas de SDK client)
    │   ├── odoo.ts                       Sync installer vers Odoo (dédup par email)
    │   ├── odooXmlRpc.ts                 ORM générique Odoo + session admin persistante
    │   ├── routes/                       Endpoints modulaires
    │   │   └── onboarding.ts             CRUD des modèles x_solarcell_installer*
    │   └── server.ts                     Express app entry point
    └── package.json                      npm dev | npm start
```

## 🎯 Principes de modularité

✅ **Séparation des concerns**
- Frontend : features indépendantes (auth, onboarding, landing, training)
- Backend : modules d'intégration isolés (Firebase, Google, Odoo)

✅ **Features-based architecture** (front)
- Chaque feature a ses own composants, hooks, store, tests
- `shared/` pour la réutilisabilité (UI, HTTP client)
- Facile à ajouter une nouvelle feature sans toucher aux existantes

✅ **BFF centralisé** (backend)
- Client navigateur **jamais** exposé à Firebase ou clés Odoo
- Routes modulables : auth + onboarding séparées
- Toute la logique métier centralisée + validée côté serveur

✅ **Zero secrets in frontend**
- Aucune dépendance Firebase / Odoo côté client
- Config/clés API stockées `.env` backend uniquement

## 🚀 Stack

| Partie | Stack | Outils |
|--------|-------|--------|
| **Front** | React 18, Vite, TypeScript | vitest, @testing-library/react, Zustand, axios |
| **BFF** | Node, Express, TypeScript | tsx, Firebase Admin SDK, JSON-RPC Odoo |
| **Auth** | Email/Password + Google SSO | Firebase, Google OAuth 2.0 |
| **Base de données** | Odoo (sync en temps réel) | XML-RPC, JSON-RPC |

## 📖 Pour démarrer

```bash
# Frontend
cd solarcell-installer-landing
npm install && npm run dev      # http://localhost:5173

# Backend (dans un autre terminal)
cd bff
npm install && npm run dev      # http://localhost:8787
```

Voir [CLAUDE.md](./CLAUDE.md) pour les commandes complètes & architecture détaillée.

## 📋 Conventions importantes

- **Vite, pas CRA** : variables d'env préfixées `VITE_` côté front
- **Secrets** : `.env` gitignorés. Ne jamais `git add -A` — stage les fichiers explicitement
- **Tests front** : vitest + @testing-library/react + jsdom
- **BFF** : validation via `npm run build` (typecheck) + `curl` (integration)

## 🔗 Flux d'authentification

```
Front (InstallerLoginModal) 
  ↓ POST /api/auth/login {email,password}
BFF → Firebase (valide mot de passe server-side)
  → Odoo (sync installer avec claims)
  ← Front : { applicationId, partnerId, identityId, user:{email,name,picture} }
```

**Supports:**
- Email/Password (REST API Firebase)
- Google OAuth (100% server-side, pas de SDK client)
- Firebase Admin optionnel (pour `POST /api/auth/firebase/session`)

## 📦 Dépendances externes

- Module Odoo `solarcell_installer_onboarding` (required)
  - Endpoint `/solar/firebase/sync`
  - Modèles `solarcell.installer.identity`, `.application`, `x_solarcell_installer*`
- Firebase project (authentification)
- Google OAuth credentials (optional, pour SSO)
