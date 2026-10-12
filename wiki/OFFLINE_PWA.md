# Fonctionnement Hors Ligne & PWA

La visite se déroule en milieu urbain et historique, où des coupures de réseau 4G ou zones d'ombre peuvent survenir. L'application intègre une architecture **hors ligne complète et robuste**.

---

## 🚀 1. Stratégie de Cache Service Worker

Configuré avec `vite-plugin-pwa` et Workbox :

- **Préchargement au premier accès** :
  - Shell applicatif complet : HTML, JS compilé, styles CSS.
  - Manifeste PWA et icônes vectorielles SVG.
  - Pack officiel des 25 questions et sources.
  - Moteur de génération QR et polices de caractères locales.
- **Budget de poids maîtrisé** :
  - Taille totale de l'ensemble du bundle pré-caché : **~305 Ko** (compressé).
  - Chargement quasi instantané même sur connexion mobile 3G.

---

## 💾 2. Stockage Persistant IndexedDB (`idb`)

L'application ne repose pas sur le simple `localStorage` (sujet à éviction par le système ou limité en taille). Elle utilise **IndexedDB** :

1. **Magasin `sessions`** :
   - Clé active : `current_active_session`.
   - Snapshot immuable de l'état : étape active, question en cours, tentatives accumulées, disposition ordonnée des réponses, mots-clés découverts.
   - Sauvegarde immédiate après chaque clic de validation.
2. **Magasin `qr_journal`** :
   - Utilisé par le médiateur pour archiver les sessions contrôlées.

---

## 🚫 3. Politique de Mise à Jour Sans Interruption

- **Pas de rechargement sauvage** : En cas de nouvelle version déployée sur GitHub Pages, le Service Worker ne force jamais le rechargement de la page tant qu'une session de visite est active.
- Un prompt discret peut informer l'utilisateur à l'accueil, mais la session en cours est protégée de toute rupture.

---

## 🟢 4. Indicateur Réactif de Connexion

Un badge visuel et accessible (`OfflineBadge`) situé dans l'en-tête informe en temps réel le visiteur :
- **En ligne** (vert) : Réseau détecté (accès direct possible aux liens bibliographiques externes).
- **Hors ligne** (rouge sobre) : Mode autonome actif (toute la visite reste 100% opérationnelle).
