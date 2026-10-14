export interface ContentOption {
  id: string;
  text: string;
}

export interface ContentQuestion {
  id: string;
  prompt: string;
  options: ContentOption[];
  correctOptionId: string;
  feedback: string;
  sourceIds: string[];
}

export interface ContentStage {
  id: string;
  title: string;
  keyword: string;
  questions: ContentQuestion[];
}

export interface ContentPack {
  schemaVersion: number;
  contentVersion: string;
  id: string;
  title: string;
  sources: Record<string, string>;
  stages: ContentStage[];
}

/** Ordre calculé et sauvegardé des options pour une question */
export interface QuestionLayout {
  questionId: string;
  correctOptionPosition: number; // 0..4
  optionIds: string[]; // 5 IDs ordonnés
}

/** État d'une question dans la session */
export interface QuestionSessionState {
  questionId: string;
  attempts: number;
  selectedOptionId: string | null;
  isCorrect: boolean;
  layout: QuestionLayout;
}

/** État d'une étape dans la session */
export interface StageSessionState {
  stageId: string;
  status: 'locked' | 'active' | 'completed';
  currentQuestionIndex: number;
  unlockedKeyword: string | null;
  questions: Record<string, QuestionSessionState>;
}

/** État complet de session visiteur */
export interface UserSession {
  sessionId: string;
  contentId: string;
  contentVersion: string;
  startedAt: number;
  updatedAt: number;
  stages: Record<string, StageSessionState>;
  finalKeywordsSubmitted: Record<string, string>;
  isFinalValidated: boolean;
  finalCompletedAt?: number;
  qrPayload?: string;
  reward?: {
    rewardId: string;
    unlockedAt: number;
    rawToken: string;
    validatorNote?: string;
  };
}
