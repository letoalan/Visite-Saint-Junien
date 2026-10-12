import { describe, it, expect } from 'vitest';
import { loadContentPack } from '../src/content/loader';
import { createNewSession } from '../src/domain/session';
import { buildSessionQrPayload } from '../src/qr/encode';
import { decodeQrPayload } from '../src/qr/decode';

describe('QR Code : Encodage, Décodage et Anti-corruption', () => {
  const pack = loadContentPack();

  it('génère un payload avec le préfixe SJ1 et le décode avec succès', () => {
    const session = createNewSession(pack);
    session.isFinalValidated = true;
    session.finalCompletedAt = Date.now();

    const qrString = buildSessionQrPayload(session, pack);
    expect(qrString.startsWith('SJ1:')).toBe(true);

    const result = decodeQrPayload(qrString);
    expect(result.success).toBe(true);
    expect(result.payload?.sid).toBe(session.sessionId);
    expect(result.payload?.res).toBe(true);
    expect(result.payload?.stages).toEqual([0, 0, 0, 0, 0]);
  });

  it('rejette une chaîne de QR sans préfixe SJ1', () => {
    const result = decodeQrPayload('INVALID_STRING_123');
    expect(result.success).toBe(false);
    expect(result.error).toContain('SJ1:');
  });

  it('détecte et rejette un QR dont le contenu a été altéré (échec de checksum)', () => {
    const session = createNewSession(pack);
    session.isFinalValidated = true;
    const qrString = buildSessionQrPayload(session, pack);

    // Altération d'un caractère dans la chaîne base64
    const altered = qrString.slice(0, -3) + 'XYZ';
    const result = decodeQrPayload(altered);
    expect(result.success).toBe(false);
  });
});
