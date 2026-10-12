import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ContentPack, UserSession } from '../domain/types';
import { validateFinalSubmission } from '../domain/validator';

interface FinalScreenProps {
  pack: ContentPack;
  session: UserSession;
  onValidateFinal: (keywords: Record<string, string>) => void;
  onNavigate: (route: string) => void;
}

export const FinalScreen: React.FC<FinalScreenProps> = ({
  pack,
  session,
  onValidateFinal,
  onNavigate
}) => {
  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    pack.stages.forEach((s) => {
      initial[s.id] = session.finalKeywordsSubmitted[s.id] || session.stages[s.id]?.unlockedKeyword || '';
    });
    return initial;
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (stageId: string, val: string) => {
    setInputs((prev) => ({ ...prev, [stageId]: val }));
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateFinalSubmission(session, pack, inputs);
    if (!result.isValid) {
      setErrorMsg(result.errorSummary || 'Mots-clés invalides.');
      return;
    }
    onValidateFinal(inputs);
    onNavigate('#qr');
  };

  return (
    <div className="flex-column-gap">
      <div>
        <h1 style={{ fontSize: '1.6rem' }}>Validation Finale de la Visite</h1>
        <p className="text-subtle mt-2">
          Saisissez les cinq mots-clés débloqués au cours de votre périple pour générer
          votre attestation QR de session.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {pack.stages.map((stage, idx) => (
              <div key={stage.id}>
                <label
                  htmlFor={`keyword-${stage.id}`}
                  style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 6 }}
                >
                  Spot {idx + 1} — {stage.title}
                </label>
                <input
                  id={`keyword-${stage.id}`}
                  type="text"
                  className="input-keyword"
                  value={inputs[stage.id] || ''}
                  onChange={(e) => handleInputChange(stage.id, e.target.value)}
                  placeholder="MOT-CLÉ"
                  autoComplete="off"
                  required
                />
              </div>
            ))}
          </div>

          {errorMsg && (
            <div
              className="feedback-box error"
              style={{ marginTop: '1.25rem' }}
              role="alert"
            >
              <div className="feedback-title">⚠ Erreur de validation</div>
              <p className="feedback-explanation">{errorMsg}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: '1.5rem' }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onNavigate('#carnet')}
            >
              Consulter le carnet
            </Button>
            <Button type="submit" variant="gold" style={{ flex: 1 }}>
              Vérifier et générer le QR →
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
