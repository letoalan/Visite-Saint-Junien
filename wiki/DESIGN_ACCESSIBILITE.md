# Design & Accessibilité

L'ergonomie et la direction artistique ont été conçues selon les meilleures pratiques du web moderne, en s'inspirant de la richesse visuelle des jeux d'aventure narratifs (comme *Les Piliers de la Terre* de Daedalic) tout en garantissant une accessibilité exemplaire.

---

## 🎨 1. Palette & Ambiance Daedalic

L'univers évoque la pierre médiévale, le parchemin enluminé et les vitraux limousins :

| Nom Token | Code Hex | Rôle & Usage |
|---|---|---|
| `parchment` | `#F4EDE1` | Fond d'écran chaleureux rappelant le vélin ancien. |
| `parchment-light` | `#FBF7EE` | Fond des cartes de contenu et cartes de questions. |
| `ink` | `#222620` | Texte principal et titres, fort contraste (> 12:1). |
| `stone-dark` | `#373C35` | Boutons primaires et bordures structurantes. |
| `gold` | `#B5904D` | Accents enluminés, boutons de validation, anneaux de focus. |
| `red` | `#7F3933` | Indicateurs d'erreur sobre et état hors ligne. |
| `blue` | `#2F4553` | Sélections d'options et liens documentaires. |
| `success` | `#2B593F` | Succès, confirmations et étapes acquises. |

*Règle stricte de contraste : L'or n'est jamais employé pour du petit texte sur fond clair afin d'éviter toute perte de lisibilité.*

---

## 📱 2. Ergonomie Mobile & Égalité des Cartes

- **Même largeur et hauteur par question** : Les options de quiz sont disposées en colonne unique mobile avec une hauteur minimale de 56px assurant un alignement esthétique sans saut d'affichage.
- **Taille tactile minimale (48px)** : Tous les boutons, liens et cartes de réponse respectent scrupuleusement la cible tactile recommandée de 48px pour faciliter l'interaction lors de la marche en ville.
- **Typographie lisible** : Police avec empattements soignée pour les titres (`Cinzel` / serif) combinée à une typographie sans-serif moderne et nette (`Plus Jakarta Sans`) pour les énoncés d'énigmes et les réponses.

---

## ♿ 3. Accessibilité & Clavier

- **Retours multi-sensoriels** : Les succès et erreurs ne reposent jamais sur la seule couleur ; des icônes (`✓`, `✕`, `✦`, `⚠`) et des explications textuelles explicites accompagnent chaque statut.
- **Sémantique ARIA** : Groupes d'options balisés avec `role="radiogroup"` et `role="radio"`, modales accessibles (`role="dialog"`), annonces dynamiques via `aria-live="polite"`.
- **Réduction de mouvement** : Prise en charge native de `@media (prefers-reduced-motion: reduce)` désactivant les transitions pour les personnes sensibles.

---

## 🎬 4. Vidéo d'Arrière-Plan Immersive (Landing Page)

- **Ambiance Enluminée en Toile de Fond** : La vidéo de Saint-Junien (`https://youtu.be/04m7o63oVQM`) est intégrée en arrière-plan direct de la landing page avec lecture silencieuse en boucle (`autoplay=1&mute=1&loop=1`).
- **Filtres & Scrim Protecteur** : Un voile de dégradé radial parchemin (`radial-gradient`) et une teinte sépia subtile sont superposés pour donner vie au décor tout en assurant une lisibilité maximale et un contraste optimal du texte d'accueil.
- **Accessibilité & Mouvement Réduit** : La vidéo est automatiquement masquée pour les utilisateurs ayant activé `@media (prefers-reduced-motion: reduce)`, laissant place au parchemin uni.
- **Repli Hors Ligne** : Si aucune connexion réseau n'est disponible, l'application bascule gracieusement sur son arrière-plan autonome sans rupture visuelle.

---

## 📱 5. Interface Liquide pour Smartphone (Cœur Métier)

- **Dock Inférieur Ergonomique (Zone du pouce)** : Remplacement de la navigation haute par un dock flottant inférieur (`BottomNav`) permettant une manipulation aisée à une seule main pendant la marche urbaine (Accueil, Parcours, Carnet, Médiateur).
- **Dégagement Intégral de l'Option E** : Le bouton d'action est disposé sous l'option E dans le flux naturel avec une garde généreuse au-dessus du dock tactile (52px de hauteur tactile, pleine largeur), garantissant qu'aucune option ne soit jamais masquée par un élément flottant.
- **Micro-réactivité Tactile** : Cibles minimales de 52px et rétroaction élastique tactile (`:active { transform: scale(0.985); }`) avec suppression des latences de tap (`-webkit-tap-highlight-color: transparent`).
- **Lisibilité en Plein Soleil** : Contraste d'encre sombre fortifié sur parchemin et cartes cerclées de pierre pour une lisibilité parfaite sous la lumière naturelle extérieure.

