import { getDatabase, ConsumedQrRecord } from './db';
import { QrPayload } from '../qr/schema';

export async function isQrAlreadyConsumed(sid: string): Promise<boolean> {
  const db = await getDatabase();
  const existing = await db.get('qr_journal', sid);
  return !!existing;
}

export async function recordConsumedQr(
  payload: QrPayload,
  mediatorNote?: string,
  rewardId?: string,
  rewardQrPayload?: string
): Promise<ConsumedQrRecord> {
  const db = await getDatabase();
  const record: ConsumedQrRecord = {
    sid: payload.sid,
    consumedAt: Date.now(),
    payload,
    mediatorNote,
    rewardId,
    rewardQrPayload
  };
  await db.put('qr_journal', record);
  return record;
}

export async function getAllConsumedRecords(): Promise<ConsumedQrRecord[]> {
  const db = await getDatabase();
  const records = await db.getAllFromIndex('qr_journal', 'by-date');
  return records.reverse(); // Les plus récents d'abord
}

export async function clearConsumedJournal(): Promise<void> {
  const db = await getDatabase();
  await db.clear('qr_journal');
}
