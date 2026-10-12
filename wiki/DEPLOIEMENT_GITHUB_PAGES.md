# Déploiement GitHub Pages & CI/CD

L'application est 100% statique et hébergeable gratuitement sur **GitHub Pages**.

---

## 🛠️ 1. Configuration Vite Base

Dans `vite.config.ts`, la propriété `base: './'` est configurée pour permettre le déploiement sur :
- Un sous-domaine racine (ex: `https://organisation.github.io/`)
- Un sous-chemin de dépôt de projet (ex: `https://utilisateur.github.io/Visite-Saint-Junien/`)
- Un environnement local de prévisualisation (`npm run preview`)

Aucun chemin d'asset absolu codé en dur (ex: `/assets/...`) n'est présent dans le code source.

---

## 🤖 2. Workflow GitHub Actions (`.github/workflows/deploy.yml`)

Le pipeline automatisé de déploiement exécute la séquence officielle :

1. **Checkout** du code source du dépôt.
2. **Setup Node.js LTS** (Node 22 / 24).
3. **Installation des dépendances** avec `npm ci`.
4. **Vérification des types TypeScript** avec `npm run typecheck` (`tsc --noEmit`).
5. **Exécution des tests automatisés** avec `npm test` (`vitest run`).
6. **Compilation du bundle de production** avec `npm run build`.
7. **Téléversement de l'artefact `dist/`** via `actions/upload-pages-artifact`.
8. **Déploiement sur GitHub Pages** via `actions/deploy-pages`.

Permissions requises dans le workflow :
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

---

## ⚙️ 3. Activation dans le Répertoire GitHub

Dans l'interface web de votre dépôt GitHub :
1. Naviguer vers **Settings > Pages**.
2. Sous **Build and deployment > Source**, sélectionner **GitHub Actions**.
3. Pousser les modifications sur la branche `main` : le déploiement se déclenchera automatiquement.
4. L'URL publique de la visite sera générée sous la forme :
   `https://<votre-compte>.github.io/<nom-du-depot>/`

---

## ✅ 4. Checklist de Recette sur le Terrain

- [ ] L'application charge correctement l'icône, le titre et les 5 étapes.
- [ ] Couper le Wi-Fi et les données mobiles : naviguer à travers les 5 étapes et vérifier l'absence d'écran blanc.
- [ ] Répondre à 5 énigmes, recharger la page : vérifier que l'ordre des options reste strictement identique et que la progression est conservée.
- [ ] Compléter les 5 étapes, renseigner les 5 mots-clés dans l'écran final : vérifier la génération du QR code.
- [ ] Ouvrir l'écran Médiateur sur un second terminal ou onglet : coller la chaîne QR et vérifier la validation sans doublon.
