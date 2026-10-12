# SAINT_JUNIEN_IMPLEMENTATION.md

## But
Application statique TypeScript pour GitHub Pages : cinq spots, cinq questions chacun, cinq réponses par question, cinq mots-clés et QR final de session. Aucun serveur applicatif, aucune base distante, aucune API payante. Une seconde interface de lecture du QR pour le médiateur. Les 25 questions sont dans le JSON joint, pas à générer par IA lors de la visite.

## Stack proposée
Vite + TypeScript strict + React ; CSS natif à variables ; Zod pour les schémas ; idb pour IndexedDB ; qrcode pour l’encodage ; @zxing/browser pour une lecture avec repli sur import d’image ; vite-plugin-pwa pour cache hors ligne ; Vitest et Playwright pour tests. Fixer les versions effectivement compatibles au démarrage et commiter le lockfile. Aucun secret dans VITE_*.

## Architecture
src/domain : types, transitions, normalisation, génération des permutations, validation finale.
src/content : pack JSON et validation du contenu.
src/storage : IndexedDB, export/import, migrations.
src/screens : accueil, étapes, quiz, carnet, final, QR et validateur.
src/components : cartes, boutons, retours accessibles, progression.
src/styles : tokens, typographie, composants.
src/qr : schéma strict, encode/decode, consommation locale.
public/assets : images, polices, iconographie sous licence vérifiée.
tests : domaine, intégration et parcours.
Routing par hash ; aucun chemin profond nécessitant une redirection serveur. Vite base = /NOM_DU_DEPOT/ pour une Pages de projet. Assets référencés avec la base Vite, aucun chemin absolu /assets codé en dur.

## État
Session UUID, version de contenu, ordre des réponses par question, validations, nombre de tentatives, mots débloqués et état final. Chaque réponse est validée par ID stable, jamais par position. Sauvegarder immédiatement après chaque transition. Versionner le stockage et conserver le snapshot de contenu de la session pour éviter une modification des réponses pendant une visite. Le chargement d’un ancien pack et sa migration doivent être explicites.

## Quiz
Étapes dans l’ordre. Tirer une permutation des positions 0..4 pour les bonnes réponses de chaque étape ; assigner la position n à la question n. Mélanger les quatre distracteurs puis les répartir dans les positions restantes. La position de la bonne réponse change donc aux cinq questions de l’étape. Sauvegarder ces dispositions avant la première question. Pas de nouveau tirage après erreur ou rechargement. Entre étapes/sessions les positions peuvent se répéter par hasard ; aucune promesse d’unicité globale.
Sélection puis bouton Valider ; ne pas modifier les positions au moment du retour. Erreur : explication et nouvelle tentative. Succès : état acquis et bouton Continuer. Cinq succès : mot-clé affiché, enregistré, étape suivante ouverte. Le joueur n’a pas besoin de mémoriser les mots sans carnet.

## Final
Cinq champs identifiés par spot, normalisation NFD, suppression des marques diacritiques, trim et majuscules. Vérifier tous les mots et toutes les validations. Ne pas supprimer les espaces internes arbitrairement. Afficher succès puis QR et téléchargement. Aucun classement de vitesse, aucune limite de temps.

## QR
Charge utile compacte : version, parcours, version de contenu, session UUID, défi de visite facultatif, masque des cinq étapes, résultat final. Préfixe de format SJ1 ; JSON en UTF-8 ou encodage base64url défini de façon unique. Générer une seule fois puis conserver la chaîne originale. Pas de réponses ni de noms d’élèves dans le QR. Checksum facultative uniquement pour corruption, jamais présentée comme signature.
Validateur : schéma strict, limite de taille, rejet d’URL arbitraire, contrôle de parcours/version/défi, cinq étapes et résultat, puis clic de confirmation du médiateur. Journal local des QR consommés. Même QR refusé sur ce poste tant que le journal subsiste. Pas d’unicité globale sans synchronisation. Caméra refusée : import d’une image ; mode de démonstration séparé et visible.
Le dispositif statique ne prouve pas l’absence de manipulation. Ne pas embarquer de clé privée, HMAC partagé ni inventer une signature qui serait secrète dans le navigateur visiteur.

## UX originale inspirée du jeu Daedalic
Ne pas copier ses décors, personnages, logo ou interface. Retenir décors peints, lumière dorée, pierre, profondeur et narration par chapitres. Dessins originaux de Saint-Junien ou photos personnelles stylisées. Illustration de tête discrète et interface de lecture claire. Palettes proposées : parchemin #F3E8D0, encre #252923, pierre #6D756B, or #B5904D, rouge #793A35, bleu #344B5A. Tester tous les contrastes et ne pas utiliser l’or pour un petit texte sur fond parchemin.
Titres serif sobres ; texte en police très lisible locale. Pas de gothique pour réponses et boutons. Cinq cartes numérotées, même largeur et hauteur par question, hauteur adaptée au plus long texte. Pas de troncature, pas de remplissage artificiel. Focus visible, navigation clavier, retours textuels, pas seulement couleur, taille tactile visée 48 px. Mouvement réduit, aucun audio obligatoire. Vue mobile une colonne. Aucune interaction historique fictive ajoutée aux quiz.

## Hors ligne
Précharger shell, JSON, images indispensables, polices et bibliothèque QR avant le départ. Vérifier leur disponibilité effective ; ne pas déduire le mode prêt hors ligne d’une seule absence d’erreur réseau. Définir un budget de poids et limiter les images décoratives. Prompt d’update, jamais de rechargement forcé pendant une session. En début de visite : connexion initiale obligatoire pour préparer le contenu. Les liens bibliographiques externes ne sont pas disponibles hors ligne sauf contenu local autorisé.

## Déploiement
Settings > Pages > GitHub Actions. Workflow : checkout, setup Node LTS compatible, npm ci, lint, typecheck, tests, validation contenu, build, upload artifact dist, deploy Pages. permissions contents:read, pages:write, id-token:write ; environment github-pages. Utiliser les versions d’actions officielles en vigueur lors de l’implémentation, idéalement pins SHA ; ne pas inventer des versions. Tester URL sous le sous-chemin du dépôt, refresh, manifest, scope et service worker.

## Lots et critères
1. Contenu : 5x5 questions, 5 options uniques, une bonne réponse, IDs uniques, sources et feedbacks ; test automatisé.
2. Domaine : randomisation persistante, progression, tentatives et clés ; tests unitaires.
3. Prototype lisible : parcours complet sans décoration ; tests sur mobile.
4. Persistance : reload à chaque étape, export, corruption et anciennes versions.
5. UX graphique : thèmes, illustration, cartes égales, contraste et réduction du mouvement.
6. Hors ligne : vraie coupure réseau, fermeture/réouverture sur appareils cibles ; mise à jour différée.
7. QR/validateur : scanner/importer, inconnu/corrompu/dupliqué et contrôle local.
8. Pages/terrain : sous-chemin, appareil iOS/Android, soleil, marche, une équipe pilote.

## Tests bloquants
Toute réponse valide par ID ; cinq positions gagnantes distinctes ; ordre inchangé après erreur/reload ; prochaine étape fermée jusqu’au cinquième succès ; finale impossible avec étape manquante ; mots accentués acceptés ; même QR après reload ; duplication locale détectée ; sources accessibles sans casser la navigation ; pas de texte tronqué à 200% ; aucun secret dans bundle.

## Références techniques et visuelles
https://vite.dev/guide/static-deploy
https://github.com/vite-pwa/vite-plugin-pwa
https://vite-pwa-org.netlify.app/guide/periodic-sw-updates
https://ken-follett.com/adaptations/the-pillars-of-the-earth-video-game/
https://www.artstation.com/artwork/3XXmJ
