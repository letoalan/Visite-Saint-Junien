import React from 'react';

interface OptionCardProps {
  index: number;
  text: string;
  isSelected: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  disabled: boolean;
  onSelect: () => void;
}

const INDEX_LABELS = ['A', 'B', 'C', 'D', 'E'];

export const OptionCard: React.FC<OptionCardProps> = ({
  index,
  text,
  isSelected,
  isCorrect,
  isIncorrect,
  disabled,
  onSelect
}) => {
  let stateClass = '';
  if (isCorrect) stateClass = 'correct';
  else if (isIncorrect) stateClass = 'incorrect';
  else if (isSelected) stateClass = 'selected';

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      disabled={disabled}
      className={`option-card ${stateClass}`}
      onClick={onSelect}
    >
      <span className="option-index" aria-hidden="true">
        {INDEX_LABELS[index] || index + 1}
      </span>
      <span className="option-text">{text}</span>
      {isCorrect && (
        <span aria-label="Bonne réponse" style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>
          ✓
        </span>
      )}
      {isIncorrect && (
        <span aria-label="Mauvaise réponse" style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>
          ✕
        </span>
      )}
    </button>
  );
};
