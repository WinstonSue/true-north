'use client';

import {
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
} from 'react';
import {
  TaskVo,
  TaskWithoutRelationsVo,
  TaskPageFilterVo,
} from '@true-north/vo';
import { TaskService } from '@true-north/web-service';
import { createInjectState } from '@/utils/createInjectState';
import { TaskStatus } from '@true-north/enum';

function useSyncState<T>(
  initialValue: T,
): [T, (newValue: T) => void, React.MutableRefObject<T>] {
  const [state, setState] = useState<T>(initialValue);
  const stateRef = useRef<T>(state);

  const setSyncState = (newValue: T) => {
    setState(newValue);
    stateRef.current = newValue;
  };

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  return [state, setSyncState, stateRef];
}

export const [TaskAllProvider, useTaskAllContext] = createInjectState<{
  ContextType: {
    taskList: TaskWithoutRelationsVo[];
    getTaskPage: () => Promise<void>;
    filters: TaskPageFilterVo;
    setFilters: Dispatch<SetStateAction<TaskPageFilterVo>>;
    clearFilters: () => Promise<void>;
  };
}>(() => {
  const [taskList, setTaskList] = useState<TaskWithoutRelationsVo[]>([]);

  const [filters, setFilters, filtersRef] = useSyncState<TaskPageFilterVo>({
    keyword: '',
    importance: undefined,
    urgency: undefined,
    status: undefined,
    startDateStart: undefined,
    startDateEnd: undefined,
    endDateStart: undefined,
    endDateEnd: undefined,
    doneDateStart: undefined,
    doneDateEnd: undefined,
    abandonedDateStart: undefined,
    abandonedDateEnd: undefined,
    pageNum: 1,
    pageSize: 10,
  });

  async function getTaskPage() {
    const { list, total } = await TaskService.page(filtersRef.current);
    setTaskList(list);
  }

  const clearFilters = async () => {
    setFilters({
      keyword: '',
      importance: undefined,
      urgency: undefined,
      status: undefined,
      startDateStart: undefined,
      startDateEnd: undefined,
      endDateStart: undefined,
      endDateEnd: undefined,
      doneDateStart: undefined,
      doneDateEnd: undefined,
      abandonedDateStart: undefined,
      abandonedDateEnd: undefined,
      pageNum: 1,
      pageSize: 10,
    });
    await getTaskPage();
  };

  return { taskList, getTaskPage, filters, setFilters, clearFilters };
});
