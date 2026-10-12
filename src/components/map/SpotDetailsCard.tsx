import React from 'react';
import { SpotLocation } from '../../domain/locations';
import { StageSessionState } from '../../domain/types';
import { Button } from '../common/Button';

interface SpotDetailsCardProps {
  spot: SpotLocation;
  stageState?: StageSessionState;
  onEnterStage: (stageId: string) => void;
}

export const SpotDetailsCard: React.FC<SpotDetailsCardProps> = ({
  spot,
  stageState,
  onEnterStage
}) => {
  const isLocked = !stageState || stageState.status === 'locked';
  const isCompleted = stageState?.status === 'completed';
  const isActive = stageState?.status === 'active';

  return (
    <div className="map-spot-details">
      <div className="flex-row-between mb-2">
        <div>
          <h3 style={{ fontSize: '1.1rem' }}>
            {spot.stageIndex + 1}. {spot.title}
          </h3>
          <p className="text-subtle" style={{ fontSize: '0.85rem' }}>
            {spot.subtitle}
          </p>
        </div>
        <span
          className={`badge ${isCompleted ? 'badge-online' : isActive ? 'badge-gold' : 'badge-offline'}`}
        >
          {isCompleted ? 'Acquis' : isActive ? 'En cours' : 'Verrouillé'}
        </span>
      </div>

      <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem', lineHeight: '1.5' }}>
        {spot.description}
      </p>

      <p className="text-subtle" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
        📍 {spot.address} ({spot.lat.toFixed(5)}°N, {spot.lng.toFixed(5)}°E)
      </p>

      <div style={{ display: 'flex', gap: 10 }}>
        <Button
          variant="gold"
          disabled={isLocked}
          onClick={() => onEnterStage(spot.id)}
          style={{ flex: 1, minHeight: '44px' }}
        >
          {isCompleted ? 'Revoir les énigmes' : 'Entrer sur ce spot →'}
        </Button>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
          style={{ minHeight: '44px', padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
          title="Ouvrir l'itinéraire piéton dans votre application GPS"
        >
          Itinéraire ↗
        </a>
      </div>
    </div>
  );
};
