import { getDatabase } from './db';
import { UserSession } from '../domain/types';

const ACTIVE_SESSION_KEY = 'current_active_session';

export async function saveActiveSession(session: UserSession): Promise<void> {
  const db = await getDatabase();
  await db.put('sessions', session, ACTIVE_SESSION_KEY);
  // Sauvegarde miroir par ID historique
  await db.put('sessions', session, session.sessionId);
}

export async function loadActiveSession(): Promise<UserSession | null> {
  try {
    const db = await getDatabase();
    const session = await db.get('sessions', ACTIVE_SESSION_KEY);
    return session || null;
  } catch (error) {
    console.error('Erreur lors du chargement de la session depuis IndexedDB:', error);
    return null;
  }
}

export async function clearActiveSession(): Promise<void> {
  const db = await getDatabase();
  await db.delete('sessions', ACTIVE_SESSION_KEY);
}

export function exportSessionToJson(session: UserSession): string {
  return JSON.stringify(session, null, 2);
}

export function importSessionFromJson(jsonString: string): UserSession {
  const parsed = JSON.parse(jsonString) as UserSession;
  if (!parsed.sessionId || !parsed.stages) {
    throw new Error('Format de session exportée invalide.');
  }
  return parsed;
}
