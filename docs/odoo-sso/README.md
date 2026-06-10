# SSO « 1 clic » — espace Odoo + deep-link Module 3

Un seul controller Odoo (`/solar/sso/login`) gère deux usages, distingués par
la présence ou non du champ `redirect` dans le jeton signé :

1. **Espace Odoo générique** (bouton « Accéder à mon espace Odoo » dans
   `SiteHeader.tsx`, route BFF `GET /api/auth/odoo-sso?applicationId=…`)
   → jeton `{email, exp}` → redirige vers `/my` (portail) ou `/odoo` (interne).

2. **Deep-link Module 3 → Odoo Learning** (bouton « Accéder au cours » du
   Module 3, route BFF `GET /api/learning/odoo-sso?applicationId=…&course=…`)
   → jeton `{email, exp, redirect}` avec `redirect` préfixé par `/slides/`
   → redirige directement vers le cours.

## Fichier à déployer

`sso_controller.py` **remplace** le fichier actuellement déployé sur le VPS :

```
/var/lib/docker/volumes/odoo_odoo-addons/_data/solarcell_installer_onboarding/controllers/sso_controller.py
```

`controllers/__init__.py` ne change pas (déjà `from . import sso_controller`).

## Déploiement

```bash
# 1. Copier sso_controller.py dans le volume (remplace l'existant)
# 2. Mettre à jour le module
docker exec odoo-app odoo -u solarcell_installer_onboarding -d Solarcell \
  --db_host=db --db_user=odoo --db_password=<ODOO_DB_PASSWORD> --stop-after-init
docker restart odoo-app
```

## Sécurité

- HMAC-SHA256, clé partagée `solarcell.internal_api_key` (= `ODOO_API_KEY` BFF).
- Jeton court (60s).
- `redirect` est dans le payload signé (anti-tampering) ET re-validé contre
  `_ALLOWED_REDIRECT_PREFIXES = ("/slides/",)` (anti open-redirect en
  profondeur).
- L'email doit correspondre à un `solarcell.installer.identity` connu, sinon
  `error=unknown_user` (pas de création de compte portail pour un email
  arbitraire).

## Vérification (avant déploiement)

- `cd bff && npm run build` ✅
- `cd solarcell-installer-landing && npm run build` ✅
- Tests SSO « espace Odoo » (token invalide / expiré / email inconnu / valide
  → `/my`) déjà validés pour le payload `{email, exp}` — le payload
  `{email, exp, redirect}` réutilise exactement le même chemin de vérification,
  seule la redirection finale change.
