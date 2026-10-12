import {
  ContentPack,
  ContentStage,
  UserSession,
  StageSessionState,
  QuestionSessionState
} from './types';
import { generateStageQuestionLayouts } from './permutations';

export function createInitialStageState(
  stage: ContentStage,
  status: 'locked' | 'active' | 'completed'
): StageSessionState {
  const layouts = generateStageQuestionLayouts(stage.questions);
  const questionsState: Record<string, QuestionSessionState> = {};

  stage.questions.forEach((q) => {
    questionsState[q.id] = {
      questionId: q.id,
      attempts: 0,
      selectedOptionId: null,
      isCorrect: false,
      layout: layouts[q.id]
    };
  });

  return {
    stageId: stage.id,
    status,
    currentQuestionIndex: 0,
    unlockedKeyword: null,
    questions: questionsState
  };
}

export function createNewSession(pack: ContentPack): UserSession {
  const stages: Record<string, StageSessionState> = {};

  pack.stages.forEach((stage, index) => {
    stages[stage.id] = createInitialStageState(
      stage,
      index === 0 ? 'active' : 'locked'
    );
  });

  const now = Date.now();
  return {
    sessionId: crypto.randomUUID ? crypto.randomUUID() : `sess_${now}_${Math.random().toString(36).slice(2, 9)}`,
    contentId: pack.id,
    contentVersion: pack.contentVersion,
    startedAt: now,
    updatedAt: now,
    stages,
    finalKeywordsSubmitted: {},
    isFinalValidated: false
  };
}

export function answerQuestion(
  session: UserSession,
  pack: ContentPack,
  stageId: string,
  questionId: string,
  selectedOptionId: string
): { updatedSession: UserSession; isCorrect: boolean } {
  const stage = pack.stages.find((s) => s.id === stageId);
  if (!stage) throw new Error(`Étape ${stageId} introuvable`);

  const question = stage.questions.find((q) => q.id === questionId);
  if (!question) throw new Error(`Question ${questionId} introuvable`);

  const stageState = session.stages[stageId];
  if (!stageState || stageState.status !== 'active') {
    throw new Error(`Étape ${stageId} non active`);
  }

  const qState = stageState.questions[questionId];
  if (!qState) throw new Error(`Question ${questionId} introuvable dans la session`);

  const isCorrect = selectedOptionId === question.correctOptionId;
  const newAttempts = qState.attempts + 1;

  const updatedQState: QuestionSessionState = {
    ...qState,
    attempts: newAttempts,
    selectedOptionId,
    isCorrect
  };

  const updatedQuestions = {
    ...stageState.questions,
    [questionId]: updatedQState
  };

  // Vérifier si toutes les 5 questions de l'étape sont réussies
  const allQuestionsCorrect = stage.questions.every((q) => {
    return q.id === questionId ? isCorrect : stageState.questions[q.id]?.isCorrect;
  });

  let nextStageStatus: 'active' | 'completed' = stageState.status;
  let unlockedKeyword = stageState.unlockedKeyword;

  if (allQuestionsCorrect) {
    nextStageStatus = 'completed';
    unlockedKeyword = stage.keyword;
  }

  const updatedStageState: StageSessionState = {
    ...stageState,
    status: nextStageStatus,
    unlockedKeyword,
    questions: updatedQuestions
  };

  const updatedStages = {
    ...session.stages,
    [stageId]: updatedStageState
  };

  // Débloquer l'étape suivante si l'étape courante vient d'être achevée
  if (allQuestionsCorrect) {
    const stageIndex = pack.stages.findIndex((s) => s.id === stageId);
    const nextStage = pack.stages[stageIndex + 1];
    if (nextStage && updatedStages[nextStage.id].status === 'locked') {
      updatedStages[nextStage.id] = {
        ...updatedStages[nextStage.id],
        status: 'active'
      };
    }
  }

  const updatedSession: UserSession = {
    ...session,
    updatedAt: Date.now(),
    stages: updatedStages
  };

  return { updatedSession, isCorrect };
}
