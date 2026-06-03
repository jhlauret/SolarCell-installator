# SolarCell Installer — Landing + Onboarding — React 18 + Vite + TypeScript

Application SolarCell unifiée : la **page d'accueil marketing** et le **parcours
d'inscription en 7 étapes** des installateurs partenaires, réunis dans un seul
projet Vite.

> **Application fusionnée.** Cette base réunit trois livrables qui étaient des
> applications distinctes : la landing (`solarcell-installer-landing`), le
> wizard d'inscription (` _votre inscription_ Pages react/Code version N fichiers`)
> et le parcours de formation (`formation/Exposition des 3 modules de formation
> Web page/Code N fichiers`). Elles partagent désormais le même chrome (header +
> logo), le même design system Tailwind, le même outillage et la même navigation
> SPA (voir « Décisions de fusion » en bas de fichier).

## Parcours

| Route | Écran | Entrée |
|---|---|---|
| `/` | Landing marketing (hero, avantages, impact) | — |
| `/formation` | Parcours de formation (3 modules, suivi de progression) | Entrée de menu « Le programme » |
| `/onboarding/:stepId` | Wizard d'inscription (7 étapes) | CTA « Rejoindre le programme », « Créer mon compte », « S'inscrire » |

Les CTA de la landing routent vers le wizard (navigation SPA), et la dernière
étape du wizard (« Terminer l'inscription ») ramène à la landing. L'entrée de
menu « Le programme » du header partagé route vers `/formation`.

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
│   │   ├── onboarding/                  # wizard d'inscription 7 étapes
│   │   │   ├── components/
│   │   │   │   ├── OnboardingMain.tsx
│   │   │   │   ├── OnboardingPage.test.tsx
│   │   │   │   ├── RightInfoColumn.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── steps/               # 7 écrans d'étape
│   │   │   ├── data/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── store/
│   │   │   ├── ui/                      # kit UI propre au wizard (lucide)
│   │   │   └── types.ts
│   │   └── training-program/            # parcours de formation 3 modules
│   │       ├── TrainingProgramPage.tsx
│   │       ├── TrainingProgramPage.test.tsx
│   │       ├── api.ts                   # saveTrainingProgress -> shared httpClient
│   │       ├── components/              # Hero, Modules, ModuleCard, Outcomes, Overview
│   │       ├── data/
│   │       ├── hooks/                   # useTrainingProgressStore (zustand)
│   │       ├── types/
│   │       └── ui/                      # kit UI propre à la formation (lucide)
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

La fusion réunit **trois applications réellement distinctes** dans un seul projet
Vite : la landing marketing, le wizard d'inscription en 7 étapes (` _votre
inscription_ Pages react/Code version N fichiers`) et le parcours de formation à
3 modules (`formation/Exposition des 3 modules de formation Web page/Code N
fichiers`).

### Architecture retenue

- **Application hôte unique** = la landing. Le wizard et la formation sont
  intégrés comme *features* (`src/features/onboarding`, `src/features/training-program`),
  chacune avec son propre kit UI feature-scoped (`.../ui`, basé sur `lucide-react`),
  conservé intact → **zéro régression visuelle** sur les deux.
- **Chrome partagé** : un seul `SiteHeader` (`src/shared/layout`) et un seul logo
  (`BrandLogo`) servent les trois écrans. Les anciens `AppHeader` / `SolarCellLogo`
  / `Header` / le `SiteHeader` propre à la formation (dupliqués entre les apps) ont
  été supprimés → suppression de la duplication de la barre de navigation.
- **Navigation SPA bidirectionnelle** : les CTA de la landing (« Rejoindre le
  programme », « Créer mon compte », « S'inscrire ») routent vers
  `/onboarding/personal` via `useNavigate` ; la fin du wizard ramène à `/`.
  L'entrée de menu « Le programme » du header route vers `/formation` (le `SiteHeader`
  distingue désormais les ancres de section `#...` des liens de route `/...`).
- **Design system unifié au niveau Tailwind** : les jeux de tokens des trois apps
  cohabitent dans un seul `tailwind.config.ts`. Les couleurs `solar` se combinent
  sans collision (clés sémantiques de la landing + échelle numérique du wizard) ;
  la formation ajoute (additif, sans régression) `solar-300`, `ink-950` et les
  ombres `solar-card` / `solar-soft`. L'échelle `solar` existante est conservée
  (les verts de la formation en sont quasi identiques) pour ne pas altérer le wizard.
- **CSS fusionné, avec scoping anti-collision** : la couche `@layer components` du
  wizard (`.solar-container`, `.input-base`, …) est intégrée à `styles.css`. Les
  classes bespoke de la formation (`.page-frame`, `.glass-card`, `.small-chip`,
  `.section-title`, `.green-icon-tile`) sont **scopées sous `.training-page`** car
  `.glass-card` (landing) et `.section-title` (wizard) existent déjà globalement
  avec des définitions différentes ; le scoping garantit une formation
  pixel-fidèle avec **zéro régression** sur la landing et le wizard. La grille du
  wizard reste **responsive** (`grid-cols-1` → 3 colonnes en `lg`).

### Backend laissé intact

Les dossiers source ` _votre inscription_ Pages react/` et `formation/` contiennent
aussi des **backends Odoo / Python + node-bff + mappers React** (intégration MDD,
`solarcell_learning_bridge`, redirections SSO vers Odoo eLearning). Ce ne sont pas
des « pages » : ils n'ont pas été touchés. Le client `shared/api/httpClient.ts`
(axios) est réutilisé par `features/training-program/api.ts`
(`saveTrainingProgress`) pour préparer le branchement à ces BFF. Les frontends
source d'origine (`Code version N fichiers`, ZIP `solarcell-training-page-react18`)
sont désormais redondants avec les features `onboarding` / `training-program` et
peuvent être retirés si souhaité.

### Corrections TypeScript / ESLint / styles

- Ajout des dépendances `lucide-react` et `axios` (utilisées par le wizard et la
  formation).
- Réécriture des chemins d'import du kit UI du wizard (`shared/ui` → `../ui`) après
  son déplacement en feature-scoped.
- ESLint : retrait d'imports d'icônes inutilisés (`ClipboardCheck` dans
  `rightPanels.ts` ; `CheckCircle2` / `ScrollText` / `Wrench` dans
  `trainingProgramData.ts`).
- Tests wizard & formation : imports explicites `vitest` (`describe/it/expect`),
  la config hôte n'activant pas les globals ; les assertions sur les titres de
  modules utilisent `getAllByText` (chaque titre apparaît dans le panneau de
  résumé et sur sa carte).
- Formation : `bg-white/88` (palier d'opacité non généré) remplacé par
  `bg-white/[0.88]` ; `api.ts` rebranché sur le `shared/api/httpClient` de l'hôte
  pour éviter un second client axios.

### Toujours valable depuis la consolidation précédente

- Versions `vite` / `typescript` / `@vitejs/plugin-react` figées (Vite 5, TS 5.6),
  tooling en `devDependencies`, `defineConfig` depuis `vitest/config`,
  `moduleResolution: Bundler`, `vite-env.d.ts`, ESLint 9 flat config,
  `cleanup()` après chaque test.

État de validation : `npm run lint`, `npm run build` et `npm test` (8/8 : 2
landing + 3 wizard + 3 formation) passent.
