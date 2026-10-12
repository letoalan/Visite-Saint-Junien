import { describe, it, expect } from 'vitest';
import { loadContentPack } from '../src/content/loader';

describe('Pack de contenu et Schémas', () => {
  it('charge et valide avec succès le pack de 25 questions', () => {
    const pack = loadContentPack();
    expect(pack.schemaVersion).toBe(1);
    expect(pack.contentVersion).toBe('1.0.0');
    expect(pack.stages).toHaveLength(5);
  });

  it('vérifie que chaque étape possède 5 questions de 5 options chacune', () => {
    const pack = loadContentPack();
    pack.stages.forEach((stage) => {
      expect(stage.keyword).toBeTruthy();
      expect(stage.questions).toHaveLength(5);
      stage.questions.forEach((q) => {
        expect(q.options).toHaveLength(5);
        expect(q.correctOptionId).toBeTruthy();
        expect(q.feedback).toBeTruthy();
        const correctOpt = q.options.find((o) => o.id === q.correctOptionId);
        expect(correctOpt).toBeDefined();
      });
    });
  });

  it('vérifie que toutes les sources référencées existent dans le dictionnaire sources', () => {
    const pack = loadContentPack();
    pack.stages.forEach((stage) => {
      stage.questions.forEach((q) => {
        q.sourceIds.forEach((sId) => {
          expect(pack.sources[sId]).toBeDefined();
        });
      });
    });
  });
});
