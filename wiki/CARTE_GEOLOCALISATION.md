# Carte Interactive, Tuiles Stylisées & Itinéraire Réel

L'application intègre une cartographie interactive complète associant **tuiles géographiques réelles**, **filtres visuels de parchemin enluminé**, **repérage numéroté de 1 à 5** et **tracé piétonnier réel** dans les rues de Saint-Junien.

---

## 📍 1. Coordonnées & Numérotation des 5 Spots

| # | Lieu Historique | Coordonnées GPS | Adresse / Repère |
|---|---|---|---|
| **1** | **Saint-Amand** | `45.887229° N, 0.889805° E`<br>*(45.88722905147311, 0.8898051668525597)* | Site de l’Ermitage Saint-Amand |
| **2** | **Pont et Notre-Dame-du-Pont** | `45.8800° N, 0.8990° E` | Quai des Mégisseries / Rue du Pont |
| **3** | **Collégiale et ostensions** | `45.8873° N, 0.9021° E` | Place Deffuas / Place de la Collégiale |
| **4** | **Maison dite des Consuls** | `45.887535° N, 0.901378° E`<br>*(45.887534787213355, 0.9013784381387228)* | Rue Lucien Dumas / Angle Rue d’Arsonval |
| **5** | **Remparts** | `45.885737° N, 0.899300° E`<br>*(45.88573699535376, 0.8993002289402143)* | Secteur des Remparts / Enceinte médiévale |

---

## 🗺️ 2. Tuiles Libres d'Accès & Rendu Parchemin Stylisé

- **Moteur Leaflet & Tuiles OpenStreetMap (Libre Accès)** : Utilisation des tuiles officielles libres d'accès `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, identiques au moteur cartographique utilisé par GitHub pour les rendus GeoJSON en test et production.
- **Teinte Parchemin & Encre** : Application d'un filtre CSS (`.stylized-parchment-tiles`) conférant aux tuiles un aspect d'enluminure médiévale tout en préservant une lisibilité totale des rues et du bâti.
- **Marqueurs Circulaires Numérotés 1 à 5** :
  - **1 à 5** clairement identifiables d'un coup d'œil.
  - Or (`#B5904D`) avec halo pour le spot actif et sélectionné.
  - Vert (`#2B593F`) avec coche `✓` pour les étapes acquises.
  - Pierre sombre pour les étapes ultérieures verrouillées.

---

## 🚶‍♂️ 3. Itinéraire Piétonnier Réel

La ligne de cheminement en pointillés dorés (`REAL_WALKING_ROUTE_COORDS`) suit scrupuleusement la voirie réelle :
1. **De Saint-Amand (1) au Pont (2)** : Départ de l'Ermitage Saint-Amand (`45.887229° N, 0.889805° E`), descente et cheminement vers la Vienne pour rallier le Pont Notre-Dame.
2. **Du Pont (2) à la Collégiale (3)** : Remontée par la Rue du Pont puis la Rue Lucien Dumas jusqu'au parvis de la Collégiale.
3. **De la Collégiale (3) à la Maison des Consuls (4)** : Traversée du centre historique vers la Maison des Consuls (`45.887535° N, 0.901378° E`).
4. **De la Maison des Consuls (4) aux Remparts (5)** : Descente ouest par le bourg historique vers les vestiges de l'enceinte médiévale (`45.885737° N, 0.899300° E`).

---

## 🛰️ 4. Repérage GPS en Direct

- **Bouton « 📍 Ma position »** : Interroge la puce GPS du smartphone pour positionner le marcheur sous forme de point bleu avec recentrage automatique.
- **Bouton « Itinéraire ↗ »** : Déclenche la navigation GPS piétonne native du téléphone pour un guidage virage par virage.
