import { describe, it, expect } from 'vitest';
import { loadContentPack } from '../src/content/loader';
import { createNewSession } from '../src/domain/session';
import { buildSessionQrPayload, buildRewardQrPayload, buildRewardUrl } from '../src/qr/encode';
import { decodeQrPayload, decodeRewardQrPayload } from '../src/qr/decode';
import { pickReward, HERITAGE_REWARDS } from '../src/content/rewards';

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

  it('décode un QR de session contenu dans une URL complète', () => {
    const session = createNewSession(pack);
    session.isFinalValidated = true;
    const qrString = buildSessionQrPayload(session, pack);
    const wrappedUrl = `https://edurl.fr/medsju?code=${qrString}&utm=1`;

    const result = decodeQrPayload(wrappedUrl);
    expect(result.success).toBe(true);
    expect(result.payload?.sid).toBe(session.sessionId);
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

  describe('QR Réponse du Médiateur (SJR1)', () => {
    it('génère et décode un QR cadeau avec succès', () => {
      const rewardQr = buildRewardQrPayload('session_abc123', 'collegiale-histoire', 'Médiateur Marie');
      expect(rewardQr.startsWith('SJR1:')).toBe(true);

      const decoded = decodeRewardQrPayload(rewardQr);
      expect(decoded.success).toBe(true);
      expect(decoded.payload?.sid).toBe('session_abc123');
      expect(decoded.payload?.rid).toBe('collegiale-histoire');
      expect(decoded.payload?.val).toBe('Médiateur Marie');
    });

    it('décode un QR cadeau à partir d’une URL complète', () => {
      const rewardQr = buildRewardQrPayload('session_xyz789', 'ostensions-saint-junien');
      const url = buildRewardUrl(rewardQr, 'https://edurl.fr/medsju');
      expect(url).toContain('#cadeau?token=');

      const decoded = decodeRewardQrPayload(url);
      expect(decoded.success).toBe(true);
      expect(decoded.payload?.sid).toBe('session_xyz789');
      expect(decoded.payload?.rid).toBe('ostensions-saint-junien');
    });

    it('décode un QR cadeau inclus directement dans un lien ou fragment', () => {
      const rewardQr = buildRewardQrPayload('session_direct', 'collegiale-histoire');
      const directUrl = `https://saint-junien.fr/visite#cadeau/${rewardQr}&ref=poster`;

      const decoded = decodeRewardQrPayload(directUrl);
      expect(decoded.success).toBe(true);
      expect(decoded.payload?.sid).toBe('session_direct');
      expect(decoded.payload?.rid).toBe('collegiale-histoire');
    });

    it('rejette un QR cadeau dont le checksum a été altéré', () => {
      const rewardQr = buildRewardQrPayload('session_abc123', 'collegiale-histoire');
      const altered = rewardQr.slice(0, -3) + '999';
      const decoded = decodeRewardQrPayload(altered);
      expect(decoded.success).toBe(false);
    });

    it('sélectionne une récompense valide dans le catalogue', () => {
      expect(HERITAGE_REWARDS.length).toBe(13);
      const r1 = pickReward('session_seed_1');
      const r2 = pickReward('session_seed_1');
      expect(r1.id).toBe(r2.id); // Déterministe pour une même session
      expect(HERITAGE_REWARDS.some((r) => r.id === r1.id)).toBe(true);
    });
  });
});

