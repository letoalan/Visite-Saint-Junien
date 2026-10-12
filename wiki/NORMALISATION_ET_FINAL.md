# Normalisation & Défi Final des Mots-Clés

Le défi final invite le visiteur à saisir les cinq mots-clés découverts lors de ses pérégrinations. Afin de prévenir toute frustration liée aux spécificités de saisie sur smartphone (claviers virtuels, accents automatiques ou majuscules), une procédure de normalisation stricte et bienveillante est appliquée.

---

## 🔤 1. Procédure de Normalisation Unicode

La fonction `normalizeKeyword(input: string)` suit la séquence suivante :

1. **Décomposition Canonique Unicode NFD** :
   - Décompose les caractères combinés (ex: `é` devient `e` + `\u0301`).
2. **Suppression des Diacritiques** :
   - Élimination de toutes les marques diacritiques via l'expression régulière `/[\u0300-\u036f]/g`.
   - Ainsi : `É`, `è`, `ê`, `ë` deviennent tous `e` ; `ç` devient `c`.
3. **Élimination des espaces de bordure (`trim`)** :
   - Les espaces saisis par mégarde au début ou à la fin de la saisie sont supprimés.
4. **Conservation des espaces internes** :
   - Conformément aux spécifications, les espaces internes éventuels ne sont pas tronqués arbitrairement.
5. **Passage en Majuscules (`toUpperCase`)** :
   - La casse est uniformisée.

---

## 📋 2. Mots-Clés Officiels du Parcours

| Spot | Titre du Lieu | Mot-Clé Officiel | Exemples Acceptés |
|---|---|---|---|
| **1** | Saint-Amand | `MEMOIRE` | `mémoire`, `MEMOIRE `, `Memoire` |
| **2** | Pont et Notre-Dame-du-Pont | `PASSAGE` | `passage`, `Passage`, ` PASSAGE` |
| **3** | Collégiale et ostensions | `SACRE` | `sacré`, `SACRE`, `sacre` |
| **4** | Maison dite des Consuls | `DROITS` | `droits`, `DROITS`, `Droits` |
| **5** | Remparts | `ENCEINTE` | `enceinte`, `Enceinte`, `ENCEINTE` |

---

## 🛡️ 3. Contrôle des Prérequis

L'accès à la validation finale requiert impérativement que **les 5 étapes aient été préalablement complétées** dans la session. Même si un visiteur devinait les cinq mots-clés, la validation refuserait la génération de l'attestation si l'historique des étapes présentait un statut incomplet.

Une fois validée, la session est figée avec son horodatage de fin (`finalCompletedAt`), et la charge utile du QR code est générée.
