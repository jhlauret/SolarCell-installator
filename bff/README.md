# SolarCell BFF

BFF (Backend-for-Frontend) Node.js sécurisé entre le widget « Connexion installateur » et Odoo.
Il porte la logique Firebase + Odoo pour que le navigateur n'expose **jamais** la clé interne Odoo.

## Rôle
- `POST /api/auth/login` — login email/mot de passe : valide via l'API REST Firebase (server-side),
  puis synchronise Odoo (`/solar/firebase/sync`) et renvoie `{ applicationId, partnerId, identityId }`.
- `POST /api/auth/firebase/session` — variante : reçoit un `idToken` client, le vérifie via Firebase
  Admin (nécessite `GOOGLE_APPLICATION_CREDENTIALS`), puis synchronise Odoo.
- `GET /api/auth/google` + `/google/callback` — OAuth Google server-side (scaffold, à activer avec des
  identifiants OAuth Google).

## Configuration
```bash
cp .env.example .env   # puis remplir ODOO_URL, ODOO_DB, ODOO_API_KEY
```
`ODOO_API_KEY` doit valoir **exactement** le paramètre système Odoo `solarcell.internal_api_key`.

## Lancer
```bash
npm install
npm run dev      # http://localhost:8787 (rechargement à chaud)
# ou
npm run build && npm start
```

## Tester
```bash
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"installateur@solarcell.demo","password":"motdepasse"}'
```
Sans `.env` Odoo rempli → réponse `503 config_missing` explicite.

## Architecture
```
Front (modal) --POST /api/auth/login--> BFF --REST signInWithPassword--> Firebase
                                          BFF --POST /solar/firebase/sync (X-SolarCell-Api-Key)--> Odoo
                                          <--{applicationId, partnerId, identityId}--
```
