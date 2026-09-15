import { randomUUID } from 'crypto';
import { z } from 'zod';
import { AiSuggestionKind, TaskDecomposeKey } from '@true-north/enum';
import type { TaskDecomposeRequestVo, TaskDecomposeResponseVo } from '@true-north/vo';
import { AiPlatformError } from '@true-north/plugin-sdk';
import { growthAi } from '../../context';
import { taskContextBuilder } from './task-context.builder';
import { normalizeDecomposeSuggestions, refreshDecomposeConflicts } from './decompose-normalize';

const TOTAL_CAP = 8;
const PER_KIND_CAP = 2;
const REF_TYPE = 'task';
const ALLOWED_KINDS = new Set([AiSuggestionKind.TASK, AiSuggestionKind.TODO, 'task', 'todo']);

const suggestionDraftSchema = z.object({
  kind: z.enum(['task', 'todo']),
  title: z.string(),
  reason: z.string().optional(),
  impact: z.string().optional(),
  planned: z.string().optional(),
  importance: z.coerce.number().optional(),
  difficulty: z.coerce.number().optional(),
});

export class TaskDecomposeCapability {
  readonly key = TaskDecomposeKey;

  async execute(input: TaskDecomposeRequestVo): Promise<TaskDecomposeResponseVo> {
    const context = await taskContextBuilder.build(input.taskId);
    const contextFingerprint = growthAi().cache.fingerprintPromptContext(context.promptContext);

    const hasDrafts = Array.isArray(input.suggestions) && input.suggestions.length > 0;
    if (!hasDrafts) {
      const cached = await growthAi().cache.findMatching<TaskDecomposeResponseVo>({
        capabilityKey: this.key,
        refType: REF_TYPE,
        refId: input.taskId,
        contextFingerprint,
      });
      if (cached) {
        return {
          runId: cached.runId,
          analysisSummary: cached.analysisSummary,
          suggestions: refreshDecomposeConflicts(cached.suggestions, context.bounds, context.childTaskTitles, 'task'),
        };
      }
      throw AiPlatformError.invalidModelOutput(
        '必须传入 suggestions。请先调用 get_task 读取上下文，再按 schema 与 Constraints 生成子任务/待办建议后重试。'
      );
    }

    const parsedDrafts = z.array(suggestionDraftSchema).safeParse(input.suggestions);
    if (!parsedDrafts.success) {
      throw AiPlatformError.invalidModelOutput(
        'suggestions 格式无效。每条需含 kind（task|todo）与 title；总量最多 8、每类最多 2。不要输出 goal 或 habit。'
      );
    }

    const runId = randomUUID();
    const suggestions = normalizeDecomposeSuggestions({
      drafts: parsedDrafts.data,
      runId,
      bounds: context.bounds,
      childTitles: context.childTaskTitles,
      scope: 'task',
      allowedKinds: ALLOWED_KINDS,
      totalCap: TOTAL_CAP,
      perKindCap: PER_KIND_CAP,
      defaultReason: '基于当前任务上下文生成。',
      defaultImpact: '有助于推进任务落地。',
    });
    if (!suggestions.length) {
      throw AiPlatformError.invalidModelOutput(
        '没有合法建议。请传入至少一条含 kind（task|todo）与非空 title 的建议，并遵守当前任务边界。'
      );
    }

    const response: TaskDecomposeResponseVo = {
      runId,
      analysisSummary:
        input.analysisSummary?.trim() || `基于任务「${context.taskName}」生成 ${suggestions.length} 条建议。`,
      suggestions,
    };

    await growthAi().cache.upsert({
      capabilityKey: this.key,
      refType: REF_TYPE,
      refId: input.taskId,
      contextFingerprint,
      response,
    });

    return response;
  }
}

export const taskDecomposeCapability = new TaskDecomposeCapability();
