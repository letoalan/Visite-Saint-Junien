import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { decodeQrPayload } from '../qr/decode';
import { QrPayload } from '../qr/schema';
import {
  buildRewardQrPayload,
  buildRewardUrl,
  generateQrDataUrl
} from '../qr/encode';
import {
  HeritageReward,
  pickReward,
  findRewardById,
  getRewardImageUrl
} from '../content/rewards';
import {
  isQrAlreadyConsumed,
  recordConsumedQr,
  getAllConsumedRecords
} from '../storage/journalStore';
import { ConsumedQrRecord } from '../storage/db';

interface ValidatedRewardView {
  reward: HeritageReward;
  qrDataUrl: string;
  qrUrl: string;
  qrString: string;
  sid: string;
}

export const ValidatorScreen: React.FC = () => {
  const [manualCode, setManualCode] = useState('');
  const [currentResult, setCurrentResult] = useState<{
    payload?: QrPayload;
    isDuplicate?: boolean;
    error?: string;
  } | null>(null);
  const [journal, setJournal] = useState<ConsumedQrRecord[]>([]);
  const [mediatorNote, setMediatorNote] = useState('');
  const [activeRewardModal, setActiveRewardModal] = useState<ValidatedRewardView | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const loadJournal = () => {
    getAllConsumedRecords().then(setJournal);
  };

  useEffect(() => {
    loadJournal();
  }, []);

  const processQrString = async (rawString: string) => {
    const decodeResult = decodeQrPayload(rawString);
    if (!decodeResult.success || !decodeResult.payload) {
      setCurrentResult({ error: decodeResult.error || 'Code invalide.' });
      return;
    }

    const duplicate = await isQrAlreadyConsumed(decodeResult.payload.sid);
    setCurrentResult({
      payload: decodeResult.payload,
      isDuplicate: duplicate
    });
  };

  const handleConfirmValidation = async () => {
    if (!currentResult?.payload || currentResult.isDuplicate) return;

    // 1. Tirage aléatoire déterministe d'une planche patrimoine
    const reward = pickReward(currentResult.payload.sid);

    // 2. Encodage du QR réponse de validation
    const note = mediatorNote.trim() || 'Visite validée avec succès';
    const rewardPayload = buildRewardQrPayload(currentResult.payload.sid, reward.id, note);
    const rewardUrl = buildRewardUrl(rewardPayload);
    const qrDataUrl = await generateQrDataUrl(rewardUrl, 320);

    // 3. Sauvegarde dans le journal
    await recordConsumedQr(
      currentResult.payload,
      note,
      reward.id,
      rewardPayload
    );

    // 4. Affichage du modal cadeau
    setActiveRewardModal({
      reward,
      qrDataUrl,
      qrUrl: rewardUrl,
      qrString: rewardPayload,
      sid: currentResult.payload.sid
    });

    setCurrentResult(null);
    setManualCode('');
    setMediatorNote('');
    loadJournal();
  };

  const handleReplayReward = async (record: ConsumedQrRecord) => {
    const rewardId = record.rewardId || pickReward(record.sid).id;
    const reward = findRewardById(rewardId) || pickReward(record.sid);
    const payload =
      record.rewardQrPayload ||
      buildRewardQrPayload(record.sid, reward.id, record.mediatorNote);
    const url = buildRewardUrl(payload);
    const qrDataUrl = await generateQrDataUrl(url, 320);

    setActiveRewardModal({
      reward,
      qrDataUrl,
      qrUrl: url,
      qrString: payload,
      sid: record.sid
    });
  };

  const handleCopyRewardUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDemoTest = () => {
    // Crée un QR démo valide pour la formation
    const demoPayload = {
      v: 1 as const,
      cid: 'saint-junien-pouvoirs',
      cv: '1.0.0',
      sid: `demo_${Date.now()}`,
      stages: [1, 1, 1, 1, 1],
      res: true,
      ts: Date.now()
    };
    const rawChk = `${demoPayload.v}|${demoPayload.cid}|${demoPayload.cv}|${demoPayload.sid}|11111|true|${demoPayload.ts}`;
    let hash = 0x811c9dc5;
    for (let i = 0; i < rawChk.length; i++) {
      hash ^= rawChk.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    const chk = hash >>> 0;
    const jsonStr = JSON.stringify({ ...demoPayload, chk });
    const b64 = btoa(unescape(encodeURIComponent(jsonStr))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    processQrString(`SJ1:${b64}`);
  };

  return (
    <div className="flex-column-gap">
      <div>
        <h1 style={{ fontSize: '1.6rem' }}>Validateur Médiateur</h1>
        <p className="text-subtle mt-2">
          Contrôlez les attestations QR présentées par les visiteurs et prévenez les doublons.
        </p>
      </div>

      <Card>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Lecture d’un QR Code</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <textarea
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Collez ici la chaîne SJ1:... ou utilisez un lecteur optique"
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-parchment-border)',
              fontFamily: 'monospace',
              fontSize: '0.85rem'
            }}
          />

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              onClick={() => processQrString(manualCode)}
              disabled={!manualCode.trim()}
            >
              Vérifier le QR
            </Button>
            <Button variant="secondary" onClick={handleDemoTest}>
              🧪 Simuler un QR démo
            </Button>
          </div>
        </div>

        {currentResult && (
          <div style={{ marginTop: '1.5rem' }}>
            {currentResult.error && (
              <div className="feedback-box error">
                <div className="feedback-title">✕ Code Refusé</div>
                <p className="feedback-explanation">{currentResult.error}</p>
              </div>
            )}

            {currentResult.payload && (
              <div
                className={`feedback-box ${currentResult.isDuplicate ? 'error' : 'success'}`}
              >
                <div className="feedback-title">
                  {currentResult.isDuplicate ? '⚠ Attention : QR DÉJÀ CONSOMMÉ' : '✓ QR Conforme & Authentique'}
                </div>
                <p className="feedback-explanation">
                  Session : {currentResult.payload.sid}<br />
                  Parcours : {currentResult.payload.cid} (v{currentResult.payload.cv})<br />
                  Étapes validées : {currentResult.payload.stages.filter((s) => s === 1).length}/5
                </p>

                {!currentResult.isDuplicate && (
                  <div style={{ marginTop: '1rem' }}>
                    <input
                      type="text"
                      placeholder="Note optionnelle du médiateur (ex: Groupe Scolaire B)"
                      value={mediatorNote}
                      onChange={(e) => setMediatorNote(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        marginBottom: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-parchment-border)'
                      }}
                    />
                    <Button variant="gold" onClick={handleConfirmValidation}>
                      Valider et inscrire au journal
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Card>

      <Card>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>
          Journal Local des Visites Consommées ({journal.length})
        </h2>
        {journal.length === 0 ? (
          <p className="text-subtle">Aucun QR validé sur ce poste pour le moment.</p>
        ) : (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {journal.slice(0, 10).map((record) => (
              <li
                key={record.sid}
                style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'var(--color-parchment-deep)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <strong>{new Date(record.consumedAt).toLocaleTimeString()}</strong> —{' '}
                  <code>{record.sid.slice(0, 16)}...</code>{' '}
                  {record.mediatorNote && <em>({record.mediatorNote})</em>}
                  {record.rewardId && (
                    <div style={{ marginTop: 4, fontSize: '0.8rem', color: 'var(--color-gold-darker)' }}>
                      🎁 <strong>{findRewardById(record.rewardId)?.title || record.rewardId}</strong>
                    </div>
                  )}
                </div>
                <Button
                  variant="secondary"
                  onClick={() => handleReplayReward(record)}
                  style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
                  title="Afficher à nouveau le QR cadeau pour ce visiteur"
                >
                  🎁 Revoir le QR
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {activeRewardModal && (
        <Modal
          isOpen={true}
          onClose={() => setActiveRewardModal(null)}
          title="🎉 Visite Validée ! QR Cadeau Usager"
        >
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p className="text-subtle" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              Invitez l'usager à scanner ce QR code avec l'appareil photo de son smartphone pour débloquer sa lithographie en cadeau.
            </p>

            <div
              style={{
                padding: '0.75rem',
                background: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '3px solid var(--color-gold)',
                boxShadow: 'var(--shadow-card)',
                marginBottom: '1rem'
              }}
            >
              <img
                src={activeRewardModal.qrDataUrl}
                alt="QR Code de récompense pour l'usager"
                style={{ width: 240, height: 240, display: 'block' }}
              />
            </div>

            <div
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--color-parchment-deep)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-parchment-border)',
                marginBottom: '1rem',
                textAlign: 'left',
                display: 'flex',
                gap: 12,
                alignItems: 'center'
              }}
            >
              <img
                src={getRewardImageUrl(activeRewardModal.reward.filename)}
                alt={activeRewardModal.reward.title}
                style={{
                  width: 70,
                  height: 70,
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-gold)'
                }}
              />
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: 'var(--color-gold-darker)',
                    fontWeight: 700,
                    letterSpacing: '0.05em'
                  }}
                >
                  {activeRewardModal.reward.theme}
                </span>
                <h3 style={{ fontSize: '0.95rem', margin: '2px 0 4px 0' }}>
                  {activeRewardModal.reward.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)', margin: 0 }}>
                  {activeRewardModal.reward.description}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                onClick={() => handleCopyRewardUrl(activeRewardModal.qrUrl)}
              >
                {copiedLink ? '✓ Lien copié !' : '📋 Copier le lien cadeau'}
              </Button>
              <Button
                variant="gold"
                onClick={() => setActiveRewardModal(null)}
              >
                ✓ Visiteur suivant
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
