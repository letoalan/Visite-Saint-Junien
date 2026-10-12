# Règles Métier & Logique du Quiz

La conception du quiz répond à des exigences rigoureuses d'équité, d'immutabilité et de fidélité historique.

---

## 🎲 1. Algorithme des Permutations de Réponses

Afin d'éviter tout biais cognitif d'apprentissage par position (par exemple la bonne réponse toujours en "A"), chaque étape applique la règle suivante :

1. **Permutation des 5 positions gagnantes** :
   - Pour les 5 questions d'une étape, un tirage sans remise des positions `[0, 1, 2, 3, 4]` est effectué.
   - La question $n$ (de 0 à 4) se voit assigner la position $P[n]$ pour sa bonne réponse.
   - Par conséquent, sur une même étape, la bonne réponse occupe **chacune des cinq positions possibles exactement une fois**.
2. **Répartition des distracteurs** :
   - Les quatre distracteurs de la question sont mélangés aléatoirement par l'algorithme de Fisher-Yates.
   - Ils sont ensuite insérés dans les quatre positions restantes.
3. **Persistance préalable** :
   - Cette disposition ordonnée (`QuestionLayout`) est calculée et enregistrée dans la session locale avant l'affichage de la première question de l'étape.

---

## 🔒 2. Immutabilité de la Disposition

- **Pas de nouveau tirage après erreur** : Si le joueur sélectionne une mauvaise option, la disposition des cartes ne change pas lors de la nouvelle tentative. L'utilisateur analyse son erreur sans être déstabilisé par un mélange intempestif.
- **Persistance au rechargement** : La disposition est conservée dans IndexedDB ; recharger la page ou fermer le navigateur ne modifie pas l'ordre des options.

---

## 🏷️ 3. Validation par Identifiant Stable

Chaque option possède un identifiant unique immuable (ex: `saint-amand-1-0`). La validation d'une réponse compare systématiquement :
```ts
selectedOptionId === question.correctOptionId
```
La position affichée (index 0..4) n'intervient **jamais** dans le contrôle de validité.

---

## 📈 4. Déblocage Séquentiel et Compteur de Tentatives

- Les étapes doivent être parcourues dans l'ordre (1 à 5).
- L'étape suivante demeure verrouillée tant que les 5 questions de l'étape courante ne sont pas validées.
- Chaque tentative infructueuse incrémente le compteur `attempts` associé à la question.
- Lorsque les 5 questions d'une étape sont résolues :
  - Le statut de l'étape passe à `completed`.
  - Le mot-clé secret de l'étape est révélé et inscrit dans le carnet.
  - L'étape suivante passe automatiquement à l'état `active`.
