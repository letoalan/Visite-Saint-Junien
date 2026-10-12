# Architecture Technique

L'application est conçue selon un paradigme **modulaire, immuable et sans dépendance serveur**.

---

## 🏗️ Structure des Dossiers

```
src/
├── domain/       # Types stricts, logique métier, permutations, normalisation
├── content/      # Chargeur et validation Zod du pack JSON officiel
├── storage/      # Couche IndexedDB (idb), gestion de session et journal médiateur
├── qr/           # Schémas de charge utile, checksum FNV-1a, encodeur et décodeur
├── screens/      # Écrans de vue (Accueil, Étapes, Quiz, Carnet, Final, QR, Validateur)
├── components/   # Composants d'interface (Cartes, Boutons, Badges, Modale, Quiz)
└── styles/       # Design tokens, typographie, grille de quiz et layout
```

---

## ⚙️ Stack Technologique Retenue

- **Vite 6** : Bundler haute performance avec support ESM natif.
- **TypeScript 5 (Mode Strict)** : Typage exhaustif de bout en bout.
- **React 18** : Gestion réactive de l'interface et du cycle de vie des écrans.
- **Zod 3** : Validation rigoureuse à l'exécution du contenu JSON et des payloads QR.
- **idb 8** : Wrapper Promise léger pour IndexedDB garantissant une persistance locale sans faille.
- **qrcode & @zxing** : Génération et analyse du QR code universellement pris en charge.
- **vite-plugin-pwa** : Configuration du Service Worker Workbox pour un fonctionnement hors ligne complet.
- **Vitest 3** : Suite de tests automatisés rapides pour la logique de domaine et les schémas.

---

## 🧭 Routage par Hash

Pour garantir un fonctionnement sans heurt sur **GitHub Pages** (qui ne dispose pas de réécriture serveur vers `index.html`), le routage est entièrement orchestré via le fragment de hash URL :

- `#home` : Écran d'accueil et consignes de parcours.
- `#stages` : Carte de sélection des cinq étapes séquentielles.
- `#quiz/:stageId` : Résolution des questions du spot actif.
- `#carnet` : Visualisation des mots-clés découverts et des sources documentaires.
- `#final` : Saisie des cinq mots-clés normalisés.
- `#qr` : Affichage et téléchargement de l'attestation QR finale.
- `#validateur` : Interface de contrôle dédiée au médiateur.

Aucun sous-chemin profond ne déclenche d'erreur HTTP 404 lors du rechargement de la page par le visiteur.

---

## 📐 Règle de Modularité

Chaque fichier du projet respecte scrupuleusement la contrainte stricte de **ne pas dépasser 200 lignes de code**, favorisant une maintenance aisée, une lisibilité exemplaire et des responsabilités uniques.
