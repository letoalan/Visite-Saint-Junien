# Wiki du Projet : Visite Patrimoniale de Saint-Junien

Bienvenue sur le wiki officiel du projet **Visite de Saint-Junien : Bâtir la foi, gouverner la ville**.

Cette application web statique TypeScript / React est conçue pour être déployée sur **GitHub Pages**, utilisable sur smartphone par les visiteurs en autonomie totale (100% hors ligne), et contrôlée à l'arrivée par un médiateur culturel via un QR code de validation de session.

---

## 📚 Sommaire du Wiki

1. [Architecture Technique](file:///wiki/ARCHITECTURE.md) : Découpage modulaire, stack technique, cycle de vie et stockage.
2. [Règles Métier & Quiz](file:///wiki/DOMAIN_RULES.md) : Permutations aléatoires persistantes, validation par ID et progression.
3. [Normalisation & Défi Final](file:///wiki/NORMALISATION_ET_FINAL.md) : Décomposition NFD, traitement des diacritiques et contrôle des mots-clés.
4. [Spécification du QR Code](file:///wiki/QR_SPECIFICATION.md) : Format SJ1, charge utile compacte, anti-corruption FNV-1a et encodage base64url.
5. [Fonctionnement Hors Ligne & PWA](file:///wiki/OFFLINE_PWA.md) : Service Worker, préchargement des ressources et stratégie de cache.
6. [Guide du Médiateur](file:///wiki/MEDIATEUR_GUIDE.md) : Utilisation du validateur, gestion des doublons et journal local.
7. [Design & Accessibilité](file:///wiki/DESIGN_ACCESSIBILITE.md) : Esthétique inspirée de Daedalic, contrastes, cibles tactiles 48px et réduction de mouvement.
8. [Déploiement GitHub Pages](file:///wiki/DEPLOIEMENT_GITHUB_PAGES.md) : Configuration Vite base, GitHub Actions et vérifications de production.
9. [Carte & Géolocalisation](file:///wiki/CARTE_GEOLOCALISATION.md) : Plan vectoriel des 5 points, coordonnées GPS et navigation piétonne.

---

## 🎯 Objectifs Clés du Dispositif

- **Cinq spots patrimoniaux** : Saint-Amand, Pont et Notre-Dame-du-Pont, Collégiale et ostensions, Maison des Consuls, Remparts.
- **Vingt-cinq énigmes** : Cinq questions par spot, cinq options par question, issues de publications scientifiques et patrimoniales vérifiées.
- **Zéro serveur applicatif** : Fonctionnement autonome dans le navigateur, persistance IndexedDB sans base de données distante.
- **Robustesse terrain** : Aucun risque de blocage en zone blanche (pas de réseau 4G/5G requis pendant la marche).
- **Contrôle d'intégrité sans prétention cryptographique** : Détection des erreurs de transmission et historique local anti-rejeu.
