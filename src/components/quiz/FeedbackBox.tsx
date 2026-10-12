import React from 'react';
import { Button } from '../common/Button';

interface FeedbackBoxProps {
  isCorrect: boolean;
  feedbackText: string;
  sourceIds: string[];
  sourcesDict: Record<string, string>;
  onContinue: () => void;
  onRetry: () => void;
  isLastQuestionInStage: boolean;
}

export const FeedbackBox: React.FC<FeedbackBoxProps> = ({
  isCorrect,
  feedbackText,
  sourceIds,
  sourcesDict,
  onContinue,
  onRetry,
  isLastQuestionInStage
}) => {
  return (
    <div
      className={`feedback-box ${isCorrect ? 'success' : 'error'}`}
      role="alert"
      aria-live="polite"
    >
      <div className="feedback-title">
        <span style={{ fontSize: '1.2rem' }}>{isCorrect ? '✦' : '⚠'}</span>
        <span>{isCorrect ? 'Réponse exacte !' : 'Réponse inexacte'}</span>
      </div>

      <p className="feedback-explanation mb-2">{feedbackText}</p>

      {sourceIds.length > 0 && (
        <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--color-ink-muted)' }}>
            Références documentaires :{' '}
          </span>
          <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 8 }}>
            {sourceIds.map((sId) => {
              const url = sourcesDict[sId];
              return url ? (
                <a
                  key={sId}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--color-blue)',
                    textDecoration: 'underline'
                  }}
                  title={`Consulter la source ${sId}`}
                >
                  [{sId}]
                </a>
              ) : (
                <span key={sId}>[{sId}]</span>
              );
            })}
          </span>
        </div>
      )}

      <div style={{ marginTop: '1.25rem', display: 'flex', width: '100%' }}>
        {isCorrect ? (
          <Button
            variant="gold"
            onClick={onContinue}
            style={{ width: '100%', minHeight: '52px', fontSize: '1.02rem' }}
          >
            {isLastQuestionInStage ? '✦ Débloquer le mot-clé de l’étape →' : 'Question suivante →'}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={onRetry}
            style={{ width: '100%', minHeight: '52px', fontSize: '1.02rem' }}
          >
            Nouvelle tentative
          </Button>
        )}
      </div>
    </div>
  );
};
