import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { UserSession } from '../domain/types';
import { decodeRewardQrPayload } from '../qr/decode';
import {
  HeritageReward,
  findRewardById,
  getRewardImageUrl
} from '../content/rewards';

interface RewardScreenProps {
  session: UserSession | null;
  onUpdateSessionReward: (data: {
    rewardId: string;
    rawToken: string;
    validatorNote?: string;
  }) => void;
  onNavigate: (route: string) => void;
}

export const RewardScreen: React.FC<RewardScreenProps> = ({
  session,
  onUpdateSessionReward,
  onNavigate
}) => {
  const [reward, setReward] = useState<HeritageReward | null>(null);
  const [validatorNote, setValidatorNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    // 1. Chercher un token dans le hash de l'URL
    const hash = window.location.hash;
    const tokenMatch = hash.match(/[?&]token=([^&]+)/);

    if (tokenMatch && tokenMatch[1]) {
      const rawToken = decodeURIComponent(tokenMatch[1]);
      processToken(rawToken);
      return;
    }

    // 2. Si pas de token dans l'URL mais la session a déjà une récompense
    if (session?.reward) {
      const found = findRewardById(session.reward.rewardId);
      if (found) {
        setReward(found);
        setValidatorNote(session.reward.validatorNote || null);
        return;
      }
    }
  }, [session]);

  const processToken = (tokenString: string) => {
    setError(null);
    const result = decodeRewardQrPayload(tokenString);

    if (!result.success || !result.payload) {
      setError(result.error || 'Code de récompense invalide.');
      return;
    }

    const found = findRewardById(result.payload.rid);
    if (!found) {
      setError("La récompense associée à ce code n'a pas été trouvée dans le catalogue.");
      return;
    }

    setReward(found);
    setValidatorNote(result.payload.val || null);

    // Enregistrer dans la session si active
    onUpdateSessionReward({
      rewardId: found.id,
      rawToken: tokenString,
      validatorNote: result.payload.val
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    processToken(manualCode.trim());
  };

  const handleDownloadImage = () => {
    if (!reward) return;
    const link = document.createElement('a');
    link.href = getRewardImageUrl(reward.filename);
    link.download = reward.filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="flex-column-gap">
      <div style={{ textAlign: 'center' }}>
        <p className="text-gold" style={{ letterSpacing: '0.15em', fontSize: '0.85rem' }}>
          ✦ RÉCOMPENSE PATRIMONIALE OFFICIELLE ✦
        </p>
        <h1 style={{ fontSize: '1.7rem' }} className="mt-2">
          Votre Souvenir de Saint-Junien
        </h1>
        <p className="text-subtle mt-2">
          Offert par le médiateur culturel en témoignage de l'accomplissement de votre parcours patrimonial.
        </p>
      </div>

      {reward ? (
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              padding: '0.6rem',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '3px solid var(--color-gold)',
              boxShadow: 'var(--shadow-card)',
              width: '100%',
              maxWidth: 480,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <img
              src={getRewardImageUrl(reward.filename)}
              alt={reward.title}
              style={{
                width: '100%',
                maxHeight: '420px',
                objectFit: 'contain',
                borderRadius: 'var(--radius-sm)',
                display: 'block'
              }}
            />
          </div>

          <div style={{ marginTop: '1.25rem', textAlign: 'center', width: '100%' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                color: 'var(--color-gold-darker)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                marginBottom: '0.3rem'
              }}
            >
              {reward.theme}
            </span>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.6rem' }}>
              {reward.title}
            </h2>
            <p className="text-editorial" style={{ maxWidth: 540, margin: '0 auto', fontSize: '0.92rem' }}>
              {reward.description}
            </p>

            {validatorNote && (
              <div
                style={{
                  marginTop: '0.9rem',
                  fontSize: '0.85rem',
                  color: 'var(--color-ink-muted)',
                  fontStyle: 'italic'
                }}
              >
                Mention du médiateur : « {validatorNote} »
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 12,
              width: '100%',
              marginTop: '1.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            <Button
              variant="gold"
              onClick={handleDownloadImage}
              style={{ flex: 1, minWidth: 220 }}
            >
              {downloadSuccess ? '✓ Téléchargement lancé !' : '📥 Télécharger la planche HD (PNG)'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => onNavigate('#carnet')}
            >
              📖 Mon carnet
            </Button>
            <Button
              variant="secondary"
              onClick={() => onNavigate('#home')}
            >
              🏠 Accueil
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <p className="text-editorial" style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>
              Pour révéler votre planche cadeau, scannez le <strong>QR Code de réponse</strong> présenté par le médiateur à l’accueil.
            </p>

            <form onSubmit={handleManualSubmit} style={{ maxWidth: 440, margin: '0 auto', textAlign: 'left' }}>
              <label
                htmlFor="reward-code"
                style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: 6 }}
              >
                Ou collez ici le code de réponse (SJR1:... ou lien complet) :
              </label>
              <textarea
                id="reward-code"
                rows={3}
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Ex : SJR1:eyJ2IjoxLCJzaWQiOi..."
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-parchment-border)',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  marginBottom: '1rem'
                }}
              />

              {error && (
                <div className="feedback-box error" style={{ marginBottom: '1rem' }}>
                  <div className="feedback-title">⚠ Code Non Reconnu</div>
                  <p className="feedback-explanation">{error}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <Button type="submit" variant="gold" style={{ flex: 1 }} disabled={!manualCode.trim()}>
                  Révéler mon cadeau →
                </Button>
                <Button type="button" variant="secondary" onClick={() => onNavigate('#home')}>
                  Retour
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
};
