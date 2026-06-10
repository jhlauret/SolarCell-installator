# SSO « deep-link » Module 3 → Odoo Learning

Permet à un installateur connecté à la webapp d'ouvrir le cours Odoo **déjà
authentifié**, sans ressaisir d'identifiants. Le navigateur ne voit jamais la clé
interne ; tout passe par le BFF.

## Flux

```
Front (bouton « Accéder au cours » du Module 3)
  └─ window.open(`${API_BASE}/learning/odoo-sso?applicationId=…&course=zendure-4000-pro`)
       │
BFF  GET /api/learning/odoo-sso        (bff/src/routes/learning.ts + odooSso.ts)
  ├─ résout l'email vérifié via XML-RPC (x_solarcell_installer.x_email)   ← non spoofable
  ├─ signe un jeton HMAC court (60 s) : { email, redirect, exp }
  └─ 302 → ODOO_URL/solar/sso/login?token=<payload>.<signature>
       │
Odoo GET /solar/sso/login              (docs/odoo-sso/sso_controller.py — à déployer)
  ├─ vérifie la signature avec `solarcell.internal_api_key` (= ODOO_API_KEY)
  ├─ contrôle exp + préfixe redirect (/slides/…)
  ├─ retrouve/crée le res.users portail (login = email)
  ├─ ouvre la session (request.session) — cookie posé sur le domaine Odoo
  └─ 302 → /slides/module-3-installation-du-zendure-solarflow-4000-pro-1
```

## Côté webapp (déjà fait dans ce repo)

- `bff/src/odooSso.ts` — liste blanche des cours, résolution email, signature du jeton.
- `bff/src/routes/learning.ts` — route `GET /api/learning/odoo-sso`, montée dans `server.ts`.
- `solarcell-installer-landing/.../components/ModuleCard.tsx` — le bouton Module 3 ouvre le SSO BFF
  (ou le modal de login si l'utilisateur n'est pas connecté).

Aucune nouvelle variable d'env : la signature réutilise `ODOO_API_KEY`
(= paramètre système Odoo `solarcell.internal_api_key`), partagé par les deux côtés.

## Côté Odoo (à déployer sur le VPS)

1. Copier `sso_controller.py` dans le module `solarcell_installer_onboarding`
   (`controllers/`), l'importer dans `controllers/__init__.py`.
2. Vérifier que le paramètre système `solarcell.internal_api_key` existe et vaut la
   **même** valeur que `ODOO_API_KEY` du BFF.
3. Mettre à jour le module (`-u solarcell_installer_onboarding`) et redémarrer Odoo.

> Le controller cible **Odoo 18** (compatible 17). `_login_session` ouvre la session via
> `request.session` + `request.update_env` (pattern valide 17/18).
> Alternative « zéro code Odoo » : configurer le module natif `auth_oauth` avec le même
> `client_id` Google (login Google en 1 clic, mais uniquement pour les comptes Google).

## Ajouter d'autres cours

Dans `bff/src/odooSso.ts`, étendre `COURSE_PATHS` :

```ts
const COURSE_PATHS: Record<string, string> = {
  'zendure-4000-pro': '/slides/module-3-installation-du-zendure-solarflow-4000-pro-1',
  'autoconsommation': '/slides/module-1-…',
};
```

puis ajouter `externalUrl` sur le module correspondant dans `trainingProgramData.ts`.
