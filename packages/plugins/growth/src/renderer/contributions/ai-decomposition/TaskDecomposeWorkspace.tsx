import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Flex,
  Modal,
  Space,
  Tag,
  message,
} from '@sue/design-web-react';
import type { AiDecomposePayloadVo, AiWorkspacePayloadVo, AiWorkspaceSuggestionVo } from '@true-north/vo';
import { TaskController, TaskService } from '../../../client';
import { Surface } from '@true-north/plugin-ui';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import type { WorkbenchToolProps } from '@true-north/plugin-sdk';
import { DecomposeEditDrawer } from './DecomposeEditDrawer';
import styles from './style.module.less';

const KIND_LABEL = { task: '子任务', todo: '待办' } as const;

type Props = WorkbenchToolProps<AiDecomposePayloadVo>;

export function TaskDecomposeWorkspace({
  payload,
  actions,
}: Props) {
  const [task, setTask] = useState<any>();
  const [suggestions, setSuggestions] = useState<AiWorkspaceSuggestionVo[]>(payload.suggestions);
  const [selected, setSelected] = useState<string[]>([]);
  const [batchOpen, setBatchOpen] = useState(false);
  const [editing, setEditing] = useState<AiWorkspaceSuggestionVo | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSuggestions(payload.suggestions);
    setSelected([]);
    setEditing(null);
  }, [payload]);

  useEffect(() => {
    const ref = payload.ref;
    if (!ref?.id) {
      setTask(undefined);
      return;
    }
    let cancelled = false;
    void TaskService.find(ref.id)
      .then((found) => {
        if (!cancelled) setTask(found?.id ? found : undefined);
      })
      .catch(() => {
        if (!cancelled) setTask(undefined);
      });
    return () => {
      cancelled = true;
    };
  }, [payload]);

  if (!task) {
    return <Alert type="warning" showIcon title="未找到任务，无法审阅拆解建议。" />;
  }

  const persist = async (next: AiWorkspaceSuggestionVo[]) => {
    setSuggestions(next);
    await actions.updatePayload({ ...payload, suggestions: next } as unknown as AiWorkspacePayloadVo);
  };

  const openEdit = (suggestion: AiWorkspaceSuggestionVo) => {
    setEditing(suggestion);
  };

  const markCreated = async (suggestion: AiWorkspaceSuggestionVo) => {
    const next = suggestions.map((item) =>
      item.id === suggestion.id ? { ...item, accepted: true } : item,
    );
    await persist(next);
    setSelected((items) => items.filter((id) => id !== suggestion.id));
    setEditing(null);
  };

  const adopt = async (suggestion: AiWorkspaceSuggestionVo) => {
    if (suggestion.conflict) {
      message.warning('该建议存在重复冲突，请先跳过或调整');
      return;
    }
    if (suggestion.accepted) return;

    const title = suggestion.title.trim();
    if (!title) {
      message.warning('请输入建议名称');
      return;
    }

    await TaskController.adoptDecompose(task.id, suggestion);

    const next = suggestions.map((item) =>
      item.id === suggestion.id ? { ...item, accepted: true } : item
    );
    await persist(next);
    setSelected((items) => items.filter((id) => id !== suggestion.id));
  };

  const askSelected = () => {
    const picked = suggestions.filter(
      (item) => selected.includes(item.id) && !item.accepted && !item.conflict
    );
    if (!picked.length) {
      message.warning('请先勾选可追问的建议');
      return;
    }
    const lines = picked.map((item) => {
      const label = item.kind === 'todo' ? KIND_LABEL.todo : KIND_LABEL.task;
      return `- [${label}] ${item.title}（计划 ${item.planned}，重要 ${item.importance}）`;
    });
    actions.requestFollowUp(`请针对以下建议进一步说明或优化：\n${lines.join('\n')}\n`);
    message.success('已预填到对话输入框，确认后发送');
  };

  return (
    <ProductSurface id={productRef('growth.task.view.ai-decomposition')}>
    <div>
      <Flex vertical gap={16}>
        <Flex className={styles.aiControls} justify="space-between" align="center" wrap="wrap" gap={12}>
          <Tag color="blue">当前任务：{task.name}</Tag>
          <Space wrap>
            <Button disabled={!selected.length} onClick={askSelected}>
              对已选追问 {selected.length || ''}
            </Button>
            <Button disabled={!selected.length} onClick={() => setBatchOpen(true)}>
              采纳已选 {selected.length}
            </Button>
          </Space>
        </Flex>
        <Alert className={styles.aiAlert} type="info" showIcon title={payload.analysisSummary} />
        <Flex vertical className={styles.aiSuggestions} gap={12}>
          {suggestions.map((suggestion) => {
            const isAccepted = Boolean(suggestion.accepted);
            const label = suggestion.kind === 'todo' ? KIND_LABEL.todo : KIND_LABEL.task;
            return (
              <Surface padded key={suggestion.id} className={`${styles.suggestion}${isAccepted ? ` ${styles.accepted}` : ''}`}>
                <Flex justify="space-between" align="start" gap={12}>
                  <Space align="start">
                    <Checkbox
                      checked={selected.includes(suggestion.id)}
                      disabled={Boolean(suggestion.conflict) || isAccepted}
                      onChange={(event) =>
                        setSelected((items) =>
                          event.target.checked
                            ? [...items, suggestion.id]
                            : items.filter((id) => id !== suggestion.id)
                        )
                      }
                    />
                    <div className={isAccepted ? styles.acceptedPreview : undefined}>
                      <Tag color={suggestion.kind === 'todo' ? 'gold' : 'blue'}>{label}</Tag>
                      <h3>{suggestion.title}</h3>
                      <p>{suggestion.reason}</p>
                      <small>
                        {suggestion.impact} · 计划 {suggestion.planned} · 重要 {suggestion.importance}
                      </small>
                      {suggestion.conflict ? (
                        <Alert type="warning" showIcon title={suggestion.conflict} />
                      ) : null}
                    </div>
                  </Space>
                  <Space vertical>
                    <Button size="small" onClick={() => openEdit(suggestion)} disabled={isAccepted}>
                      编辑
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      disabled={Boolean(suggestion.conflict) || isAccepted || saving}
                      onClick={() => {
                        setSaving(true);
                        void adopt(suggestion)
                          .catch((err) => {
                            message.error(err instanceof Error ? err.message : '采纳失败');
                          })
                          .finally(() => setSaving(false));
                      }}
                    >
                      {isAccepted ? '已采纳' : '采纳'}
                    </Button>
                  </Space>
                </Flex>
              </Surface>
            );
          })}
        </Flex>
        <Modal
          title="批量采纳 AI 建议"
          open={batchOpen}
          onCancel={() => setBatchOpen(false)}
          onOk={() => {
            setSaving(true);
            void (async () => {
              try {
                for (const suggestion of suggestions) {
                  if (!selected.includes(suggestion.id) || suggestion.conflict || suggestion.accepted) {
                    continue;
                  }
                  await adopt(suggestion);
                }
                setSelected([]);
                setBatchOpen(false);
                message.success('已采纳所选建议');
              } catch (err) {
                message.error(err instanceof Error ? err.message : '批量采纳失败');
              } finally {
                setSaving(false);
              }
            })();
          }}
          okText="确认创建"
          cancelText="取消"
          confirmLoading={saving}
        >
          <p>将按各条当前预览逐条校验并创建子任务或待办。存在冲突的建议无法被勾选。</p>
        </Modal>
      </Flex>

      <DecomposeEditDrawer
        suggestion={editing}
        source="task"
        parent={task}
        onClose={() => setEditing(null)}
        onCreated={() => (editing ? markCreated(editing) : Promise.resolve())}
      />
    </div>
    </ProductSurface>
  );
}
