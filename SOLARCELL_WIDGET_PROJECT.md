# SolarCell GoogleID-Log.pass-Odoo Widget Project

## Objectif Principal
**Créer un widget modal de connexion qui s'affiche lorsque l'utilisateur clique sur le bouton "Se connecter"** sur la landing page SolarCell.

### Status
- **En cours** — widget front + BFF Node.js implémentés ; restent les secrets Odoo et le scaffold Google OAuth à activer (voir checklist plus bas).

---

## Vue d'ensemble du Widget

Le widget "Connexion installateur" doit offrir deux moyens d'authentification :
1. **Authentification Google ID** (bouton "Continuer avec Google ID")
2. **Authentification directe Odoo** (email + mot de passe)

### Caractéristiques du Widget
- Modal overlay avec fermeture (X)
- Titre : "Connexion installateur"
- Sous-titre : "Accédez à votre espace formation, onboarding et synchronisation Odoo."
- Intégration sécurisée via BFF Node.js
- Les identifiants sont transmis en BFF sécurisé
- La clé interne Odoo ne doit jamais être exposée côté navigateur

---

## Stack Technique

### Frontend
- **React 18** - Widget réutilisable, mountable sur toutes les pages web SolarCell
- **Firebase/Google Auth** - Authentification côté client
- Modal accessible en overlay

### Backend
- **BFF Node.js sécurisé** - Intermédiaire entre le frontend et Odoo
- **Odoo Community 18** - Module Odoo `solarcell_installer_onboarding`
- **Firebase** - Vérification des tokens d'authentification
- **X-SolarCell-Api-Key** - Clé de sécurité (BFF → Odoo)

### Flux d'Authentification
```
User clicks "Se connecter"
        ↓
Modal Widget appears (React 18)
        ↓
User chooses: Google ID OR Email/Password
        ↓
Frontend gets Firebase token
        ↓
Frontend sends token to BFF: POST /api/auth/firebase/session
        ↓
BFF verifies token with Firebase
        ↓
BFF calls Odoo: POST /solar/firebase/sync
        ↓
Odoo creates/finds:
  - Contact
  - Identifiant (ID installateur)
  - Dossier installateur
        ↓
BFF returns to Frontend:
  - applicationId
  - partnerId
  - identityId
```

---

## Étapes d'Implémentation

| # | Action | Responsable |
|---|--------|------------|
| 1 | Installer le module Odoo `solarcell_installer_onboarding` | Backend |
| 2 | Définir `solarcell.internal_api_key` dans Odoo | DevOps/Backend |
| 3 | Déployer un BFF Node.js sécurisé | Backend/DevOps |
| 4 | Configurer Firebase Auth : Google + email/password | Backend/Frontend |
| 5 | Modifier le widget React pour récupérer un Firebase token | Frontend |
| 6 | Envoyer ce token à `/api/auth/firebase/session` (BFF) | Frontend |
| 7 | Le BFF vérifie le token Firebase | Backend |
| 8 | Le BFF appelle `/solar/firebase/sync` dans Odoo | Backend |
| 9 | Odoo crée ou retrouve le contact, l'ID et le dossier installateur | Backend |
| 10 | Le front récupère `applicationId`, `partnerId`, `identityId` | Frontend |

---

## Détails du Widget

### Design
- **Titre** : "Connexion installateur" (en vert SolarCell)
- **Bouton Google** : "Continuer avec Google ID" (avec logo Google)
- **Séparateur** : "ou"
- **Formulaire de connexion directe** :
  - Email : `installateur@solarcell.demo` (exemple)
  - Mot de passe : masqué (•••••••••)
  - Bouton : "Se connecter" (vert SolarCell)
- **Lien** : "Connexion directe Odoo"
- **Footer** : "Les identifiants sont transmis au BFF sécurisé. La clé interne Odoo ne doit jamais être exposée côté navigateur."

### Points de Sécurité
- ✅ Les identifiants sont transmis au BFF sécurisé
- ✅ La clé interne Odoo n'est jamais exposée côté navigateur
- ✅ Vérification Firebase du côté du BFF
- ✅ Transmission sécurisée entre BFF et Odoo

---

## Configuration Firebase

### SDK Firebase - Installation et Initialisation

```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtNncAMPRaja95VUpbox0P5cRcq9vo0ro",
  authDomain: "solarcell-installator.firebaseapp.com",
  projectId: "solarcell-installator",
  storageBucket: "solarcell-installator.firebasestorage.app",
  messagingSenderId: "1021607678788",
  appId: "1:1021607678788:web:b56c6db624bc83ca56bd11",
  measurementId: "G-VT0S7WLTN5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth, analytics };
```

### Configuration pour le Widget React

```javascript
// Dans ton fichier d'initialisation (ex: firebase.js ou config.js)
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

// Authentification Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const idToken = await user.getIdToken();
    return idToken;
  } catch (error) {
    console.error("Erreur Google Auth:", error);
    throw error;
  }
};

// Authentification Email/Password
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const idToken = await user.getIdToken();
    return idToken;
  } catch (error) {
    console.error("Erreur Email Auth:", error);
    throw error;
  }
};
```

### Variables d'Environnement (.env)

> ⚠️ **Architecture retenue** : le front (Vite + React) **n'embarque pas Firebase**.
> Aucune clé Firebase/Odoo n'est exposée au navigateur. Le front ne connaît que
> l'URL du BFF. Toute la config Firebase + Odoo vit côté **BFF**.
> Le projet étant en **Vite** (et non Create-React-App), le préfixe est `VITE_`
> (et non `REACT_APP_`).

**Front — `solarcell-installer-landing/.env`**
```bash
VITE_API_BASE_URL=http://localhost:8787/api
```

**BFF — `bff/.env`** (secrets, jamais committés)
```bash
PORT=8787
ALLOWED_ORIGIN=http://localhost:5173

# Firebase web (sert au login email/mdp via l'API REST, côté serveur)
FIREBASE_WEB_API_KEY=AIzaSyBtNncAMPRaja95VUpbox0P5cRcq9vo0ro
FIREBASE_PROJECT_ID=solarcell-installator
# Compte de service Admin (requis seulement pour /auth/firebase/session)
# GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json

# Odoo (VPS) — SECRETS
ODOO_URL=https://ton-odoo.exemple.com
ODOO_DB=ta_base_odoo
ODOO_API_KEY=<même valeur que le paramètre Odoo solarcell.internal_api_key>

# Google OAuth server-side (optionnel, pour le bouton Google ID)
# GOOGLE_OAUTH_CLIENT_ID=
# GOOGLE_OAUTH_CLIENT_SECRET=
# GOOGLE_OAUTH_REDIRECT_URI=http://localhost:8787/api/auth/google/callback
```

### Installation NPM

```bash
# Front : aucune nouvelle dépendance (pas de firebase côté navigateur)
# BFF :
cd bff && npm install   # express, cors, axios, firebase-admin, dotenv
```

---

## Checklist « fourni vs manquant »

| Élément | État |
|---|---|
| Front : widget modal `InstallerLoginModal` câblé sur « Se connecter » | ✅ fait (`src/features/auth/`) |
| BFF Node.js (login email/mdp → Firebase REST → Odoo) | ✅ fait (`bff/`) |
| Projet Firebase + config web | ✅ fourni (dans ce doc) |
| Odoo déployé sur VPS | ✅ (à confirmer : module + endpoint live) |
| `ODOO_API_KEY` (= `solarcell.internal_api_key`) | ✅ fourni (placé dans `bff/.env`) |
| `ODOO_URL` + `ODOO_DB` | ⛔ à renseigner dans `bff/.env` |
| Module Odoo `solarcell_installer_onboarding` + endpoint `/solar/firebase/sync` | ⛔ à installer/vérifier sur le VPS |
| Compte de service Firebase **Admin** (JSON) | ⛔ requis seulement pour `/auth/firebase/session` |
| Identifiants Google OAuth (bouton Google ID server-side) | ⛔ optionnel — scaffold prêt dans le BFF |

---

## Ressources Externes

### Google Drive
[Google Drive - SolarCell Widget Documentation](https://drive.google.com/drive/u/0/folders/1Ki04fq5Zs4ygqSOGP-uYfLEf3W4xgMGu)

Contient :
- Code ZIP du widget React
- Documentation techniques
- Captures d'écran
- Module Odoo

### GitHub Issue
[GitHub - SolarCell-installator Issue #4](https://github.com/jhlauret/SolarCell-installator/issues/4#issuecomment-461240111)

Détails des questions et réponses techniques sur l'intégration

---

## Pages de Référence

### Landing Page SolarCell - Vue sans widget
- Titre : "Installez. Contribuez. Gagnez des SolarCells."
- Navigation : Accueil, Le programme, Avantages, Comment ça marche?, FAQ, Contact
- Call-to-action : "Rejoindre le programme"
- Bouton login : "Se connecter" (haut droite)

### Landing Page SolarCell - Vue avec widget affiché
- La landing page reste visible en arrière-plan avec overlay grisé
- Le widget "Connexion installateur" est centré sur l'écran
- Fermable via le X en haut à droite du widget

---

## Notes Importantes

- Le widget doit être **réutilisable** et **mountable** sur toutes les pages web SolarCell
- L'authentification est **bimodale** : Google OR Email/Password
- La sécurité est **critique** : BFF Node.js obligatoire
- Le module Odoo doit **créer/synchroniser** les contacts automatiquement
- Le frontend doit récupérer les IDs pour les étapes suivantes (formation, onboarding, sync)

---

## Questions Récurrentes

**Q: Puis-je faire un widget HTML simple ou faut-il React18?**
A: C'est possible. J'ai analysé le ZIP : il contient un module Odoo Community 18, pas un front React. Le point clé est que l'endpoint Odoo `/solar/firebase/sync` est conçu pour être appelé par un BFF Node.js sécurisé, après vérification Firebase. Donc le widget React ne doit pas exposer la X-SolarCell-Api-Key côté navigateur.

**Q: Est-ce que c'est possible de faire ça et peut-tu me faire juste le code HTML React JS?**
A: Oui, l'essentiel est que le code React récupère un token Firebase et l'envoie au BFF. Le BFF ne doit jamais exposer la clé API Odoo côté client.

---

**Dernière mise à jour** : 2026-06-04
