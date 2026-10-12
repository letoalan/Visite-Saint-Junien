import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { ContentPack, UserSession } from '../domain/types';

interface StagesScreenProps {
  pack: ContentPack;
  session: UserSession;
  onSelectStage: (stageId: string) => void;
  onNavigate: (route: string) => void;
}

export const StagesScreen: React.FC<StagesScreenProps> = ({
  pack,
  session,
  onSelectStage,
  onNavigate
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const allStagesCompleted = pack.stages.every(
    (stage) => session.stages[stage.id]?.status === 'completed'
  );

  return (
    <div className="flex-column-gap">
      <div>
        <h1 style={{ fontSize: '1.6rem' }}>Parcours des 5 Lieux</h1>
        <p className="text-subtle mt-2">
          Découvrez la ville étape par étape. Consultez la carte géolocalisée ou la liste ordonnée.
        </p>
      </div>

      <div className="view-mode-toggle" role="tablist" aria-label="Mode d'affichage">
        <button
          type="button"
          className={`view-mode-btn ${viewMode === 'map' ? 'active' : ''}`}
          onClick={() => setViewMode('map')}
          role="tab"
          aria-selected={viewMode === 'map'}
        >
          🗺️ Carte des 5 points
        </button>
        <button
          type="button"
          className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
          role="tab"
          aria-selected={viewMode === 'list'}
        >
          📋 Liste chronologique
        </button>
      </div>

      {viewMode === 'map' ? (
        <InteractiveMap session={session} onSelectStage={onSelectStage} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pack.stages.map((stage, index) => {
            const stageState = session.stages[stage.id];
            const isCompleted = stageState?.status === 'completed';
            const isActive = stageState?.status === 'active';
            const isLocked = !stageState || stageState.status === 'locked';

            return (
              <div
                key={stage.id}
                className={`stage-nav-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
                role="button"
                tabIndex={isLocked ? -1 : 0}
                onClick={() => !isLocked && onSelectStage(stage.id)}
                onKeyDown={(e) => e.key === 'Enter' && !isLocked && onSelectStage(stage.id)}
                aria-disabled={isLocked}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: isCompleted
                        ? 'var(--color-success)'
                        : isActive
                        ? 'var(--color-gold)'
                        : 'var(--color-stone-light)',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </span>

                  <div>
                    <h2 style={{ fontSize: '1.15rem' }}>{stage.title}</h2>
                    <p className="text-subtle" style={{ fontSize: '0.85rem' }}>
                      {isCompleted
                        ? `Mot secret : ${stageState.unlockedKeyword}`
                        : isActive
                        ? 'Étape active — 5 énigmes'
                        : 'Verrouillée (terminer l’étape précédente)'}
                    </p>
                  </div>
                </div>

                <div>
                  {isActive && <span className="badge badge-gold">En cours →</span>}
                  {isCompleted && (
                    <span className="badge" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                      Acquise
                    </span>
                  )}
                  {isLocked && <span style={{ color: 'var(--color-ink-muted)', fontSize: '1.2rem' }}>🔒</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {allStagesCompleted ? (
          <Button
            variant="gold"
            onClick={() => onNavigate('#final')}
            style={{ fontSize: '1.1rem', padding: '1rem' }}
          >
            ✦ Accéder au Défi Final des Mots-Clés →
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={() => onNavigate('#carnet')}
          >
            Consulter le carnet de visite
          </Button>
        )}
      </div>
    </div>
  );
};
