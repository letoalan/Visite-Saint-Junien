import { z } from 'zod';

export const QrPayloadSchema = z.object({
  v: z.literal(1),
  cid: z.string().min(1).max(64),
  cv: z.string().min(1).max(16),
  sid: z.string().min(8).max(64),
  stages: z.array(z.number().int().min(0).max(1)).length(5),
  res: z.boolean(),
  ts: z.number().int().positive(),
  chk: z.number().int().nonnegative()
});

export type QrPayload = z.infer<typeof QrPayloadSchema>;

export const RewardQrPayloadSchema = z.object({
  v: z.literal(1),
  sid: z.string().min(4).max(64),
  rid: z.string().min(1).max(64),
  ts: z.number().int().positive(),
  val: z.string().max(128).optional(),
  chk: z.number().int().nonnegative()
});

export type RewardQrPayload = z.infer<typeof RewardQrPayloadSchema>;

