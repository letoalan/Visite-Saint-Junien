import React, { useEffect } from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(34, 38, 32, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="card-manuscript"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-row-between mb-4">
          <h2 id="modal-title" style={{ fontSize: '1.25rem' }}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la boîte de dialogue"
            style={{
              fontSize: '1.4rem',
              lineHeight: 1,
              color: 'var(--color-ink-muted)',
              padding: '4px 8px'
            }}
          >
            ×
          </button>
        </div>
        <div className="mb-4">{children}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};
