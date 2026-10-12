/**
 * Algorithme FNV-1a 32-bit pour détection d'altération / corruption.
 * Avertissement : Ce checksum n'est PAS une signature cryptographique et
 * ne protège pas contre la falsification volontaire côté client.
 */
export function computeCorruptionChecksum(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0; // Entier non signé 32-bit
}
