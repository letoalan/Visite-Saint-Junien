import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ContentPack, UserSession } from '../domain/types';
import { buildSessionQrPayload, generateQrDataUrl } from '../qr/encode';

interface QrScreenProps {
  pack: ContentPack;
  session: UserSession;
  onNavigate: (route: string) => void;
}

export const QrScreen: React.FC<QrScreenProps> = ({
  pack,
  session,
  onNavigate
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrString, setQrString] = useState<string>('');

  useEffect(() => {
    const payload = session.qrPayload || buildSessionQrPayload(session, pack);
    setQrString(payload);
    generateQrDataUrl(payload, 280).then(setQrDataUrl);
  }, [session, pack]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `saint-junien-session-${session.sessionId.slice(0, 8)}.png`;
    link.click();
  };

  return (
    <div className="flex-column-gap">
      <div style={{ textAlign: 'center' }}>
        <p className="text-gold" style={{ letterSpacing: '0.15em', fontSize: '0.85rem' }}>
          PARCOURS COMPLÉTÉ AVEC SUCCÈS
        </p>
        <h1 style={{ fontSize: '1.6rem' }} className="mt-2">
          Attestation de Session
        </h1>
        <p className="text-subtle mt-2">
          Présentez ce QR code au médiateur culturel pour faire valider votre parcours.
        </p>
      </div>

      <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {qrDataUrl ? (
          <div
            style={{
              padding: 12,
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--color-gold)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <img
              src={qrDataUrl}
              alt="QR Code d'attestation de fin de parcours Saint-Junien"
              style={{ width: 260, height: 260, display: 'block' }}
            />
          </div>
        ) : (
          <p>Génération du QR code en cours...</p>
        )}

        <div style={{ marginTop: '1.25rem', textAlign: 'center', width: '100%' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)' }}>
            Identifiant de session :
          </p>
          <code
            style={{
              display: 'inline-block',
              fontSize: '0.8rem',
              backgroundColor: 'var(--color-parchment-deep)',
              padding: '2px 8px',
              borderRadius: '4px',
              wordBreak: 'break-all'
            }}
          >
            {session.sessionId}
          </code>
        </div>

        <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: '1.5rem' }}>
          <Button
            variant="gold"
            onClick={handleDownload}
            style={{ flex: 1 }}
            disabled={!qrDataUrl}
          >
            📥 Télécharger le QR
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigator.clipboard?.writeText(qrString)}
            title="Copier le code SJ1 dans le presse-papier"
          >
            Copier le code
          </Button>
        </div>
      </Card>

      <Card>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>
            🎁 Récompense de Visite
          </h2>
          {session.reward ? (
            <div>
              <p className="text-subtle" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                Votre visite a été validée par le médiateur ! Votre cadeau patrimonial est débloqué.
              </p>
              <Button
                variant="gold"
                onClick={() => onNavigate('#cadeau')}
                style={{ width: '100%' }}
              >
                🎁 Voir ma planche historique offerte →
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-subtle" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                Après avoir présenté votre QR ci-dessus au médiateur, celui-ci vous présentera en retour un <strong>QR code de réponse</strong> pour vous offrir une planche historique exclusive.
              </p>
              <Button
                variant="secondary"
                onClick={() => onNavigate('#cadeau')}
                style={{ width: '100%' }}
              >
                📷 Saisir ou scanner mon QR cadeau du médiateur →
              </Button>
            </div>
          )}
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="secondary" onClick={() => onNavigate('#stages')}>
          ← Revenir au parcours
        </Button>
      </div>
    </div>
  );
};
