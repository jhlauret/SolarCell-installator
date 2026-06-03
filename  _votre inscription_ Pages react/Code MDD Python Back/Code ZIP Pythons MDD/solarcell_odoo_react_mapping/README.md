# SolarCell – Mapping ReactJS -> Odoo Community 18

Ce dossier fournit une base de code pour connecter le tunnel ReactJS d'inscription SolarCell en 7 étapes avec des modèles de données Odoo Community 18.

## Contenu

```text
odoo/addons/solarcell_installer_onboarding/
  models/                 # MDD Odoo Python
  services/front_mapper.py# mapping JSON front -> vals Odoo
  controllers/            # API HTTP/JSON-RPC consommable par Node ou React
  security/               # droits d'accès internes
  data/                   # référentiels compétences, documents, formations

node-bff/
  src/server.ts           # serveur Express optionnel entre React et Odoo
  src/routes/             # routes REST propres côté front
  src/services/           # client HTTP Odoo

react-integration/
  src/solarcellOnboarding # types TS, mappers UI, client API fetch

examples/
  full-onboarding-payload.json
```

## Architecture recommandée

```text
React 18 / Vite / TypeScript
        |
        | REST propre /api/onboarding
        v
Node.js BFF Express, optionnel mais recommandé
        |
        | Odoo JSON-RPC + multipart documents
        v
Odoo Community 18
  - res.partner personne
  - res.partner société
  - solar.installer.application
  - solar.installer.skill.line
  - solar.installer.document + ir.attachment
  - solar.training.progress
  - solar.installer.contract
  - solar.wallet
```

Le BFF Node.js n'est pas obligatoire. Vous pouvez aussi appeler directement les routes Odoo depuis React, mais le BFF permet de masquer la clé API, normaliser les erreurs, gérer CORS et centraliser les transformations.

## Installation Odoo

1. Copier le module dans votre dossier d'addons Odoo :

```bash
cp -R odoo/addons/solarcell_installer_onboarding /opt/odoo/custom-addons/
```

2. Ajouter le chemin dans `odoo.conf` si nécessaire :

```ini
addons_path = /opt/odoo/odoo/addons,/opt/odoo/custom-addons
```

3. Redémarrer Odoo puis installer le module :

```bash
./odoo-bin -d votre_base -u solarcell_installer_onboarding
```

4. Configurer une clé API Odoo côté paramètres système :

```text
ir.config_parameter
key   = solarcell.api_key
value = une-cle-longue-et-secrete
```

## Lancement du BFF Node.js

```bash
cd node-bff
cp .env.example .env
npm install
npm run dev
```

`.env` :

```ini
PORT=8080
CORS_ORIGIN=http://localhost:5173
ODOO_BASE_URL=https://votre-odoo.example.com
ODOO_API_KEY=une-cle-longue-et-secrete
```

## Intégration React

Copier le contenu de :

```text
react-integration/src/solarcellOnboarding
```

dans votre application React, puis définir :

```ini
VITE_SOLARCELL_API_BASE_URL=http://localhost:8080/api/onboarding
```

Exemple :

```ts
import { startOnboarding, saveOnboardingStep } from './solarcellOnboarding/apiClient';

const response = await startOnboarding({ personal: formValues });
const applicationId = response.application!.id;
await saveOnboardingStep(applicationId, 'professional', professionalFormValues);
```

## Codes de documents acceptés

| Écran | requirementCode | Modèle Odoo |
|---|---|---|
| Pièce d'identité | `identity_document` | `solar.installer.document` + `ir.attachment` |
| Justificatif de domicile | `address_proof` | `solar.installer.document` + `ir.attachment` |
| Extrait KBIS | `kbis_extract` | `solar.installer.document` + `ir.attachment` |
| TVA intracommunautaire | `eu_vat_certificate` | `solar.installer.document` + `ir.attachment` |
| Assurance pro | `professional_insurance` | `solar.installer.document` + `ir.attachment` |

## Limites volontairement laissées à consolider

- Pas de vues XML back-office complètes dans cette première base : le but est de fournir les modèles et le mapping API.
- Pas de signature électronique qualifiée intégrée : la structure prévoit `signature_provider`, `provider_envelope_id` et les preuves d'acceptation.
- Pas de stockage de seed phrase wallet : seul le statut de confirmation est conservé.
- Les routes publiques doivent être protégées en production par API gateway, throttling, logs et rotation de clés.
