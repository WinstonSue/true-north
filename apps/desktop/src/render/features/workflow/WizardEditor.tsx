import { Button, Card, Flex, Form, Input, Select } from '@sue/design-web-react';
import type { WorkflowDefinitionNode } from '@true-north/plugin-contract';
import { patchGraph, useDefinitionDraft } from './draft';
import useLocale from '@/utils/useLocale';
import styles from './style.module.less';

export function WizardEditor() {
  const t = useLocale();
  const { draft, setDraft, catalog } = useDefinitionDraft();

  function updateNode(index: number, patch: Partial<WorkflowDefinitionNode>) {
    patchGraph(setDraft, (graph) => ({
      ...graph,
      nodes: graph.nodes.map((node, i) => (i === index ? { ...node, ...patch } : node)),
    }));
  }

  function addNode(kind: WorkflowDefinitionNode['kind']) {
    const key = `n${draft.graph.nodes.length + 1}`;
    const options =
      kind === 'command' ? catalog.commands : kind === 'workspace' ? catalog.workspaces : catalog.events;
    const contributionId = options[0]?.contributionId || '';
    patchGraph(setDraft, (graph) => ({
      ...graph,
      nodes: [...graph.nodes, { key, kind, contributionId }],
      edges:
        graph.nodes.length === 0
          ? [...graph.edges, { key: `e-start-${key}`, from: 'start', to: key }]
          : graph.edges,
    }));
  }

  return (
    <Flex vertical gap={16} className={styles.wizard}>
      <Card size="small" title={t['workflow.editor.basics'] || '基本信息'}>
        <Form layout="vertical">
          <Form.Item label={t['workflow.editor.title'] || '标题'}>
            <Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
          </Form.Item>
          <Form.Item label={t['workflow.editor.startEvent'] || '启动事件'} style={{ marginBottom: 0 }}>
            <Select
              className="w-full"
              value={draft.graph.start.eventContributionId || undefined}
              placeholder={t['workflow.editor.startEvent.placeholder'] || '选择已注册事件'}
              options={catalog.events.map((item) => ({ label: item.contributionId, value: item.contributionId }))}
              onChange={(value) =>
                patchGraph(setDraft, (graph) => ({ ...graph, start: { ...graph.start, eventContributionId: value } }))
              }
            />
          </Form.Item>
        </Form>
      </Card>

      <Card size="small" title={t['workflow.editor.steps'] || '步骤'}>
        <Flex vertical gap={12}>
          <Flex gap={8}>
            <Button type="dashed" style={{ alignSelf: 'flex-start' }} onClick={() => addNode('workspace')}>
              {t['workflow.editor.addWorkspace'] || '添加确认工作台'}
            </Button>
            <Button type="dashed" style={{ alignSelf: 'flex-start' }} onClick={() => addNode('command')}>
              {t['workflow.editor.addCommand'] || '添加命令'}
            </Button>
          </Flex>
          {draft.graph.nodes.map((node, index) => (
            <Flex key={node.key} vertical gap={12} className={styles.step}>
              <strong>
                {t['workflow.editor.step'] || '步骤'} {index + 1}
              </strong>
              <Form layout="vertical">
                <Form.Item label={t['workflow.editor.nodeKind'] || '类型'}>
                  <Select
                    className="w-full"
                    value={node.kind}
                    options={[
                      { label: t['workflow.editor.kind.workspace'] || '工作台', value: 'workspace' },
                      { label: t['workflow.editor.kind.command'] || '命令', value: 'command' },
                      { label: t['workflow.editor.kind.interaction'] || '交互', value: 'interaction' },
                    ]}
                    onChange={(kind) => updateNode(index, { kind })}
                  />
                </Form.Item>
                <Form.Item label={t['workflow.editor.capability'] || '能力'} style={{ marginBottom: 0 }}>
                  <Select
                    className="w-full"
                    value={node.contributionId || undefined}
                    options={(node.kind === 'command'
                      ? catalog.commands
                      : node.kind === 'workspace'
                        ? catalog.workspaces
                        : catalog.events
                    ).map((item) => ({ label: item.contributionId, value: item.contributionId }))}
                    onChange={(contributionId) => updateNode(index, { contributionId })}
                  />
                </Form.Item>
              </Form>
            </Flex>
          ))}
        </Flex>
      </Card>

      <Card size="small" title={t['workflow.editor.bindings'] || '字段映射'}>
        <Flex vertical gap={12}>
          {draft.graph.bindings.map((binding, index) => (
            <Flex key={`${binding.from}-${binding.to}-${index}`} gap={12} align="end">
              <Form.Item label={t['workflow.editor.binding.from'] || '来源'} style={{ flex: 1, marginBottom: 0 }}>
                <Input
                  value={binding.from}
                  onChange={(event) =>
                    patchGraph(setDraft, (graph) => ({
                      ...graph,
                      bindings: graph.bindings.map((item, i) => (i === index ? { ...item, from: event.target.value } : item)),
                    }))
                  }
                />
              </Form.Item>
              <span className={styles.muted}>→</span>
              <Form.Item label={t['workflow.editor.binding.to'] || '目标'} style={{ flex: 1, marginBottom: 0 }}>
                <Input
                  value={binding.to}
                  onChange={(event) =>
                    patchGraph(setDraft, (graph) => ({
                      ...graph,
                      bindings: graph.bindings.map((item, i) => (i === index ? { ...item, to: event.target.value } : item)),
                    }))
                  }
                />
              </Form.Item>
            </Flex>
          ))}
          <Button
            type="dashed"
            style={{ alignSelf: 'flex-start' }}
            onClick={() =>
              patchGraph(setDraft, (graph) => ({
                ...graph,
                bindings: [...graph.bindings, { from: 'event.payload.title', to: 'confirm.input.title' }],
              }))
            }
          >
            {t['workflow.editor.addBinding'] || '添加字段映射'}
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
}
