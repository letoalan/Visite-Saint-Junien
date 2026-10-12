import { describe, it, expect } from 'vitest';
import { loadContentPack } from '../src/content/loader';
import { generateStageQuestionLayouts } from '../src/domain/permutations';

describe('Génération des Permutations et Disposition des Questions', () => {
  const pack = loadContentPack();
  const firstStage = pack.stages[0];

  it('génère 5 positions gagnantes distinctes (0..4) pour les 5 questions de l’étape', () => {
    const layouts = generateStageQuestionLayouts(firstStage.questions);
    const winningPositions = firstStage.questions.map(
      (q) => layouts[q.id].correctOptionPosition
    );

    // Les 5 positions gagnantes doivent être une permutation complète de 0..4
    expect(winningPositions.sort()).toEqual([0, 1, 2, 3, 4]);
  });

  it('place l’option gagnante exactement à la position déclarée pour chaque question', () => {
    const layouts = generateStageQuestionLayouts(firstStage.questions);
    firstStage.questions.forEach((q) => {
      const layout = layouts[q.id];
      const assignedWinningId = layout.optionIds[layout.correctOptionPosition];
      expect(assignedWinningId).toBe(q.correctOptionId);
    });
  });

  it('inclut l’intégralité des 5 options uniques dans la disposition ordonnée', () => {
    const layouts = generateStageQuestionLayouts(firstStage.questions);
    firstStage.questions.forEach((q) => {
      const layout = layouts[q.id];
      expect(layout.optionIds).toHaveLength(5);
      const originalIds = q.options.map((o) => o.id);
      expect([...layout.optionIds].sort()).toEqual([...originalIds].sort());
    });
  });
});
