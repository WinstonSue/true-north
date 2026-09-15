import { AiSuggestionKind } from '@true-north/enum';
import type { AiSuggestionVo } from '@true-north/vo';
import { AiPlatformError } from '@true-north/plugin-sdk';
import {
  DomainRuleError,
  assertDraftAgainstBounds,
  inheritDecomposeFields,
  ruleRetryMessage,
  type DecomposeBounds,
} from '../../../shared/entity-bounds';

export type DecomposeDraftInput = {
  kind?: string;
  title?: string;
  reason?: string;
  impact?: string;
  planned?: string;
  importance?: number;
  difficulty?: number;
};

function normalizeTitle(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function detectTitleConflict(title: string, childTitles: string[], message: string): string | undefined {
  const normalized = normalizeTitle(title);
  if (!normalized) return undefined;
  for (const child of childTitles) {
    const childNorm = normalizeTitle(child);
    if (!childNorm) continue;
    if (normalized === childNorm || normalized.includes(childNorm) || childNorm.includes(normalized)) {
      return message;
    }
  }
  return undefined;
}

export function refreshDecomposeConflicts(
  suggestions: AiSuggestionVo[],
  bounds: DecomposeBounds,
  childTitles: string[],
  scope: 'goal' | 'task',
): AiSuggestionVo[] {
  const titleMessage = scope === 'goal' ? '已存在相近子目标' : '已存在相近子任务';
  const titleKind = scope === 'goal' ? AiSuggestionKind.GOAL : AiSuggestionKind.TASK;
  return suggestions.map((item) => {
    const titleConflict =
      item.kind === titleKind ? detectTitleConflict(item.title, childTitles, titleMessage) : undefined;
    try {
      assertDraftAgainstBounds(item, bounds, scope);
      return { ...item, conflict: titleConflict };
    } catch (error) {
      const ruleConflict = error instanceof DomainRuleError ? `[${error.ruleId}] ${error.message}` : String(error);
      return { ...item, conflict: titleConflict || ruleConflict };
    }
  });
}

export function normalizeDecomposeSuggestions(input: {
  drafts: DecomposeDraftInput[];
  runId: string;
  bounds: DecomposeBounds;
  childTitles: string[];
  scope: 'goal' | 'task';
  allowedKinds: Set<string>;
  totalCap: number;
  perKindCap: number;
  defaultReason: string;
  defaultImpact: string;
}): AiSuggestionVo[] {
  const { drafts, runId, bounds, childTitles, scope, allowedKinds, totalCap, perKindCap } = input;
  const kindCounts: Record<string, number> = {};
  const suggestions: AiSuggestionVo[] = [];
  const titleMessage = scope === 'goal' ? '已存在相近子目标' : '已存在相近子任务';
  const titleKind = scope === 'goal' ? 'goal' : 'task';

  for (const item of drafts) {
    const title = item.title?.trim();
    if (!title) continue;
    if (!item.kind || !allowedKinds.has(item.kind)) continue;

    const kind = item.kind as AiSuggestionKind;
    const count = kindCounts[kind] || 0;
    if (count >= perKindCap) continue;
    if (suggestions.length >= totalCap) break;

    const inherited = inheritDecomposeFields(item, bounds);
    try {
      assertDraftAgainstBounds({ ...item, ...inherited, kind }, bounds, scope);
    } catch (error) {
      if (error instanceof DomainRuleError) {
        throw AiPlatformError.invalidModelOutput(ruleRetryMessage(error));
      }
      throw error;
    }

    kindCounts[kind] = count + 1;
    const conflict =
      kind === titleKind ? detectTitleConflict(title, childTitles, titleMessage) : undefined;
    suggestions.push({
      id: `${runId}-${suggestions.length}`,
      kind,
      title,
      reason: item.reason?.trim() || input.defaultReason,
      impact: item.impact?.trim() || input.defaultImpact,
      planned: inherited.planned,
      importance: inherited.importance,
      difficulty: inherited.difficulty,
      conflict,
    });
  }

  return suggestions;
}
