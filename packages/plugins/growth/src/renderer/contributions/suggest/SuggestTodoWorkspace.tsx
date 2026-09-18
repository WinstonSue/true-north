import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Descriptions, Flex, message, Spin } from '@sue/design-web-react';
import type { CommandResult, WorkbenchToolProps } from '@true-north/plugin-sdk';
import { HOST_WORKFLOW_OPEN_PENDING } from '@true-north/plugin-sdk';
import { useHostActions, useRendererPlatform } from '@true-north/plugin-sdk/renderer';
import { TodoRelatedType } from '@true-north/enum';
import type { TodoVo } from '@true-north/vo';
import { TodoController, type TodoFormData } from '../../../client';
import { TodoCreator, useTodoDetail } from '../../domains/todo/detail';
import { todoFormDataToCreateVo } from '../../domains/todo/detail/context';
import { formatPlanTime, normalizePlanRange } from '../../domains/todo/detail/planTime';
import { IMPORTANCE_MAP, URGENCY_MAP } from '../../shared/constants';
import { emitTodoChanged } from '../../shared/events';
import {
  TODO_COMPLETE_EXPENSE_TEMPLATE_KEY,
  findPublishedDefinitionByTemplateKey,
  listPublishedDefinitions,
  saveTodoAssociation,
} from '../../integrations/workflow-association';
import {
  createdTodoIdFromPayload,
  createdTodoIdFromResult,
  initialFormFromPayload,
  receiptFormFromPayload,
  type SuggestPayload,
} from './suggest-todo-receipt';

function commandInputFromForm(form: TodoFormData) {
  const vo = todoFormDataToCreateVo(form);
  return {
    ...vo,
    workflowDefinitionId: form.workflowDefinitionId,
  };
}

async function loadCreatedTodo(id: string): Promise<TodoVo | undefined> {
  try {
    const found = await TodoController.find(TodoRelatedType.NONE, id);
    if (found?.id) return found;
  } catch {
    // Repeat series live under a different related type.
  }
  try {
    const found = await TodoController.find(TodoRelatedType.IS_REPEAT, id);
    if (found?.id) return found;
  } catch {
    return undefined;
  }
  return undefined;
}

function AdoptedTodoReceipt({ payload }: { payload: SuggestPayload }) {
  const platform = useRendererPlatform();
  const { openEditDrawer } = useTodoDetail();
  const form = useMemo(() => receiptFormFromPayload(payload), [payload]);
  const createdId = createdTodoIdFromPayload(payload);
  const workflowDefinitionId =
    typeof payload.workflowDefinitionId === 'string' ? payload.workflowDefinitionId : undefined;
  const [workflowTitle, setWorkflowTitle] = useState<string>();
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    if (!workflowDefinitionId) {
      setWorkflowTitle(undefined);
      return;
    }
    let cancelled = false;
    void listPublishedDefinitions(platform.ipc)
      .then((list) => {
        if (!cancelled) {
          setWorkflowTitle(list.find((item) => item.id === workflowDefinitionId)?.title);
        }
      })
      .catch(() => {
        if (!cancelled) setWorkflowTitle(undefined);
      });
    return () => {
      cancelled = true;
    };
  }, [platform.ipc, workflowDefinitionId]);

  const [planStart, planEnd] = normalizePlanRange(form.planTimeRange);
  const items = [
    { key: 'name', label: '待办名称', children: form.name || '—' },
    { key: 'planDate', label: '计划日期', children: form.planDate || '—' },
    { key: 'planTime', label: '计划时间', children: formatPlanTime(planStart, planEnd) || '—' },
    ...(form.description
      ? [{ key: 'description', label: '描述', children: form.description }]
      : []),
    ...(form.importance != null
      ? [
          {
            key: 'importance',
            label: '重要程度',
            children: IMPORTANCE_MAP.get(form.importance)?.label || String(form.importance),
          },
        ]
      : []),
    ...(form.urgency != null
      ? [
          {
            key: 'urgency',
            label: '紧急程度',
            children: URGENCY_MAP.get(form.urgency)?.label || String(form.urgency),
          },
        ]
      : []),
    ...(workflowDefinitionId
      ? [
          {
            key: 'workflow',
            label: '完成时发起流程',
            children: workflowTitle || workflowDefinitionId,
          },
        ]
      : []),
  ];

  const openCreated = async () => {
    if (!createdId) return;
    setOpening(true);
    try {
      const todo = await loadCreatedTodo(createdId);
      if (!todo) {
        message.error('未找到待办');
        return;
      }
      openEditDrawer({
        contentProps: {
          todo,
          afterSubmit: async () => {
            emitTodoChanged();
          },
        },
      });
    } finally {
      setOpening(false);
    }
  };

  return (
    <Flex vertical gap="middle">
      <Alert type="success" showIcon title="待办已创建" description="已确认并写入成长待办。" />
      <Descriptions column={1} size="small" items={items} />
      {createdId ? (
        <div>
          <Button type="primary" loading={opening} onClick={() => void openCreated()}>
            查看待办
          </Button>
        </div>
      ) : null}
    </Flex>
  );
}

export function SuggestTodoWorkspace({
  payload,
  actions,
}: WorkbenchToolProps<SuggestPayload>) {
  const hostActions = useHostActions();
  const platform = useRendererPlatform();
  const [workflowDefinitionId, setWorkflowDefinitionId] = useState<string | undefined>(
    typeof payload.workflowDefinitionId === 'string' ? payload.workflowDefinitionId : undefined,
  );
  const [ready, setReady] = useState(
    Boolean(payload.adopted) || typeof payload.workflowDefinitionId === 'string',
  );

  useEffect(() => {
    if (payload.adopted || typeof payload.workflowDefinitionId === 'string') return;
    let cancelled = false;
    void findPublishedDefinitionByTemplateKey(platform.ipc, TODO_COMPLETE_EXPENSE_TEMPLATE_KEY)
      .then((id) => {
        if (!cancelled) {
          setWorkflowDefinitionId(id);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [payload.adopted, payload.workflowDefinitionId, platform.ipc]);

  const initialFormData = useMemo(
    () => initialFormFromPayload(payload, workflowDefinitionId),
    [payload, workflowDefinitionId],
  );

  if (payload.adopted) {
    return <AdoptedTodoReceipt payload={payload} />;
  }
  if (!ready) {
    return <Spin />;
  }

  return (
    <TodoCreator
      initialFormData={initialFormData}
      submitCreate={async (form) => {
        const result = (await actions.adopt({
          pluginId: 'growth',
          localId: 'createTodo',
          input: commandInputFromForm(form),
        })) as CommandResult;
        if (result.status === 'applied' || result.status === 'noop') {
          const createdId = createdTodoIdFromResult(result);
          if (createdId && form.workflowDefinitionId) {
            await saveTodoAssociation(platform.ipc, createdId, String(form.workflowDefinitionId));
          }
          const resource = 'resource' in result ? result.resource : undefined;
          await actions.updatePayload({
            ...payload,
            ...commandInputFromForm(form),
            title: form.name,
            adopted: true,
            ...(resource ? { resource } : {}),
            adoptedAt: new Date().toISOString(),
          });
          message.success('已创建');
          await hostActions.invoke(HOST_WORKFLOW_OPEN_PENDING);
          return { id: createdId };
        }
        message.error('reason' in result ? result.reason : '未能创建');
        return false;
      }}
    />
  );
}
