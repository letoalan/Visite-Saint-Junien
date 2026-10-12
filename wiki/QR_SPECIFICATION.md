# Spécification du QR Code d'Attestation

Le QR code généré en fin de visite constitue une preuve de complétion locale, conçue pour être scannée par le médiateur du patrimoine.

---

## 📦 1. Format & Préfixe de Charge Utile

Toute charge utile produite par l'application respecte le format standardisé :
```
SJ1:<données-base64url>
```
Le préfixe **`SJ1:`** garantit l'identification immédiate du protocole *Saint-Junien Version 1* et permet au validateur de rejeter immédiatement toute URL arbitraire ou code tiers non pertinent.

---

## 📄 2. Schéma JSON de la Charge Utile

Avant encodage en base64url, les données forment un objet JSON compact :

| Champ | Type | Description |
|---|---|---|
| `v` | `1` | Version du protocole QR. |
| `cid` | `string` | Identifiant du pack de contenu (ex: `saint-junien-pouvoirs`). |
| `cv` | `string` | Version du pack de contenu (ex: `1.0.0`). |
| `sid` | `string` | Identifiant unique de la session visiteur (UUID). |
| `stages` | `number[]` | Masque binaire des 5 étapes réussies (`[1, 1, 1, 1, 1]`). |
| `res` | `boolean` | Indicateur de succès du défi final des mots-clés (`true`). |
| `ts` | `number` | Horodatage Unix (millisecondes) de complétion. |
| `chk` | `number` | Checksum 32-bit FNV-1a de détection de corruption. |

*Remarque essentielle : Aucune donnée nominative (nom, prénom) ni détail des réponses n'est embarqué dans le QR code.*

---

## 🧮 3. Checksum FNV-1a vs Signature Cryptographique

> [!IMPORTANT]
> Dans une application statique sans serveur ni secrets partagés, aucune clé privée ne peut être sécurisée côté navigateur client. 
> 
> Par conséquent, le checksum `chk` est explicitement documenté comme une **mesure de détection d'altération et de corruption accidentelle de transmission** (bruit optique, troncature), et **non comme une signature cryptographique infalsifiable**.

La protection contre la réutilisation malveillante est assurée au niveau du médiateur par le **journal local anti-rejeu**.

---

## 📲 4. Rendu Visuel du QR Code

- Bibliothèque : `qrcode`
- Niveau de correction d'erreur : `M` (15% de redondance)
- Couleurs : Encre sombre `#222620` sur fond parchemin clair `#FBF7EE`
- Téléchargement : Export direct en fichier PNG pour conservation sur le smartphone du visiteur.
