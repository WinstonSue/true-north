import { useMemo } from 'react';
import { GoalType, Importance } from '@true-north/enum';
import { IMPORTANCE_MAP } from '../../constants';
import { GoalFormData } from '@true-north/web-service';
import { GoalVo } from '@true-north/vo';

export const useGoalFormConstraints = (parentGoal: GoalVo) => {
  const allowedDateRange = useMemo(() => {
    if (!parentGoal) {
      return null;
    }

    return parentGoal.startAt && parentGoal.endAt
      ? [parentGoal.startAt, parentGoal.endAt]
      : null;
  }, [parentGoal]);

  const allowedTypes = useMemo(() => {
    if (!parentGoal) {
      return [GoalType.OBJECTIVE, GoalType.KEY_RESULT];
    }

    return parentGoal.type === GoalType.KEY_RESULT
      ? [GoalType.KEY_RESULT]
      : [GoalType.OBJECTIVE, GoalType.KEY_RESULT];
  }, [parentGoal]);

  const allowedImportance = useMemo(() => {
    if (!parentGoal) {
      return [...IMPORTANCE_MAP.keys()];
    }

    // 2. 重要程度约束：子目标重要程度不能低于父目标
    const parentImportanceLevel = Object.values(Importance).indexOf(
      parentGoal.importance,
    );

    return [...IMPORTANCE_MAP.keys()].filter((importance) => {
      const currentLevel = Object.values(Importance).indexOf(importance);
      return currentLevel <= parentImportanceLevel; // 数值越小，重要程度越高
    });
  }, [parentGoal]);

  function updateByConstraints(goalFormData: GoalFormData) {
    const updates: Partial<typeof goalFormData> = {};

    // 检查父目标是否为成果指标
    if (parentGoal.startAt && parentGoal.endAt) {
      if (
        goalFormData.planTimeRange[0] < parentGoal.startAt ||
        goalFormData.planTimeRange[1] > parentGoal.endAt
      ) {
        updates.planTimeRange = [undefined, undefined];
      }
    }

    // 检查目标类型是否符合约束
    if (
      parentGoal.type === GoalType.KEY_RESULT &&
      goalFormData.type !== GoalType.KEY_RESULT
    ) {
      updates.type = GoalType.KEY_RESULT;
    }

    // 检查重要程度是否符合约束（子目标重要程度不能低于父目标）
    const parentImportanceLevel = Object.values(Importance).indexOf(
      parentGoal.importance,
    );

    const currentImportanceLevel = Object.values(Importance).indexOf(
      goalFormData.importance,
    );

    if (currentImportanceLevel > parentImportanceLevel) {
      updates.importance = parentGoal.importance;
    }

    return updates;
  }

  return {
    allowedDateRange,
    allowedTypes,
    allowedImportance,
    updateByConstraints,
  };
};
