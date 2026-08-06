'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TodoFormData, TodoService } from '@true-north/web-service';
import { createInjectState } from '@/utils/createInjectState';
import { TodoVo, TodoWithoutRelationsVo } from '@true-north/vo';
import dayjs from 'dayjs';
import { TodoMapping } from '@true-north/web-service';
import { TodoStatus, TodoRelatedType } from '@true-north/enum';
import { CreateTodoVo } from '@true-north/vo';
import { emitTodoChanged } from '../../events';

export type TodoDetailProviderProps = {
  children: React.ReactNode;
  todo?: TodoVo | TodoWithoutRelationsVo;
  initialFormData?: Partial<TodoFormData>;
  mode: 'editor' | 'creator';
  size?: 'small' | 'default';
  afterSubmit?: () => Promise<void>;
};

export type CurrentTodo = {
  id: string;
  planDate: string;
  planStartTime?: string;
  planEndTime?: string;
  repeatConfig?: TodoVo['repeatConfig'];
  importance?: number;
  urgency?: number;
  tags?: string[];
  description?: string;
  name: string;
  status: TodoStatus;
  relatedType: TodoRelatedType;
};

function toTextValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function toOptionalTextValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export const [TodoDetailProvider, useTodoDetailContext] = createInjectState<{
  PropsType: TodoDetailProviderProps;
  ContextType: {
    currentTodo: CurrentTodo;
    todoFormData: TodoFormData;
    setTodoFormData: (formData: Partial<TodoFormData>) => void;
    onSubmit: () => Promise<boolean>;
  };
}>((props) => {
  const [currentTodo, setCurrentTodo] = useState<CurrentTodo>(props.todo);

  const defaultFormData = {
    name: '',
    planDate: dayjs().format('YYYY-MM-DD'),
    ...props.initialFormData,
  };

  const [todoFormData, setTodoFormData] =
    useState<TodoFormData>(defaultFormData);

  const todoFormDataRef = useRef<TodoFormData>(todoFormData);

  const refreshTodoDetail = async (
    id: string,
    _todo: TodoVo | TodoWithoutRelationsVo,
  ) => {
    const todo = await TodoService.find(_todo.relatedType, id);
    setCurrentTodo(todo);
    todoFormDataRef.current = TodoMapping.voToFormData(todo);
    setTodoFormData(todoFormDataRef.current);
  };

  const initTodoFormData = useCallback(async () => {
    await refreshTodoDetail(props.todo.id, props.todo);
  }, [props.todo]);

  useEffect(() => {
    async function init() {
      if (props.mode === 'editor') {
        await initTodoFormData();
      }
    }
    init();
  }, [props.mode, initTodoFormData]);

  async function handleCreate(): Promise<boolean> {
    const form = todoFormDataRef.current;
    const name = toTextValue(form.name).trim();
    if (!name) return false;
    let repeatConfig: CreateTodoVo['repeatConfig'];
    if (form.repeatConfig) {
      repeatConfig = {
        currentDate: dayjs(form.planDate).format('YYYY-MM-DD'),
        repeatStartDate: dayjs(form.planDate).format('YYYY-MM-DD'),
        repeatMode: form.repeatConfig.repeatMode,
        repeatConfig: form.repeatConfig.repeatConfig,
        repeatEndMode: form.repeatConfig.repeatEndMode,
        repeatTimes: form.repeatConfig.repeatTimes,
        repeatEndDate: form.repeatConfig.repeatEndDate,
      };
    }
    try {
      await TodoService.create({
        name,
        planDate: form.planDate,
        importance: form.importance,
        urgency: form.urgency,
        tags: form.tags,
        description: form.description,
        planStartTime: form.planTimeRange?.[0] || undefined,
        planEndTime: form.planTimeRange?.[1] || undefined,
        status: TodoStatus.TODO,
        repeatConfig,
      });
      todoFormDataRef.current = defaultFormData;
      setTodoFormData(todoFormDataRef.current);
      emitTodoChanged();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async function handleUpdate(): Promise<boolean> {
    const name = toTextValue(todoFormDataRef.current.name).trim();
    if (!name) return false;
    const data = TodoMapping.formDataToUpdateVo({
      ...todoFormDataRef.current,
      name,
      description: toOptionalTextValue(todoFormDataRef.current.description),
    });
    try {
      await TodoService.update(currentTodo.relatedType, currentTodo.id, data);
      emitTodoChanged();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  const onSubmit = async (): Promise<boolean> => {
    const succeeded = props.mode === 'creator'
      ? await handleCreate()
      : await handleUpdate();
    if (!succeeded) return false;
    await props.afterSubmit?.();
    return true;
  };

  return {
    currentTodo,
    todoFormData,
    setTodoFormData: (formData: Partial<TodoFormData>) => {
      const normalizedFormData = { ...formData };
      if ('name' in normalizedFormData) {
        normalizedFormData.name = toTextValue(normalizedFormData.name);
      }
      if ('description' in normalizedFormData) {
        normalizedFormData.description = toOptionalTextValue(normalizedFormData.description);
      }
      todoFormDataRef.current = { ...todoFormDataRef.current, ...normalizedFormData };
      setTodoFormData(todoFormDataRef.current);
    },
    onSubmit,
  };
});
