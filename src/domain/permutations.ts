import { ContentQuestion, QuestionLayout } from './types';

/**
 * Mélange aléatoire (Fisher-Yates) d'un tableau sans modifier l'original.
 */
export function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Génère la disposition ordonnée des 5 questions d'une étape selon la règle :
 * - Une permutation de [0, 1, 2, 3, 4] est tirée pour la bonne réponse de chaque question n.
 * - Les 4 distracteurs sont mélangés et répartis dans les 4 positions restantes.
 */
export function generateStageQuestionLayouts(
  questions: readonly ContentQuestion[]
): Record<string, QuestionLayout> {
  if (questions.length !== 5) {
    throw new Error(`Une étape doit comporter exactement 5 questions, reçu: ${questions.length}`);
  }

  // Permutation des 5 positions gagnantes pour les 5 questions
  const winningPositions = shuffleArray([0, 1, 2, 3, 4]);
  const layouts: Record<string, QuestionLayout> = {};

  questions.forEach((question, index) => {
    const correctPos = winningPositions[index];
    const correctOption = question.options.find(
      (opt) => opt.id === question.correctOptionId
    );
    if (!correctOption) {
      throw new Error(`Option correcte introuvable pour ${question.id}`);
    }

    const distractors = question.options.filter(
      (opt) => opt.id !== question.correctOptionId
    );
    if (distractors.length !== 4) {
      throw new Error(`Nombre de distracteurs incorrect pour ${question.id}`);
    }

    const shuffledDistractors = shuffleArray(distractors);

    // Remplissage des 5 positions
    const orderedIds: string[] = new Array(5);
    orderedIds[correctPos] = correctOption.id;

    let distractorIndex = 0;
    for (let slot = 0; slot < 5; slot++) {
      if (slot !== correctPos) {
        orderedIds[slot] = shuffledDistractors[distractorIndex].id;
        distractorIndex++;
      }
    }

    layouts[question.id] = {
      questionId: question.id,
      correctOptionPosition: correctPos,
      optionIds: orderedIds
    };
  });

  return layouts;
}
