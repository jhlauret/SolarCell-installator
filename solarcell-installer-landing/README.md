# SolarCell Installer — Landing + Onboarding — React 18 + Vite + TypeScript

Application SolarCell unifiée : la **page d'accueil marketing** et le **parcours
d'inscription en 7 étapes** des installateurs partenaires, réunis dans un seul
projet Vite.

> **Application fusionnée.** Cette base réunit deux livrables qui étaient des
> applications distinctes : la landing (`solarcell-installer-landing`) et le
> wizard d'inscription (` _votre inscription_ Pages react/Code version N fichiers`).
> Elles partagent désormais le même chrome (header + logo), le même design system
> Tailwind, le même outillage et la même navigation SPA (voir « Décisions de
> fusion » en bas de fichier).

## Parcours

| Route | Écran | Entrée |
|---|---|---|
| `/` | Landing marketing (hero, avantages, impact) | — |
| `/onboarding/:stepId` | Wizard d'inscription (7 étapes) | CTA « Rejoindre le programme », « Créer mon compte », « S'inscrire » |

Les CTA de la landing routent vers le wizard (navigation SPA), et la dernière
étape du wizard (« Terminer l'inscription ») ramène à la landing.

## Stack retenue

| Exigence | Choix |
|---|---|
| Framework | React 18.3.1 |
| Language | TypeScript strict |
| Styling | Tailwind CSS 3 |
| State management | Zustand (`useLandingStore`, `useOnboardingStore`) |
| Routing | React Router v6 |
| Icônes | SVG maison (`shared/ui/Icon`) + `lucide-react` (wizard) |
| HTTP | Fetch (`services/http.ts`) + axios (`shared/api/httpClient.ts`) |
| Build tool | Vite |
| Tests | Vitest + Testing Library |

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir : `http://localhost:5173`

## Tests

```bash
npm run test
```

## Build production

```bash
npm run build
npm run preview
```

## Arborescence

```text
solarcell-installer-landing/
├── docs/
│   └── pixel-analysis.md
├── src/
│   ├── app/
│   │   └── App.tsx
│   ├── assets/
│   │   └── solar-installer-hero.png
│   ├── data/
│   │   └── landingContent.ts
│   ├── features/
│   │   ├── solar-landing/
│   │   │   ├── SolarLandingPage.test.tsx
│   │   │   ├── SolarLandingPage.tsx
│   │   │   └── components/
│   │   │       ├── BenefitStrip.tsx
│   │   │       ├── HeroSection.tsx
│   │   │       └── ImpactPanel.tsx
│   │   └── onboarding/                  # wizard d'inscription 7 étapes
│   │       ├── components/
│   │       │   ├── OnboardingMain.tsx
│   │       │   ├── OnboardingPage.test.tsx
│   │       │   ├── RightInfoColumn.tsx
│   │       │   ├── Sidebar.tsx
│   │       │   └── steps/               # 7 écrans d'étape
│   │       ├── data/
│   │       ├── hooks/
│   │       ├── pages/
│   │       ├── store/
│   │       ├── ui/                      # kit UI propre au wizard (lucide)
│   │       └── types.ts
│   ├── hooks/
│   │   └── useLandingNavigation.ts
│   ├── services/
│   │   └── http.ts
│   ├── shared/
│   │   ├── api/
│   │   │   └── httpClient.ts            # client axios (intégration BFF)
│   │   ├── layout/
│   │   │   └── SiteHeader.tsx           # chrome partagé (landing + wizard)
│   │   └── ui/
│   │       ├── BrandLogo.tsx
│   │       ├── Button.tsx
│   │       └── Icon.tsx
│   ├── store/
│   │   └── useLandingStore.ts
│   ├── test/
│   │   └── setup.ts
│   ├── types/
│   │   └── landing.ts
│   ├── main.tsx
│   ├── styles.css
│   └── vite-env.d.ts
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Découpage recommandé en commits

| Commit | Taille estimée | Contenu |
|---:|---:|---|
| 1 | XS | Initialisation Vite, TypeScript, Tailwind, configuration de base |
| 2 | XS | Tokens visuels, styles globaux, assets image |
| 3 | S | Types, data statique, store Zustand, hook navigation |
| 4 | S | Composants partagés : `Button`, `BrandLogo`, `Icon` |
| 5 | M | Header et navigation desktop |
| 6 | M | Hero section, image, titre, CTA, réassurance |
| 7 | M | Bandeau avantages en quatre cartes |
| 8 | M | Panneau impact sombre et CTA final |
| 9 | S | Tests composants et configuration Vitest |
| 10 | XS | Documentation pixel-analysis et README |

Nombre optimal : **10 commits**, suffisamment petits pour revue de code, mais sans fragmenter artificiellement chaque ligne CSS.

## Limite de fidélité pixel

La capture fournie contient une photographie intégrée. Le rendu reconstruit est fidèle à la composition, aux dimensions, aux espacements, à la typographie et aux couleurs observées. Pour une fidélité strictement pixel-perfect en production, il faudrait idéalement disposer du visuel source non aplati de l'installateur et des panneaux solaires, sans les textes ni les cartes déjà imprimés dans l'image.

## Décisions de fusion

La fusion réunit **deux applications réellement distinctes** dans un seul projet
Vite : la landing marketing et le wizard d'inscription en 7 étapes (` _votre
inscription_ Pages react/Code version N fichiers`).

### Architecture retenue

- **Application hôte unique** = la landing. Le wizard est intégré comme *feature*
  (`src/features/onboarding`) avec son propre kit UI (`features/onboarding/ui`,
  basé sur `lucide-react`), conservé intact → **zéro régression visuelle** sur le
  wizard.
- **Chrome partagé** : un seul `SiteHeader` (`src/shared/layout`) et un seul logo
  (`BrandLogo`) servent les deux écrans. Les anciens `AppHeader` / `SolarCellLogo`
  / `Header` (dupliqués entre les deux apps) ont été supprimés → suppression de la
  duplication de la barre de navigation.
- **Navigation SPA bidirectionnelle** : les CTA de la landing (« Rejoindre le
  programme », « Créer mon compte », « S'inscrire ») routent vers
  `/onboarding/personal` via `useNavigate` ; la fin du wizard ramène à `/`.
- **Design system unifié au niveau Tailwind** : les jeux de tokens des deux apps
  cohabitent dans un seul `tailwind.config.ts`. Les couleurs `solar` se combinent
  sans collision (clés sémantiques de la landing + échelle numérique du wizard) ;
  ajout des groupes `ink` / `warning`, des ombres `shell` / `card` / `softGreen`
  et des `backgroundImage` `page` / `greenSoft` / `orangeSoft`.
- **CSS fusionné** : la couche `@layer components` du wizard (`.solar-container`,
  `.input-base`, `.field-label`, …) est intégrée à `styles.css`. La grille du
  wizard est rendue **responsive** (`grid-cols-1` → 3 colonnes en `lg`) ; le
  `min-width: 1280px` global de l'app d'origine a été **écarté** pour préserver la
  responsivité de la landing.

### Backend laissé intact

Le dossier ` _votre inscription_ Pages react/` contient aussi un **backend Odoo /
Python + un node-bff + des mappers React** (intégration MDD). Ce ne sont pas des
« pages » : ils n'ont pas été touchés. Le client `shared/api/httpClient.ts` (axios)
a été porté pour préparer le branchement à ce BFF. Le dossier source d'origine est
conservé ; son frontend `Code version N fichiers` est désormais redondant avec la
feature `onboarding` et peut être retiré si souhaité.

### Corrections TypeScript / ESLint / styles

- Ajout des dépendances `lucide-react` et `axios` (utilisées par le wizard).
- Réécriture des chemins d'import du kit UI du wizard (`shared/ui` → `../ui`) après
  son déplacement en feature-scoped.
- ESLint : retrait d'un import d'icône inutilisé (`ClipboardCheck`) dans
  `rightPanels.ts`.
- Test du wizard : ajout des imports explicites `vitest` (`describe/it/expect`),
  la config hôte n'activant pas les globals.

### Toujours valable depuis la consolidation précédente

- Versions `vite` / `typescript` / `@vitejs/plugin-react` figées (Vite 5, TS 5.6),
  tooling en `devDependencies`, `defineConfig` depuis `vitest/config`,
  `moduleResolution: Bundler`, `vite-env.d.ts`, ESLint 9 flat config,
  `cleanup()` après chaque test.

État de validation : `npm run lint`, `npm run build` et `npm test` (5/5) passent.
