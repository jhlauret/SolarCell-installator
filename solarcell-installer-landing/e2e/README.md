# Tests E2E Playwright - Solarcell Webapp

Suite complète de tests e2e pour la webapp Solarcell utilisant Playwright.

## Structure

```
e2e/
├── 01-navigation.spec.ts         # Tests de navigation et pages
├── 02-authentication.spec.ts     # Tests d'authentification et modal login
├── 03-onboarding-form.spec.ts    # Tests des formulaires du onboarding
├── 04-progress-sidebar.spec.ts   # Tests barre de progression et sidebar
├── 05-auth-state.spec.ts         # Tests état de connexion
├── 06-data-persistence.spec.ts   # Tests persistance des données
├── 07-validation-errors.spec.ts  # Tests validation et messages d'erreur
├── 08-edge-cases.spec.ts         # Tests responsive et cas limites
├── fixtures.ts                   # Fixtures et helpers personnalisés
└── README.md                      # Ce fichier
```

## Configuration

Configuration Playwright: `playwright.config.ts`
- **Base URL**: http://localhost:5173
- **Browsers**: Chromium, Mobile Chrome (Pixel 5)
- **Screenshots**: Sur erreurs uniquement
- **Traces**: On first retry

## Prérequis

### 1. Lancer les services localement

**Terminal 1 - BFF:**
```bash
cd bff
npm install
npm run dev  # Sur http://localhost:8787
```

**Terminal 2 - Front:**
```bash
cd solarcell-installer-landing
npm install
npm run dev  # Sur http://localhost:5173
```

## Lancer les tests

### Mode standard
```bash
npm run e2e
```

### Mode UI interactif
```bash
npm run e2e:ui
```

### Mode debug (avec breakpoints)
```bash
npm run e2e:debug
```

### Voir le rapport HTML
```bash
npm run e2e:report
```

### Lancer un fichier de test spécifique
```bash
npx playwright test e2e/01-navigation.spec.ts
```

### Lancer un test spécifique
```bash
npx playwright test -g "landing page charge"
```

## Scénarios couverts

### 1. Navigation et pages (01-navigation.spec.ts)
- ✅ Landing page charge avec tous les éléments
- ✅ Page /formation charge correctement
- ✅ /onboarding/stepInconnu redirige vers /onboarding/personal
- ✅ Navigation entre les 7 étapes du onboarding
- ✅ Boutons "Précédent/Suivant" naviguent correctement

### 2. Authentification (02-authentication.spec.ts)
- ✅ Ouvrir le modal "Se connecter"
- ✅ Vue login - validation des identifiants incorrects
- ✅ Switch vers vue "Créer un compte"
- ✅ Validation "confirmer mot de passe"
- ✅ Switch vers "Mot de passe oublié"
- ✅ ESC ferme le modal
- ✅ Bouton "Connexion Google" visible
- ✅ Après login: avatar + nom d'utilisateur s'affichent

### 3. Remplissage de formulaire (03-onboarding-form.spec.ts)
- ✅ Remplir tous les champs du formulaire personnel
- ✅ Persistance des données après rechargement
- ✅ Cliquer "Suivant" passe à l'étape suivante
- ✅ Bouton "Précédent" revient à l'étape précédente
- ✅ Affichage des champs conditionnels

### 4. Barre de progression (04-progress-sidebar.spec.ts)
- ✅ Barre de progression s'affiche
- ✅ Sidebar affiche les 7 étapes
- ✅ Cliquer sur une étape navigue correctement
- ✅ Étape actuelle est mise en avant
- ✅ Progression visuelle change à chaque étape

### 5. État de connexion (05-auth-state.spec.ts)
- ✅ Avant connexion: bouton "Se connecter" visible
- ✅ Après connexion: avatar + menu visible
- ✅ Menu utilisateur contient "Déconnecter"
- ✅ Cliquer "Déconnecter" retourne à l'état déconnecté
- ✅ Accès à /onboarding/* sans être connecté

### 6. Sauvegarde des données (06-data-persistence.spec.ts)
- ✅ Remplir une étape et revenir en arrière conserve les données
- ✅ Données persistentes après rechargement de la page
- ✅ Navigation vers une autre page et retour conserve les données
- ✅ Données partagées entre les étapes du onboarding
- ✅ Effacement des données quand on se déconnecte

### 7. Validation et erreurs (07-validation-errors.spec.ts)
- ✅ Soumission avec champs obligatoires vides
- ✅ Validation du format email invalide
- ✅ Validation du format téléphone
- ✅ Message d'erreur lors de l'erreur réseau
- ✅ Validation de la date de naissance
- ✅ Affichage des champs avec erreurs
- ✅ Validation côté client avant envoi

### 8. Cas limites (08-edge-cases.spec.ts)
- ✅ Landing page responsive - mobile
- ✅ Onboarding responsive - mobile
- ✅ Desktop responsive - 1920x1080
- ✅ Modal fermeture avec ESC
- ✅ Modal fermeture avec clic en dehors
- ✅ Navigation rapide entre les étapes
- ✅ Changement de fenêtre/tab - sync auth
- ✅ Performance - temps de chargement
- ✅ Back button du navigateur
- ✅ Rafraîchissement de la page preserve l'état

## Notes importantes

### Données de test
Les tests utilisent des données fictives qui ne devraient pas causer de problèmes. Certains tests simulent des sessions authentifiées via localStorage.

### API Mocking
Certains tests interceptent les requêtes API pour tester les cas d'erreur réseau. Si vous aviez besoin de vrais appels API, modifiez `playwright.config.ts`.

### Sélecteurs robustes
Les tests utilisent des sélecteurs flexibles pour éviter les dépendances trop fortes sur l'implémentation :
- Attributs `data-testid` quand disponibles
- `getByRole` pour les éléments accessibles
- Texte via regex pour plus de flexibilité

### Timeouts
Les timeouts sont configurés généralement à 5 secondes. Ajustez si nécessaire selon votre réseau.

## Troubleshooting

### Les tests ne trouvent pas les éléments
1. Vérifier que le serveur Vite tourne sur `http://localhost:5173`
2. Vérifier que le BFF tourne sur `http://localhost:8787`
3. Utiliser `npx playwright test --debug` pour inspecter visuellement
4. Ajouter des `await page.pause()` dans les tests pour déboguer

### Tests flaky
- Augmenter les timeouts dans `playwright.config.ts`
- Ajouter des `page.waitForLoadState('networkidle')` entre les actions
- Vérifier la performance du serveur local

### Popup Google SSO
Les tests détectent la popup Google SSO mais ne complètent pas réellement la connexion (c'est intentionnel). Pour tester l'intégration Google réelle, vous devrez configurer les credentials.

## Intégration CI/CD

Pour CI/CD, modifiez `playwright.config.ts`:
```typescript
forbidOnly: !!process.env.CI,
retries: process.env.CI ? 2 : 0,
workers: process.env.CI ? 1 : undefined,
```

Puis dans votre pipeline:
```bash
npm run build
npm run e2e
```

## Ressources

- [Playwright Documentation](https://playwright.dev)
- [Playwright API Reference](https://playwright.dev/docs/api/class-page)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about)
