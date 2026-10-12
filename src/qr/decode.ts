import { QrPayload, QrPayloadSchema } from './schema';
import { computeCorruptionChecksum } from './checksum';

export function base64UrlToString(b64url: string): string {
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export interface QrDecodeResult {
  success: boolean;
  payload?: QrPayload;
  error?: string;
}

export function decodeQrPayload(rawInput: string): QrDecodeResult {
  const trimmed = rawInput.trim();

  if (!trimmed.startsWith('SJ1:')) {
    return {
      success: false,
      error: "Format invalide : le code doit commencer par le préfixe 'SJ1:'."
    };
  }

  const encodedData = trimmed.slice(4);
  let jsonString = '';

  try {
    jsonString = base64UrlToString(encodedData);
  } catch {
    return {
      success: false,
      error: 'Décodage base64url impossible : chaîne altérée.'
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return {
      success: false,
      error: 'JSON invalide dans la charge utile du QR.'
    };
  }

  const parseResult = QrPayloadSchema.safeParse(parsed);
  if (!parseResult.success) {
    return {
      success: false,
      error: `Schéma de QR non conforme : ${parseResult.error.issues.map((i) => i.message).join(', ')}`
    };
  }

  const payload = parseResult.data;

  // Vérification de corruption avec le checksum FNV-1a
  const rawForChecksum = `${payload.v}|${payload.cid}|${payload.cv}|${payload.sid}|${payload.stages.join('')}|${payload.res}|${payload.ts}`;
  const expectedChk = computeCorruptionChecksum(rawForChecksum);

  if (payload.chk !== expectedChk) {
    return {
      success: false,
      error: 'Altération détectée : le checksum de contrôle est invalide.'
    };
  }

  return {
    success: true,
    payload
  };
}
