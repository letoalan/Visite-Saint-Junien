import { z } from 'zod';

export const ContentOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1)
});

export const ContentQuestionSchema = z
  .object({
    id: z.string().min(1),
    prompt: z.string().min(1),
    options: z.array(ContentOptionSchema).length(5),
    correctOptionId: z.string().min(1),
    feedback: z.string().min(1),
    sourceIds: z.array(z.string().min(1))
  })
  .refine(
    (q) => q.options.some((opt) => opt.id === q.correctOptionId),
    (q) => ({
      message: `correctOptionId '${q.correctOptionId}' introuvable dans les options de la question '${q.id}'`
    })
  )
  .refine(
    (q) => new Set(q.options.map((o) => o.id)).size === 5,
    (q) => ({
      message: `IDs d'options non uniques dans la question '${q.id}'`
    })
  );

export const ContentStageSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  keyword: z.string().min(1),
  questions: z.array(ContentQuestionSchema).length(5)
});

export const ContentPackSchema = z
  .object({
    schemaVersion: z.number().int().min(1),
    contentVersion: z.string().min(1),
    id: z.string().min(1),
    title: z.string().min(1),
    sources: z.record(z.string(), z.string().url()),
    stages: z.array(ContentStageSchema).length(5)
  })
  .refine(
    (pack) => new Set(pack.stages.map((s) => s.id)).size === 5,
    { message: "Les IDs d'étapes doivent être uniques et au nombre de 5" }
  );

export type ValidatedContentPack = z.infer<typeof ContentPackSchema>;
