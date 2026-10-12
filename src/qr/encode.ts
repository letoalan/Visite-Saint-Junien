import QRCode from 'qrcode';
import { UserSession, ContentPack } from '../domain/types';
import { QrPayload } from './schema';
import { computeCorruptionChecksum } from './checksum';

export function stringToBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function buildSessionQrPayload(
  session: UserSession,
  pack: ContentPack
): string {
  const stageMask = pack.stages.map((stage) =>
    session.stages[stage.id]?.status === 'completed' ? 1 : 0
  );

  const partialPayload = {
    v: 1 as const,
    cid: session.contentId,
    cv: session.contentVersion,
    sid: session.sessionId,
    stages: stageMask,
    res: session.isFinalValidated,
    ts: session.finalCompletedAt || Date.now()
  };

  const rawForChecksum = `${partialPayload.v}|${partialPayload.cid}|${partialPayload.cv}|${partialPayload.sid}|${stageMask.join('')}|${partialPayload.res}|${partialPayload.ts}`;
  const chk = computeCorruptionChecksum(rawForChecksum);

  const payload: QrPayload = {
    ...partialPayload,
    chk
  };

  const jsonStr = JSON.stringify(payload);
  const encoded = stringToBase64Url(jsonStr);
  return `SJ1:${encoded}`;
}

export async function generateQrDataUrl(
  text: string,
  width: number = 300
): Promise<string> {
  return QRCode.toDataURL(text, {
    width,
    margin: 2,
    color: {
      dark: '#222620',
      light: '#fbf7ee'
    },
    errorCorrectionLevel: 'M'
  });
}
