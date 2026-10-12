import { describe, it, expect } from 'vitest';
import { loadContentPack } from '../src/content/loader';
import { createNewSession, answerQuestion } from '../src/domain/session';
import { normalizeKeyword, compareKeywords } from '../src/domain/normalisation';
import { validateFinalSubmission } from '../src/domain/validator';

describe('Logique de Domaine et Session', () => {
  const pack = loadContentPack();

  it('initialise la session avec la première étape active et les autres verrouillées', () => {
    const session = createNewSession(pack);
    expect(session.stages['saint-amand'].status).toBe('active');
    expect(session.stages['pont-chapelle'].status).toBe('locked');
    expect(session.stages['collegiale'].status).toBe('locked');
    expect(session.stages['consuls'].status).toBe('locked');
    expect(session.stages['remparts'].status).toBe('locked');
  });

  it('incrémente les tentatives lors d’une erreur et conserve l’ordre des options', () => {
    const session = createNewSession(pack);
    const stageId = 'saint-amand';
    const q1 = pack.stages[0].questions[0];
    const initialLayout = session.stages[stageId].questions[q1.id].layout;

    const wrongOptionId = q1.options.find((o) => o.id !== q1.correctOptionId)!.id;
    const { updatedSession, isCorrect } = answerQuestion(
      session,
      pack,
      stageId,
      q1.id,
      wrongOptionId
    );

    expect(isCorrect).toBe(false);
    const qState = updatedSession.stages[stageId].questions[q1.id];
    expect(qState.attempts).toBe(1);
    expect(qState.isCorrect).toBe(false);
    // Disposition stable après tentative erronée
    expect(qState.layout).toEqual(initialLayout);
  });

  it('ne modifie pas l’état de la question suivante lors de la validation d’une question', () => {
    const session = createNewSession(pack);
    const stageId = 'saint-amand';
    const q1 = pack.stages[0].questions[0];
    const q2 = pack.stages[0].questions[1];

    const { updatedSession } = answerQuestion(
      session,
      pack,
      stageId,
      q1.id,
      q1.correctOptionId
    );

    const q1State = updatedSession.stages[stageId].questions[q1.id];
    const q2State = updatedSession.stages[stageId].questions[q2.id];

    expect(q1State.isCorrect).toBe(true);
    expect(q1State.selectedOptionId).toBe(q1.correctOptionId);

    // Question 2 doit être complètement vierge
    expect(q2State.attempts).toBe(0);
    expect(q2State.isCorrect).toBe(false);
    expect(q2State.selectedOptionId).toBeNull();
  });

  it('débloque le mot-clé et l’étape suivante uniquement après 5 succès', () => {
    let currentSession = createNewSession(pack);
    const stage0 = pack.stages[0];

    stage0.questions.forEach((q) => {
      const res = answerQuestion(
        currentSession,
        pack,
        stage0.id,
        q.id,
        q.correctOptionId
      );
      currentSession = res.updatedSession;
      expect(res.isCorrect).toBe(true);
    });

    expect(currentSession.stages[stage0.id].status).toBe('completed');
    expect(currentSession.stages[stage0.id].unlockedKeyword).toBe('MEMOIRE');
    expect(currentSession.stages['pont-chapelle'].status).toBe('active');
  });

  it('normalise les mots-clés : accepte accents, minuscules et espaces de pourtour', () => {
    expect(normalizeKeyword('  Mémoire  ')).toBe('MEMOIRE');
    expect(normalizeKeyword('mémoïre')).toBe('MEMOIRE');
    expect(normalizeKeyword('pâssàgé')).toBe('PASSAGE');
    expect(compareKeywords(' mémoire ', 'MEMOIRE')).toBe(true);
    expect(compareKeywords('sacre', 'SACRÉ')).toBe(true);
  });

  it('bloque la validation finale si une étape est manquante', () => {
    const session = createNewSession(pack);
    const res = validateFinalSubmission(session, pack, {
      'saint-amand': 'MEMOIRE'
    });
    expect(res.isValid).toBe(false);
    expect(res.allStagesCompleted).toBe(false);
  });
});
