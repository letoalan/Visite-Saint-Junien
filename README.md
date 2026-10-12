# Visite Patrimoniale de Saint-Junien : Bâtir la foi, gouverner la ville

Application web statique TypeScript / React conçue pour **GitHub Pages**, utilisable sur mobile 100% hors ligne en parcours autonome dans la ville de Saint-Junien (Haute-Vienne), avec validation finale par QR code pour le médiateur culturel.

---

## 🏛️ Caractéristiques Principales

- **5 spots patrimoniaux** : Saint-Amand, Pont et Notre-Dame-du-Pont, Collégiale et ostensions, Maison des Consuls, Remparts.
- **25 questions historiques** : 5 options par question, fondées sur les sources scientifiques locales.
- **Permutations persistantes** : Les 5 positions gagnantes (0..4) sont tirées sans répétition par étape et conservées immuablement dans IndexedDB.
- **Normalisation Unicode NFD** : Saisie tolérante des mots-clés du carnet (accents, casse et espaces de bordure).
- **Format QR SJ1 compact** : Préfixe d'identification, encodage base64url, checksum anti-corruption FNV-1a.
- **Interface Médiateur avec anti-rejeu** : Journal local en IndexedDB pour interdire le recyclage d'un même QR code.
- **PWA hors ligne** : Précache Workbox (~305 Ko), aucun serveur requis.
- **Règle d'or** : 0 fichier de plus de 200 lignes.

---

## 📖 Documentation Wiki Complète

Le dossier [`wiki/`](file:///wiki/HOME.md) contient la documentation exhaustive du projet :

- 🏠 [Accueil du Wiki](file:///wiki/HOME.md)
- 🏗️ [Architecture Technique](file:///wiki/ARCHITECTURE.md)
- 🎲 [Règles Métier & Permutations](file:///wiki/DOMAIN_RULES.md)
- 🔤 [Normalisation & Défi Final](file:///wiki/NORMALISATION_ET_FINAL.md)
- 📲 [Spécification du QR Code (SJ1)](file:///wiki/QR_SPECIFICATION.md)
- 💾 [Fonctionnement Hors Ligne & PWA](file:///wiki/OFFLINE_PWA.md)
- 🏛️ [Guide Pratique du Médiateur](file:///wiki/MEDIATEUR_GUIDE.md)
- 🎨 [Design & Accessibilité (Inspiration Daedalic)](file:///wiki/DESIGN_ACCESSIBILITE.md)
- 🚀 [Déploiement GitHub Pages & CI/CD](file:///wiki/DEPLOIEMENT_GITHUB_PAGES.md)

---

## 💻 Commandes Utiles

```bash
# Installation des dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Lancer la suite de tests Vitest
npm test

# Contrôle strict des types TypeScript
npm run typecheck

# Compiler le bundle de production PWA
npm run build
```
