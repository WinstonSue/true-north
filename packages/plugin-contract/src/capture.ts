import { z } from 'zod';

/** 捕获建议状态：草稿、已选、已采纳、已拒绝。 */
export const captureSuggestionStatusSchema = z.enum(['draft', 'selected', 'accepted', 'rejected']);

export type CaptureSuggestionStatus = z.infer<typeof captureSuggestionStatusSchema>;

export const captureSuggestionSchema = z.object({
  id: z.string().min(1),
  /**
   * 捕获类型。清单声明为 local id，运行时为 `{pluginId}.{localId}`。
   * 宿主按 type 找对应 adopter。
   */
  type: z.string().min(1),
  /** 插件自有字段，宿主不解释。 */
  payload: z.record(z.unknown()),
  status: captureSuggestionStatusSchema.default('draft'),
  /** 与已有数据冲突时的说明。 */
  conflict: z.string().optional(),
});

export type CaptureSuggestion = z.infer<typeof captureSuggestionSchema>;

export const capturePayloadSchema = z.object({
  runId: z.string().optional(),
  analysisSummary: z.string(),
  sourceText: z.string().optional(),
  suggestions: z.array(captureSuggestionSchema),
});

export type CapturePayload = z.infer<typeof capturePayloadSchema>;

export const adoptCaptureRequestSchema = z.object({
  messageId: z.string().min(1),
  suggestions: z.array(captureSuggestionSchema),
  sourceText: z.string().optional(),
  analysisSummary: z.string().optional(),
  runId: z.string().optional(),
});

export type AdoptCaptureRequest = z.infer<typeof adoptCaptureRequestSchema>;

/** 把历史扁平字段收成 {@link CaptureSuggestion}。 */
export function normalizeCaptureSuggestion(raw: Record<string, unknown>): CaptureSuggestion {
  const type = typeof raw.type === 'string' && raw.type ? raw.type : String(raw.kind || '');
  const status: CaptureSuggestionStatus = raw.accepted
    ? 'accepted'
    : raw.selected === false
      ? 'draft'
      : raw.status === 'accepted' || raw.status === 'selected' || raw.status === 'rejected' || raw.status === 'draft'
        ? raw.status
        : 'selected';
  const payload =
    raw.payload && typeof raw.payload === 'object' && !Array.isArray(raw.payload)
      ? (raw.payload as Record<string, unknown>)
      : {
          title: raw.title,
          planned: raw.planned,
          amount: raw.amount,
          transactionType: raw.transactionType,
          category: raw.category,
          tags: raw.tags,
          note: raw.note,
          occurredAt: raw.occurredAt,
          quantity: raw.quantity,
          unit: raw.unit,
          neededAt: raw.neededAt,
          url: raw.url,
        };
  return captureSuggestionSchema.parse({
    id: String(raw.id || ''),
    type,
    payload,
    status,
    conflict: typeof raw.conflict === 'string' ? raw.conflict : undefined,
  });
}

/** 采纳后写回 Activity 的实体链接。 */
export type CaptureAdoptedLink = {
  pluginId: string;
  entityType: string;
  entityId: string;
  uri?: string;
  role?: string;
  label?: string;
};

export type CaptureAdopter = {
  type: string;
  adopt(suggestion: CaptureSuggestion): Promise<CaptureAdoptedLink>;
};
