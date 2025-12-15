import { useState, useCallback } from 'react';
import { GoalVo } from '@true-north/vo';
import { GoalService, TaskService } from '@true-north/web-service';
import { Message } from '@arco-design/web-react';
import { GoalStatus } from '@true-north/enum';
import { createInjectState } from '@true-north/common-web-utils';
import type { Task as TaskVO } from '@true-north/vo';

export const [GoalTreeViewProvider, useGoalTreeViewContext] =
  createInjectState<{
    PropsType: {
      children: React.ReactNode;
    };
    ContextType: {
      loading: boolean;
      goalTree: GoalVo[];
      selectedGoal: GoalVo | null;
      relatedTasks: TaskVO.TaskWithoutRelationsVo[];
      selectedGoalId: string | null;
      setSelectedGoalId: (goalId: string | null) => void;
      fetchGoalTree: () => Promise<void>;
      fetchGoalDetail: (goalId: string) => Promise<void>;
      fetchRelatedTasks: (goalId: string) => Promise<void>;
      refreshData: () => Promise<void>;
    };
  }>(() => {
    const [loading, setLoading] = useState(false);
    const [goalTree, setGoalTree] = useState<GoalVo[]>([]);
    const [selectedGoal, setSelectedGoal] = useState<GoalVo | null>(null);
    const [relatedTasks, setRelatedTasks] = useState<
      TaskVO.TaskWithoutRelationsVo[]
    >([]);

    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

    // 获取目标树数据
    const fetchGoalTree = useCallback(async () => {
      setLoading(true);
      try {
        const data = await GoalService.getTree({
          status: [GoalStatus.TODO, GoalStatus.DOING],
        });
        setGoalTree(data);
      } catch (error) {
        console.error('获取目标数据失败:', error);
        Message.error('获取目标数据失败');
      } finally {
        setLoading(false);
      }
    }, []);

    // 获取关联任务
    const fetchRelatedTasks = useCallback(async (goalId: string) => {
      try {
        const result = await TaskService.findByFilter({
          goalIds: [goalId],
        });
        setRelatedTasks(result?.list || []);
      } catch (error) {
        console.error('获取关联任务失败:', error);
        Message.error('获取关联任务失败');
        setRelatedTasks([]);
      }
    }, []);

    // 获取目标详情
    const fetchGoalDetail = useCallback(
      async (goalId: string) => {
        try {
          const goal = await GoalService.find(goalId);
          setSelectedGoal(goal);
          // 同时获取关联任务
          await fetchRelatedTasks(goalId);
        } catch (error) {
          console.error('获取目标详情失败:', error);
          Message.error('获取目标详情失败');
        }
      },
      [fetchRelatedTasks],
    );

    // 刷新数据
    const refreshData = useCallback(async () => {
      await fetchGoalTree();
      if (selectedGoal) {
        await fetchGoalDetail(selectedGoal.id);
      }
    }, [fetchGoalTree, fetchGoalDetail, selectedGoal]);

    return {
      loading,
      goalTree,
      selectedGoal,
      relatedTasks,
      selectedGoalId,
      setSelectedGoalId,
      fetchGoalTree,
      fetchGoalDetail,
      fetchRelatedTasks,
      refreshData,
    };
  });
