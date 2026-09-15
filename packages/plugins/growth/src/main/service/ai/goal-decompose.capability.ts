import { randomUUID } from 'crypto';
import { z } from 'zod';
import { AiSuggestionKind } from '@true-north/enum';
import type { GoalDecomposeRequestVo, GoalDecomposeResponseVo } from '@true-north/vo';
import { AiPlatformError } from '@true-north/plugin-sdk';
import { GoalDecomposeKey } from '../../../contract';
import { growthCache } from '../../context';
import { goalContextBuilder } from './goal-context.builder';
import { normalizeDecomposeSuggestions, refreshDecomposeConflicts } from './decompose-normalize';

const TOTAL_CAP = 8;
const PER_KIND_CAP = 2;
const REF_TYPE = 'goal';
const ALLOWED_KINDS = new Set(['goal', 'task', 'todo', 'habit', ...Object.values(AiSuggestionKind)]);

const suggestionDraftSchema = z.object({
  kind: z.enum(['goal', 'task', 'todo', 'habit']),
  title: z.string(),
  reason: z.string().optional(),
  impact: z.string().optional(),
  planned: z.string().optional(),
  importance: z.coerce.number().optional(),
  difficulty: z.coerce.number().optional(),
});

export class GoalDecomposeCapability {
  readonly key = GoalDecomposeKey;

  async execute(input: GoalDecomposeRequestVo): Promise<GoalDecomposeResponseVo> {
    const context = await goalContextBuilder.build(input.goalId);
    const contextFingerprint = growthCache().fingerprintPromptContext(context.promptContext);

    const hasDrafts = Array.isArray(input.suggestions) && input.suggestions.length > 0;
    if (!hasDrafts) {
      const cached = await growthCache().findMatching<GoalDecomposeResponseVo>({
        capabilityKey: this.key,
        refType: REF_TYPE,
        refId: input.goalId,
        contextFingerprint,
      });
      if (cached) {
        return {
          runId: cached.runId,
          analysisSummary: cached.analysisSummary,
          suggestions: refreshDecomposeConflicts(cached.suggestions, context.bounds, context.childGoalTitles, 'goal'),
        };
      }
      throw AiPlatformError.invalidModelOutput(
        '必须传入 suggestions。请先调用 get_goal 读取上下文，再按 schema 与 Constraints 生成建议后重试。'
      );
    }

    const parsedDrafts = z.array(suggestionDraftSchema).safeParse(input.suggestions);
    if (!parsedDrafts.success) {
      throw AiPlatformError.invalidModelOutput(
        'suggestions 格式无效。每条需含 kind（goal|task|todo|habit）与 title；总量最多 8、每类最多 2。'
      );
    }

    const runId = randomUUID();
    const suggestions = normalizeDecomposeSuggestions({
      drafts: parsedDrafts.data,
      runId,
      bounds: context.bounds,
      childTitles: context.childGoalTitles,
      scope: 'goal',
      allowedKinds: ALLOWED_KINDS,
      totalCap: TOTAL_CAP,
      perKindCap: PER_KIND_CAP,
      defaultReason: '基于当前目标上下文生成。',
      defaultImpact: '有助于推进目标落地。',
    });
    if (!suggestions.length) {
      throw AiPlatformError.invalidModelOutput(
        '没有合法建议。请传入至少一条含 kind 与非空 title 的建议（goal|task|todo|habit），并遵守当前目标边界。'
      );
    }

    const response: GoalDecomposeResponseVo = {
      runId,
      analysisSummary:
        input.analysisSummary?.trim() || `基于目标「${context.goalName}」生成 ${suggestions.length} 条建议。`,
      suggestions,
    };

    await growthCache().upsert({
      capabilityKey: this.key,
      refType: REF_TYPE,
      refId: input.goalId,
      contextFingerprint,
      response,
    });

    return response;
  }
}

export const goalDecomposeCapability = new GoalDecomposeCapability();
