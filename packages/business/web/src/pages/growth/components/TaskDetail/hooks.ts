import { useMemo } from 'react';
import { Importance } from '@true-north/enum';
import { IMPORTANCE_MAP } from '../../constants';
import { TaskFormData } from '@true-north/web-service';
import { TaskVo, GoalVo } from '@true-north/vo';

export const useTaskFormConstraints = (parentTask: TaskVo | null, parentGoal: GoalVo | null) => {
  const allowedDateRange = useMemo(() => {
    // 优先使用父任务的时间范围，其次是父目标
    const parent = parentTask || parentGoal;
    if (!parent) {
      return null;
    }

    return parent.startAt && parent.endAt
      ? [parent.startAt, parent.endAt]
      : null;
  }, [parentTask, parentGoal]);

  const allowedImportance = useMemo(() => {
    // 优先使用父任务的重要程度，其次是父目标
    const parent = parentTask || parentGoal;
    if (!parent) {
      return [...IMPORTANCE_MAP.keys()];
    }

    // 重要程度约束：子任务重要程度不能高于父任务/目标
    const parentImportanceLevel = Object.values(Importance).indexOf(
      parent.importance,
    );

    return [...IMPORTANCE_MAP.keys()].filter((importance) => {
      const currentLevel = Object.values(Importance).indexOf(importance);
      return currentLevel >= parentImportanceLevel; // 数值越大，重要程度越低
    });
  }, [parentTask, parentGoal]);

  function updateByConstraints(taskFormData: TaskFormData) {
    const parent = parentTask || parentGoal;
    if (!parent) return {};

    const updates: Partial<typeof taskFormData> = {};

    // 检查时间范围约束
    if (parent.startAt && parent.endAt && taskFormData.planTimeRange) {
      const [taskStart, taskEnd] = taskFormData.planTimeRange;
      if (
        (taskStart && taskStart < parent.startAt) ||
        (taskEnd && taskEnd > parent.endAt)
      ) {
        updates.planTimeRange = [undefined, undefined];
      }
    }

    // 检查重要程度是否符合约束
    const parentImportanceLevel = Object.values(Importance).indexOf(
      parent.importance,
    );

    const currentImportanceLevel = Object.values(Importance).indexOf(
      taskFormData.importance,
    );

    if (currentImportanceLevel < parentImportanceLevel) {
      updates.importance = parent.importance;
    }

    return updates;
  }

  return {
    allowedDateRange,
    allowedImportance,
    updateByConstraints,
  };
};
