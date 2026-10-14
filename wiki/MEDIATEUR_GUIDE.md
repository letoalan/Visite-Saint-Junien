# Guide Pratique du Médiateur Culturel

L'écran **Médiateur** (accessible via le lien dans la barre supérieure ou l'ancre `#validateur`) permet aux agents d'accueil et médiateurs culturels de valider l'accomplissement du parcours par un visiteur ou un groupe scolaire.

---

## 🔍 1. Modalités de Lecture du QR Code

L'interface propose trois méthodes d'entrée complémentaires :

1. **Lecteur optique matériel / Douchette USB** :
   - Fonctionne directement en collant ou scannant la chaîne dans la zone de texte prévue.
2. **Import ou Saisie manuelle de la chaîne** :
   - Si la caméra du terminal d'accueil n'est pas activée, le visiteur peut transmettre ou montrer sa chaîne textuelle (`SJ1:...`).
3. **Mode Démonstration (`Simuler un QR démo`)** :
   - Génère instantanément une charge utile conforme pour tester l'interface ou former un nouveau médiateur sans attendre un vrai visiteur.

---

## 🛡️ 2. Détection Anti-Doublon (Replay Defense)

Lorsque le médiateur soumet un QR code :

1. L'application décode la charge utile, vérifie le préfixe `SJ1:`, le schéma Zod et le checksum anti-corruption.
2. Elle interroge la table IndexedDB `qr_journal` avec la clé unique `sid` (Session UUID).
3. **Cas A : Nouveau QR valide** :
   - Affichage en vert : *QR Conforme & Authentique*.
   - Rappel des données : ID de session, nom du parcours, étapes validées (5/5).
   - Champ de note optionnelle (ex: "Groupe scolaire A", "Validé par Marie").
   - Bouton de confirmation : *Valider et inscrire au journal*.
4. **Cas B : QR déjà présenté** :
   - Affichage en rouge clignotant : *Attention : QR DÉJÀ CONSOMMÉ*.
   - Le bouton de validation est désactivé afin d'empêcher un double enregistrement.

---

## 📜 3. Consultation du Journal des Visites

La partie inférieure de l'écran liste les visites validées sur ce poste par ordre antéchronologique avec :
- L'heure exacte de passage.
- L'identifiant abrégé de la session.
- La note éventuelle consignée par le médiateur.

Ce journal persiste même en cas de fermeture du navigateur ou de redémarrage de la machine.

---

## 📲 4. Lancement de la Visite & Partage avec l'Auditoire

Sur la page d'accueil (Landing Page), un module dédié permet au médiateur de lancer rapidement un groupe ou un public :
- **QR Code d'accès rapide** : Affiché en vignette dans le bandeau d'accueil pour scan immédiat par les smartphones des visiteurs.
- **Agrandissement plein écran (Modal)** : Un clic sur le QR code ou sur « 🔍 Cliquer pour agrandir » affiche le QR code en haute définition plein écran, idéal pour une projection ou une présentation collective.
- **Mini-lien de secours** : En cas d'appareil sans lecteur optique ou d'échec du scan, le lien court officiel est directement mis à disposition et copiable en un clic :
  👉 `https://edurl.fr/medsju`

---

## 🎁 5. Remise du Cadeau & QR Code de Réponse

Lors de la validation d'une attestation conforme :

1. **Attribution Aléatoire d'une Planche Patrimoniale** :
   - Le système tire au sort une illustration exclusive parmi le catalogue des 13 planches haute définition (Collégiale Saint-Junien, Abbaye Saint-Amand, Chapelle Notre-Dame-du-Pont, Ostensions, mégisseries et patrimoine médiéval).
   - Cette planche est automatiquement enregistrée et liée à la session dans le journal local.

2. **Présentation du QR Cadeau à l'Usager** :
   - Une fenêtre surgissante affiche instantanément le **QR Code de réponse** en haute résolution.
   - L'usager le scanne directement avec l'appareil photo de son smartphone.
   - Le lien direct ouvre automatiquement l'écran `#cadeau` sur le téléphone de l'usager, révélant la planche en haute résolution avec son cartel explicatif et lui permettant de la télécharger en PNG ou de la conserver dans son carnet de visite.

3. **Lien de secours & Ré-affichage** :
   - Si la caméra du visiteur est indisponible, le médiateur peut cliquer sur « 📋 Copier le lien cadeau » pour transmettre l'URL ou la chaîne `SJR1:...`.
   - Si un visiteur demande à revoir son QR après coup, le médiateur peut cliquer sur « 🎁 Revoir le QR » dans l'historique du journal à tout moment.


