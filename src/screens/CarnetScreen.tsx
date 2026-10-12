import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ContentPack, UserSession } from '../domain/types';

interface CarnetScreenProps {
  pack: ContentPack;
  session: UserSession;
  onNavigate: (route: string) => void;
}

export const CarnetScreen: React.FC<CarnetScreenProps> = ({
  pack,
  session,
  onNavigate
}) => {
  const allStagesCompleted = pack.stages.every(
    (stage) => session.stages[stage.id]?.status === 'completed'
  );

  return (
    <div className="flex-column-gap">
      <div className="flex-row-between">
        <div>
          <h1 style={{ fontSize: '1.6rem' }}>Carnet de Visite</h1>
          <p className="text-subtle">
            Conservez précieusement les mots-clés découverts à chaque étape.
          </p>
        </div>
      </div>

      <Card>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          Mots-Clés Récoltés
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pack.stages.map((stage, idx) => {
            const stageState = session.stages[stage.id];
            const isCompleted = stageState?.status === 'completed';

            return (
              <div
                key={stage.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isCompleted ? 'var(--color-parchment-deep)' : '#ffffff',
                  border: '1px solid var(--color-parchment-border)'
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    {idx + 1}. {stage.title}
                  </span>
                </div>

                <div>
                  {isCompleted ? (
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        color: 'var(--color-gold-deep)',
                        fontSize: '1.05rem'
                      }}
                    >
                      {stageState.unlockedKeyword}
                    </span>
                  ) : (
                    <span className="text-subtle" style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>
                      [En attente de validation]
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
          Références & Bibliographie
        </h2>
        <p className="text-subtle mb-4" style={{ fontSize: '0.85rem' }}>
          Toutes les questions et données s’appuient sur les recherches et publications patrimoniales suivantes :
        </p>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem' }}>
          {Object.entries(pack.sources).map(([key, url]) => (
            <li key={key}>
              <strong style={{ color: 'var(--color-ink)' }}>[{key}]</strong> :{' '}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--color-blue)', textDecoration: 'underline', wordBreak: 'break-all' }}
              >
                {url}
              </a>
            </li>
          ))}
        </ul>
      </Card>

      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="secondary" onClick={() => onNavigate('#stages')} style={{ flex: 1 }}>
          ← Retour aux étapes
        </Button>
        {allStagesCompleted && (
          <Button variant="gold" onClick={() => onNavigate('#final')} style={{ flex: 1 }}>
            Défi final →
          </Button>
        )}
      </div>
    </div>
  );
};
