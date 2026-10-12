import { ContentPack, UserSession } from './types';
import { compareKeywords } from './normalisation';

export interface FinalValidationResult {
  isValid: boolean;
  allStagesCompleted: boolean;
  keywordResults: Record<string, { submitted: string; isValid: boolean; expected: string }>;
  errorSummary?: string;
}

export function validateFinalSubmission(
  session: UserSession,
  pack: ContentPack,
  submittedKeywords: Record<string, string>
): FinalValidationResult {
  const allStagesCompleted = pack.stages.every(
    (stage) => session.stages[stage.id]?.status === 'completed'
  );

  if (!allStagesCompleted) {
    return {
      isValid: false,
      allStagesCompleted: false,
      keywordResults: {},
      errorSummary: 'Toutes les étapes doivent être réussies avant la validation finale.'
    };
  }

  const keywordResults: Record<
    string,
    { submitted: string; isValid: boolean; expected: string }
  > = {};

  let allKeywordsMatch = true;

  pack.stages.forEach((stage) => {
    const submitted = submittedKeywords[stage.id] || '';
    const matches = compareKeywords(submitted, stage.keyword);
    keywordResults[stage.id] = {
      submitted,
      isValid: matches,
      expected: stage.keyword
    };
    if (!matches) {
      allKeywordsMatch = false;
    }
  });

  return {
    isValid: allKeywordsMatch,
    allStagesCompleted,
    keywordResults,
    errorSummary: allKeywordsMatch
      ? undefined
      : 'Un ou plusieurs mots-clés sont incorrects. Vérifiez votre carnet.'
  };
}
