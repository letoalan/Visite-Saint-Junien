/**
 * Normalise un mot-clé saisi selon les spécifications strictes :
 * 1. Décomposition canonique Unicode NFD
 * 2. Suppression des marques diacritiques (accents, cédilles, etc.)
 * 3. Suppression des espaces superflus de début et fin (trim)
 * 4. Passage en majuscules
 * Note : Les espaces internes sont conservés intacts.
 */
export function normalizeKeyword(input: string): string {
  if (!input) return '';
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();
}

/**
 * Compare un mot saisi avec le mot-clé de référence attendu.
 */
export function compareKeywords(input: string, expected: string): boolean {
  return normalizeKeyword(input) === normalizeKeyword(expected);
}
