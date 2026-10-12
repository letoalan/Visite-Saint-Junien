import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { UserSession } from '../domain/types';
import { QrPayload } from '../qr/schema';

export interface ConsumedQrRecord {
  sid: string;
  consumedAt: number;
  payload: QrPayload;
  mediatorNote?: string;
}

export interface SaintJunienDB extends DBSchema {
  sessions: {
    key: string;
    value: UserSession;
  };
  qr_journal: {
    key: string; // sid
    value: ConsumedQrRecord;
    indexes: { 'by-date': number };
  };
}

const DB_NAME = 'saint_junien_app_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<SaintJunienDB>> | null = null;

export function getDatabase(): Promise<IDBPDatabase<SaintJunienDB>> {
  if (!dbPromise) {
    dbPromise = openDB<SaintJunienDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions');
        }
        if (!db.objectStoreNames.contains('qr_journal')) {
          const journalStore = db.createObjectStore('qr_journal', {
            keyPath: 'sid'
          });
          journalStore.createIndex('by-date', 'consumedAt');
        }
      }
    });
  }
  return dbPromise;
}
