import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const LandingShareQr: React.FC = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = 'https://edurl.fr/medsju';
  const qrSrc = `${import.meta.env.BASE_URL}landing-qr.png`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <>
      <Card className="landing-share-card">
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>
            📲 Accès & Partage avec l'auditoire
          </h2>
          <p className="text-subtle" style={{ fontSize: '0.85rem', marginBottom: '0.9rem' }}>
            Faites scanner ce QR code par votre groupe pour démarrer directement la visite.
          </p>

          <div
            onClick={() => setIsZoomed(true)}
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '0.6rem',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--color-parchment-border)',
              boxShadow: 'var(--shadow-sm)'
            }}
            title="Cliquer pour agrandir le QR code"
          >
            <img
              src={qrSrc}
              alt="QR Code d'accès rapide"
              style={{
                width: 130,
                height: 130,
                objectFit: 'contain',
                display: 'block'
              }}
            />
            <span
              style={{
                marginTop: '0.4rem',
                fontSize: '0.78rem',
                color: 'var(--color-ink-muted)',
                fontWeight: 600
              }}
            >
              🔍 Cliquer pour agrandir
            </span>
          </div>

          <div
            style={{
              marginTop: '0.9rem',
              padding: '0.65rem 0.8rem',
              background: 'var(--color-parchment-deep)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-parchment-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              alignItems: 'center'
            }}
          >
            <span style={{ fontSize: '0.82rem', color: 'var(--color-ink-muted)' }}>
              En cas d'impossibilité de scanner :
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--color-gold-darker)',
                  letterSpacing: '0.02em',
                  textDecoration: 'underline'
                }}
              >
                {shareUrl}
              </a>
              <Button
                variant="secondary"
                onClick={handleCopy}
                style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
              >
                {copied ? '✓ Copié !' : '📋 Copier'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={isZoomed}
        onClose={() => setIsZoomed(false)}
        title="Partage pour l'auditoire"
      >
        <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
          <p className="text-subtle mb-3" style={{ fontSize: '0.9rem' }}>
            Présentez ce QR code à l'assemblée ou projetez-le pour un scan instantané.
          </p>
          <div
            style={{
              display: 'inline-block',
              padding: '1rem',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '3px solid var(--color-gold)',
              boxShadow: 'var(--shadow-card)',
              marginBottom: '1rem'
            }}
          >
            <img
              src={qrSrc}
              alt="QR Code grand format"
              style={{
                width: 'min(70vw, 280px)',
                height: 'min(70vw, 280px)',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
          <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem', fontWeight: 600 }}>
            Mini-lien direct :{' '}
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold"
              style={{ textDecoration: 'underline' }}
            >
              {shareUrl}
            </a>
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={handleCopy}>
              {copied ? '✓ Lien copié !' : '📋 Copier le mini-lien'}
            </Button>
            <Button variant="primary" onClick={() => setIsZoomed(false)}>
              Fermer
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
