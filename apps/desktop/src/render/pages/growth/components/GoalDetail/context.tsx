'use client';

import { useState, useEffect, Dispatch, useRef, useCallback } from 'react';
import { GoalVo } from '@true-north/vo';
import {
  GoalFormData,
  GoalService,
  GoalMapping,
} from '@true-north/web-service';
import { createInjectState } from '@/utils/createInjectState';
import { GoalType, GoalStatus, Importance, Difficulty } from '@true-north/enum';

export type GoalDetailContextProps = {
  goalId?: string;
  children: React.ReactNode;
  initialFormData?: Partial<GoalFormData>;
  size?: 'small' | 'default';
  readonly?: boolean;
  onClose?: () => Promise<void>;
  afterSubmit?: () => Promise<void>;
};

export const [GoalDetailProvider, useGoalDetailContext] = createInjectState<{
  PropsType: GoalDetailContextProps;
  ContextType: {
    currentGoal: GoalVo;
    goalFormData: GoalFormData;
    initialFormData: GoalFormData;
    size: 'small' | 'default';
    readonly?: boolean;
    setGoalFormData: Dispatch<React.SetStateAction<GoalFormData>>;
    onSubmit: () => Promise<void>;
    onClose?: () => Promise<void>;
    refreshGoalDetail: (id: string) => Promise<void>;
  };
}>((props) => {
  const [currentGoal, setCurrentGoal] = useState<GoalVo>();

  const [initialFormData, setInitialFormData] = useState<GoalFormData>({
    name: '',
    type: props.initialFormData?.type || GoalType.KEY_RESULT,
    status: props.initialFormData?.status || GoalStatus.TODO,
    importance: props.initialFormData?.importance || Importance.Core,
    difficulty: props.initialFormData?.difficulty || Difficulty.Challenger,
    planTimeRange: [undefined, undefined],
    children: [],
    ...props.initialFormData,
  });

  const [goalFormData, setGoalFormData] =
    useState<GoalFormData>(initialFormData);

  const refreshGoalDetail = useCallback(
    async (id: string) => {
      const goal = await GoalService.find(id);
      setCurrentGoal(goal);
    },
    [setCurrentGoal],
  );

  const onSubmit = async () => {
    await props.afterSubmit?.();
  };

  useEffect(() => {
    if (currentGoal?.id) {
      setInitialFormData(GoalMapping.voToGoalFormData(currentGoal));
    }
  }, [currentGoal, setInitialFormData]);

  return {
    currentGoal,
    goalFormData,
    initialFormData,
    size: props.size || 'default',
    readonly: props.readonly,
    setGoalFormData,
    onSubmit,
    refreshGoalDetail,
    onClose: props.onClose,
  };
});
