import { ContentPackSchema, ValidatedContentPack } from '../domain/schema';
import defaultRawData from '../../saint-junien-25-questions.json';

let cachedPack: ValidatedContentPack | null = null;

/**
 * Charge et valide le pack de contenu officiel avec Zod.
 */
export function loadContentPack(): ValidatedContentPack {
  if (cachedPack) {
    return cachedPack;
  }

  const result = ContentPackSchema.safeParse(defaultRawData);
  if (!result.success) {
    console.error('Erreur de validation du pack de contenu :', result.error.format());
    throw new Error(
      `Pack de contenu invalide : ${result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`
    );
  }

  cachedPack = result.data;
  return cachedPack;
}
