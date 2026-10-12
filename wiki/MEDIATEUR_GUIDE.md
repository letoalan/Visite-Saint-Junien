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
