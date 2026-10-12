import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { BackgroundVideo } from '../components/common/BackgroundVideo';
import { ContentPack, UserSession } from '../domain/types';

interface HomeScreenProps {
  pack: ContentPack;
  session: UserSession | null;
  onStartSession: () => void;
  onResetSession: () => void;
  onNavigate: (route: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  pack,
  session,
  onStartSession,
  onResetSession,
  onNavigate
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const completedStagesCount = session
    ? Object.values(session.stages).filter((s) => s.status === 'completed').length
    : 0;

  return (
    <div className="landing-page-container">
      <BackgroundVideo />

      <div className="landing-content">
        <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
          <p className="text-gold" style={{ letterSpacing: '0.15em', fontSize: '0.85rem' }}>
            PARCOURS PATRIMONIAL & ÉNIGMES
          </p>
          <h1 className="mt-2">{pack.title}</h1>
          <div className="ornament-separator">✦ ✦ ✦</div>
          <p className="text-editorial">
            Explorez Saint-Junien à travers cinq lieux historiques majeurs. À chaque étape,
            résolvez cinq énigmes pour percer un mot-clé secret et compléter votre carnet.
          </p>
        </div>

        <Card>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            Instructions de visite
          </h2>
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
            <li>Cinq spots patrimoniaux à découvrir dans la ville.</li>
            <li>Cinq énigmes par spot, sans limite de temps.</li>
            <li>Toutes les questions sont basées sur des sources historiques réelles.</li>
            <li>Fonctionnement 100% hors ligne garanti une fois l’application chargée.</li>
            <li>À l’issue des 5 étapes, un QR code final sera validé par le médiateur.</li>
          </ul>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: '0.5rem' }}>
          {session ? (
            <>
              <Button
                variant="gold"
                onClick={() => onNavigate('#stages')}
                style={{ fontSize: '1.05rem', padding: '1rem' }}
              >
                Reprendre la visite ({completedStagesCount}/5 étapes validées) →
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowConfirmReset(true)}
              >
                Recommencer une nouvelle visite
              </Button>
            </>
          ) : (
            <Button
              variant="gold"
              onClick={onStartSession}
              style={{ fontSize: '1.1rem', padding: '1rem' }}
            >
              Commencer la visite historique →
            </Button>
          )}
        </div>
      </div>

      <Modal
        isOpen={showConfirmReset}
        onClose={() => setShowConfirmReset(false)}
        title="Réinitialiser la visite ?"
      >
        <p className="mb-4">
          Êtes-vous sûr de vouloir commencer une nouvelle visite ? La progression actuelle,
          les réponses enregistrées et les mots-clés du carnet seront effacés.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setShowConfirmReset(false)}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowConfirmReset(false);
              onResetSession();
            }}
          >
            Confirmer la réinitialisation
          </Button>
        </div>
      </Modal>
    </div>
  );
};
