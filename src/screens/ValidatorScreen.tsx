import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { decodeQrPayload } from '../qr/decode';
import { QrPayload } from '../qr/schema';
import {
  isQrAlreadyConsumed,
  recordConsumedQr,
  getAllConsumedRecords
} from '../storage/journalStore';
import { ConsumedQrRecord } from '../storage/db';

export const ValidatorScreen: React.FC = () => {
  const [manualCode, setManualCode] = useState('');
  const [currentResult, setCurrentResult] = useState<{
    payload?: QrPayload;
    isDuplicate?: boolean;
    error?: string;
  } | null>(null);
  const [journal, setJournal] = useState<ConsumedQrRecord[]>([]);
  const [mediatorNote, setMediatorNote] = useState('');

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
    await recordConsumedQr(currentResult.payload, mediatorNote || 'Visite validée avec succès');
    setCurrentResult(null);
    setManualCode('');
    setMediatorNote('');
    loadJournal();
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
                  fontSize: '0.85rem'
                }}
              >
                <strong>{new Date(record.consumedAt).toLocaleTimeString()}</strong> —{' '}
                <code>{record.sid.slice(0, 16)}...</code>{' '}
                {record.mediatorNote && <em>({record.mediatorNote})</em>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};
