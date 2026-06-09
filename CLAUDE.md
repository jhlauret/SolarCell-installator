# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a two-part monorepo (no root workspace tooling — each part has its own `package.json`):

- `solarcell-installer-landing/` — **front** : React 18 + Vite + TypeScript SPA (landing marketing + wizard d'inscription 7 étapes + parcours de formation, fusionnés en une seule app).
- `bff/` — **BFF** Node + Express + TypeScript. Porte toute la logique Firebase + Odoo pour que le navigateur n'expose **jamais** la clé interne Odoo.

Le front ne contient **aucune** dépendance Firebase ni la clé Odoo : tout passe par le BFF.

## Commands

### Front (`cd solarcell-installer-landing`)
```bash
npm install
npm run dev        # Vite sur http://localhost:5173 (--host 0.0.0.0)
npm run build      # tsc -b && vite build
npm run preview    # sert le build (port 4173)
npm run test       # vitest --environment jsdom (watch)
npm run test -- --run                       # une passe, sans watch
npm run test -- --run src/features/auth/InstallerLoginModal.test.tsx   # un seul fichier
npm run lint       # eslint, --max-warnings 0
```

### BFF (`cd bff`)
```bash
npm install
npm run dev        # tsx watch sur http://localhost:8787 (hot reload)
npm run build      # tsc -p tsconfig.json -> dist/
npm start          # node dist/server.js
```
Le BFF n'a **pas de tests**. Validation = `npm run build` (typecheck) + `curl` (voir `bff/README.md`).

### Dév end-to-end
Lancer les deux : BFF sur `:8787` puis front sur `:5173`. Le front lit `VITE_API_BASE_URL` (ex. `http://localhost:8787/api`) ; le BFF autorise le CORS pour `ALLOWED_ORIGIN` (le front).

## Architecture

### Flux d'authentification (le cœur du projet)
Le front est volontairement « mince ». Aucune logique Firebase/Odoo côté navigateur.

```
Front (InstallerLoginModal) --POST /api/auth/login {email,password}--> BFF
   BFF --REST accounts:signInWithPassword (FIREBASE_WEB_API_KEY)--> Firebase   (valide le mot de passe server-side)
   BFF --syncInstaller(claims)--> Odoo                                          (X-SolarCell-Api-Key)
   BFF --> Front : { applicationId, partnerId, identityId, user:{email,name,picture} }
```

- **Email/mot de passe** (`POST /api/auth/login`) : chemin principal, ne nécessite **pas** de compte de service Firebase (la REST API valide elle-même).
- **Google ID** : flux OAuth 100% server-side (pas de SDK client). Popup → `GET /api/auth/google` (redirect consentement) → `GET /api/auth/google/callback` (échange du code, décodage de l'id_token, sync Odoo) → le BFF renvoie une page HTML qui `postMessage` le résultat (`type:'solarcell-sso'`) à l'opener puis se ferme. Le modal valide `event.origin` avant d'accepter.
- **`POST /api/auth/firebase/session`** : variante acceptant un `idToken` client, vérifié via Firebase Admin (nécessite `GOOGLE_APPLICATION_CREDENTIALS`). Renvoie `501` si Admin non configuré.
- **`POST /api/auth/logout`** : pas de session serveur — l'état vit côté client. Renvoie `{ok:true}`.

### Côté BFF (`bff/src/`)
- `config.ts` — lit/valide l'env. `assertOdooConfig()` / `assertFirebaseRest()` renvoient les variables manquantes ; les routes répondent `503 config_missing` explicite si vide.
- `firebaseRest.ts` — `signInWithPassword` (Identity Toolkit REST).
- `firebase.ts` — Firebase Admin (lazy init), `verifyIdToken`, `firebaseAdminAvailable`.
- `googleOAuth.ts` — `exchangeCodeForClaims`, `popupResultHtml`, `googleConfigMissing`.
- `odoo.ts` — `syncInstaller(claims)` : appelle le controller Odoo `POST /solar/firebase/sync`. **Déduplique par email** d'abord (via `odooXmlRpc`) pour éviter les doublons quand un même utilisateur change de provider (Google puis email).
- `odooXmlRpc.ts` — accès générique aux modèles Odoo via JSON-RPC `/web/dataset/call_kw` avec **session admin persistante** (cookie mis en cache). Helpers `odooSearch/odooRead/odooCreate/odooWrite/odooUpsert`. Utilisé par la dédup et par tout le flux onboarding.
- `routes/onboarding.ts` — lit/écrit les modèles Odoo `x_solarcell_installer*` ; toutes les routes exigent un `applicationId` (dossier créé au login).

Deux conventions Odoo coexistent : le **controller custom** `/solar/firebase/sync` (clé via `X-SolarCell-Api-Key`, body JSON direct) pour la création de compte, et l'**ORM JSON-RPC** (`odooXmlRpc.ts`, login admin) pour lire/écrire les champs d'onboarding.

### Côté front (`solarcell-installer-landing/src/`)
Structure **feature-based** : `features/{auth,onboarding,solar-landing,training-program}/` + `shared/` (UI, layout, httpClient).

- Routing (`app/App.tsx`) : `/` landing, `/formation`, `/onboarding/:stepId`. `<InstallerLoginModal />` est monté **hors** des `<Routes>` pour que l'overlay couvre n'importe quelle page.
- State : **Zustand**. `useSessionStore` (auth, persisté en localStorage `solarcell-session` via `persist`) est la source de vérité de l'utilisateur connecté ; `useAuthModalStore` (`{isOpen, open, close}`) ; `useLandingStore`, `useOnboardingStore`.
- `SiteHeader.tsx` bascule entre bouton « Se connecter » (déconnecté) et avatar+nom+« Déconnecter » (connecté) selon `useSessionStore`.
- HTTP : **deux clients coexistent** — `shared/api/httpClient.ts` (axios, `baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api'`) pour les appels BFF, et un wrapper fetch hérité (`services/http.ts`). Préférer `httpClient` pour le nouveau code.

## Conventions importantes

- **Vite, pas CRA** : variables d'env préfixées `VITE_` et lues via `import.meta.env.VITE_*`. Ne jamais utiliser `REACT_APP_` / `process.env` côté front.
- **Secrets** : `bff/.env` et `solarcell-installer-landing/.env` sont gitignorés. **Ne jamais `git add -A`** — stage les fichiers explicitement et vérifie qu'aucun `.env` n'entre dans un commit.
- Le front se développe indépendamment : tant que le BFF/Odoo n'est pas configuré, le modal s'affiche et les appels échouent proprement (messages d'erreur gérés).
- Tests front : vitest + @testing-library/react + jsdom. Entourer les mutations de store Zustand de `act()`. Setup global : `src/test/setup.ts` (cleanup après chaque test).

## Variables d'environnement BFF (`bff/.env`)

`PORT`, `ALLOWED_ORIGIN`, `FIREBASE_WEB_API_KEY`, `FIREBASE_PROJECT_ID`, `ODOO_URL`, `ODOO_DB`, `ODOO_API_KEY` (= paramètre système Odoo `solarcell.internal_api_key`), `ODOO_ADMIN_USER`/`ODOO_ADMIN_PASSWORD` (pour `odooXmlRpc`), et optionnels : `GOOGLE_APPLICATION_CREDENTIALS` (Firebase Admin), `GOOGLE_OAUTH_CLIENT_ID`/`_SECRET`/`_REDIRECT_URI`.

## Dépendance externe

Le module Odoo `solarcell_installer_onboarding` (endpoint `/solar/firebase/sync`, modèles `solarcell.installer.identity`/`.application`, `x_solarcell_installer*`) doit être installé sur le VPS Odoo. Sans lui, l'étape finale de synchro échoue.
