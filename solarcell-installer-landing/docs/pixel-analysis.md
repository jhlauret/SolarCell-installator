# Analyse pixel — écran SolarCell

Image de référence : 1536 × 1024 px.

## Grille de mise en page observée

| Zone | Mesure approximative | Implémentation |
|---|---:|---|
| Largeur contenu principal | ~1340 px | `max-w-[1342px]` |
| Marge latérale desktop | ~97 px | `mx-auto`, largeur max |
| Header | ~99 px de hauteur | `h-[99px]` |
| Hero jusqu'à la carte avantages | ~610 px | `min-h-[611px]` |
| Carte avantages | ~1341 × 151 px | `max-w-[1342px]`, `min-h-[151px]` |
| Carte impact sombre | ~1341 × 245 px | `min-h-[245px]` |
| Rayon cartes | ~15–16 px | `rounded-[15px]` |
| Bouton principal | ~232 × 53 px | `w-[232px] h-[53px]` |
| Bouton vidéo | ~178 × 53 px | `w-[178px] h-[53px]` |
| Bouton login | ~139 × 44 px | `w-[139px] h-[44px]` |

## Couleurs principales

| Usage | Couleur |
|---|---|
| Texte fort | `#0D2B33` |
| Vert principal | `#43A047` |
| Vert CTA | `#0B8A3A` / `#37A853` |
| Badge vert pâle | `#E3F2E1` |
| Panneau sombre | `#052D36` |
| Lignes séparatrices | `#E5ECE8` / `rgba(255,255,255,.10)` |

## Remarque d'intégration

Le fichier fourni est une capture complète avec photo, texte et composants. Pour éviter de recréer l'interface comme une simple image statique, seule la zone photo de l'installateur a été extraite dans `src/assets/solar-installer-hero.png`; tout le reste est reconstruit en React/Tailwind sous forme de vrais composants.
