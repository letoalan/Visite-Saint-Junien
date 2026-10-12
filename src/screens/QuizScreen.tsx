import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { OptionCard } from '../components/quiz/OptionCard';
import { FeedbackBox } from '../components/quiz/FeedbackBox';
import { StageProgress } from '../components/quiz/StageProgress';
import { ContentPack, UserSession } from '../domain/types';

interface QuizScreenProps {
  stageId: string;
  pack: ContentPack;
  session: UserSession;
  onAnswer: (stageId: string, questionId: string, optionId: string) => void;
  onNavigate: (route: string) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  stageId,
  pack,
  session,
  onAnswer,
  onNavigate
}) => {
  const stage = pack.stages.find((s) => s.id === stageId);
  const stageState = session.stages[stageId];
  const questions = stage?.questions || [];

  // Index de la question courante contrôlé localement
  const [questionIndex, setQuestionIndex] = useState<number>(() => {
    if (!stageState) return 0;
    const firstUnsolved = questions.findIndex(
      (q) => !stageState.questions[q.id]?.isCorrect
    );
    return firstUnsolved === -1 ? 0 : firstUnsolved;
  });

  const currentQuestion = questions[questionIndex];
  const qState = currentQuestion ? stageState?.questions[currentQuestion.id] : undefined;

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    qState?.selectedOptionId || null
  );
  const [feedbackVisible, setFeedbackVisible] = useState<boolean>(
    Boolean(qState?.isCorrect)
  );

  if (!stage || !stageState || !currentQuestion || !qState) {
    return (
      <div>
        <p>Étape ou question introuvable.</p>
        <Button onClick={() => onNavigate('#stages')}>Retour aux étapes</Button>
      </div>
    );
  }

  const isAlreadyCorrect = qState.isCorrect;
  const layout = qState.layout;
  const completedQuestions = questions.map((q) => Boolean(stageState.questions[q.id]?.isCorrect));

  const handleOptionSelect = (optId: string) => {
    if (isAlreadyCorrect) return;
    if (feedbackVisible && !isAlreadyCorrect) {
      setFeedbackVisible(false);
    }
    setSelectedOptionId(optId);
  };

  const handleValidate = () => {
    if (!selectedOptionId) return;
    onAnswer(stageId, currentQuestion.id, selectedOptionId);
    setFeedbackVisible(true);
  };

  const handleContinue = () => {
    if (questionIndex < questions.length - 1) {
      const nextIdx = questionIndex + 1;
      const nextQ = questions[nextIdx];
      const nextQState = stageState.questions[nextQ.id];
      setQuestionIndex(nextIdx);
      setSelectedOptionId(nextQState?.selectedOptionId || null);
      setFeedbackVisible(Boolean(nextQState?.isCorrect));
    } else {
      onNavigate('#stages');
    }
  };

  const handleRetry = () => {
    setFeedbackVisible(false);
    setSelectedOptionId(null);
  };

  return (
    <div className="flex-column-gap">
      <div className="flex-row-between">
        <button
          type="button"
          onClick={() => onNavigate('#stages')}
          className="text-subtle"
          style={{ fontSize: '0.9rem', cursor: 'pointer' }}
        >
          ← Retour aux étapes
        </button>
        <span className="badge badge-gold">
          Étape : {stage.title}
        </span>
      </div>

      <StageProgress
        currentQuestionIndex={questionIndex}
        completedQuestions={completedQuestions}
      />

      <Card>
        <div className="flex-row-between mb-2">
          <span className="text-subtle" style={{ fontSize: '0.85rem' }}>
            Question {questionIndex + 1} sur 5
          </span>
          {qState.attempts > 0 && (
            <span className="text-subtle" style={{ fontSize: '0.85rem' }}>
              Tentatives : {qState.attempts}
            </span>
          )}
        </div>

        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>
          {currentQuestion.prompt}
        </h2>

        <div className="quiz-options-grid" role="radiogroup" aria-label="Options de réponse">
          {layout.optionIds.map((optId, idx) => {
            const option = currentQuestion.options.find((o) => o.id === optId)!;
            const isSelected = selectedOptionId === optId;
            const isCorrect = feedbackVisible && optId === currentQuestion.correctOptionId;
            const isIncorrect = feedbackVisible && isSelected && !isCorrect;

            return (
              <OptionCard
                key={optId}
                index={idx}
                text={option.text}
                isSelected={isSelected}
                isCorrect={isCorrect}
                isIncorrect={isIncorrect}
                disabled={isAlreadyCorrect}
                onSelect={() => handleOptionSelect(optId)}
              />
            );
          })}
        </div>

        {!feedbackVisible && (
          <div style={{ display: 'flex', width: '100%', marginTop: '1.25rem' }}>
            <Button
              variant="primary"
              disabled={!selectedOptionId}
              onClick={handleValidate}
              style={{ width: '100%', minHeight: '52px', fontSize: '1.05rem' }}
            >
              Valider la réponse
            </Button>
          </div>
        )}

        {feedbackVisible && (
          <FeedbackBox
            isCorrect={qState.isCorrect}
            feedbackText={currentQuestion.feedback}
            sourceIds={currentQuestion.sourceIds}
            sourcesDict={pack.sources}
            onContinue={handleContinue}
            onRetry={handleRetry}
            isLastQuestionInStage={questionIndex === questions.length - 1}
          />
        )}
      </Card>
    </div>
  );
};
