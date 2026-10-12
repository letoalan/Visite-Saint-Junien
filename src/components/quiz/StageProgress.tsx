import React from 'react';

interface StageProgressProps {
  currentQuestionIndex: number;
  totalQuestions?: number;
  completedQuestions: boolean[];
}

export const StageProgress: React.FC<StageProgressProps> = ({
  currentQuestionIndex,
  totalQuestions = 5,
  completedQuestions
}) => {
  return (
    <div
      className="stage-step-pills"
      role="progressbar"
      aria-label="Progression dans l'étape"
      aria-valuenow={currentQuestionIndex + 1}
      aria-valuemin={1}
      aria-valuemax={totalQuestions}
    >
      {Array.from({ length: totalQuestions }).map((_, index) => {
        let pillClass = '';
        if (completedQuestions[index]) {
          pillClass = 'completed';
        } else if (index === currentQuestionIndex) {
          pillClass = 'active';
        }
        return (
          <div
            key={index}
            className={`step-pill ${pillClass}`}
            title={`Question ${index + 1} sur ${totalQuestions}`}
          />
        );
      })}
    </div>
  );
};
