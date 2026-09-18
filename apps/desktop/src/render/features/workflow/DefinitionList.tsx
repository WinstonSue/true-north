import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Input, Modal, Select, Table, Tag, message } from '@sue/design-web-react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { EmptyState, FilterBar } from '@true-north/plugin-ui';
import { WorkflowController } from '@true-north/web-service';
import type { WorkflowDefinitionGraph } from '@true-north/plugin-contract';
import { Plus } from 'lucide-react';
import useLocale from '@/utils/useLocale';
import styles from './style.module.less';

type Row = {
  id: string;
  title: string;
  status: string;
  currentVersion?: number;
  sourceTemplateKey?: string;
};

function statusColor(status: string) {
  if (status === 'published') return 'success';
  if (status === 'draft') return 'default';
  return 'processing';
}

export function DefinitionList() {
  const t = useLocale();
  const navigate = useNavigate();
  const [list, setList] = useState<Row[]>([]);
  const [keyword, setKeyword] = useState('');
  const [templates, setTemplates] = useState<Array<{ contributionId: string; nameKey: string; graph: WorkflowDefinitionGraph }>>([]);
  const [templateKey, setTemplateKey] = useState<string>();

  async function refresh() {
    const result = await WorkflowController.definitions();
    setList((result?.list || []) as Row[]);
  }

  useEffect(() => {
    void refresh();
    void WorkflowController.catalog().then((catalog) => {
      const next = (catalog.templates || []) as Array<{ contributionId: string; nameKey: string; graph: WorkflowDefinitionGraph }>;
      setTemplates(next);
      setTemplateKey(next[0]?.contributionId);
    });
  }, []);

  const visible = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) return list;
    return list.filter((row) => {
      const title = t[row.title] || row.title;
      return title.toLowerCase().includes(query) || row.status.toLowerCase().includes(query);
    });
  }, [keyword, list, t]);

  function fromTemplate() {
    Modal.confirm({
      title: t['workflow.definitions.fromTemplate'] || '从模板创建',
      content: (
        <Select
          className="w-full"
          value={templateKey}
          onChange={(value) => setTemplateKey(value)}
          options={templates.map((item) => ({
            label: t[item.nameKey] || item.nameKey,
            value: item.contributionId,
          }))}
        />
      ),
      onOk: async () => {
        const template = templates.find((item) => item.contributionId === (templateKey || templates[0]?.contributionId));
        if (!template) return;
        const created = await WorkflowController.createDefinition({
          title: t[template.nameKey] || template.nameKey,
          graph: template.graph,
          sourceTemplateKey: template.contributionId,
        });
        message.success(t['workflow.definitions.fromTemplate.success'] || '已从模板创建草稿');
        navigate(`/workflow/definitions/${created.id}`);
      },
    });
  }

  return (
    <ProductSurface id={productRef('workflow.view.definitions')}>
      <Flex vertical container="full" className={styles.page}>
        <FilterBar
          extra={
            <Flex gap={8}>
              <Button onClick={fromTemplate}>{t['workflow.definitions.fromTemplate'] || '从模板创建'}</Button>
              <Button type="primary" icon={<Plus size={14} />} onClick={() => navigate('/workflow/definitions/new')}>
                {t['workflow.definitions.create'] || '新建'}
              </Button>
            </Flex>
          }
        >
          <Input
            allowClear
            style={{ width: 240 }}
            placeholder={t['workflow.definitions.search'] || '搜索流程'}
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </FilterBar>
        <Flex vertical container="fill" className={styles.body}>
          {!visible.length ? (
            <EmptyState
              description={
                keyword.trim()
                  ? t['workflow.definitions.emptySearch'] || '没有匹配的流程'
                  : t['workflow.definitions.empty'] || '还没有流程定义'
              }
            />
          ) : (
            <Table
              className={styles.table}
              rowKey="id"
              dataSource={visible}
              pagination={false}
              columns={[
                {
                  title: t['workflow.definitions.name'] || '名称',
                  dataIndex: 'title',
                  ellipsis: true,
                  render: (title: string) => t[title] || title,
                },
                {
                  title: t['workflow.definitions.status'] || '状态',
                  dataIndex: 'status',
                  width: 120,
                  render: (status: string) => (
                    <Tag color={statusColor(status)}>
                      {t[`workflow.status.${status}`] || status}
                    </Tag>
                  ),
                },
                {
                  title: t['workflow.definitions.version'] || '版本',
                  dataIndex: 'currentVersion',
                  width: 88,
                  render: (value) => value || '-',
                },
                {
                  title: t['workflow.definitions.actions'] || '操作',
                  width: 168,
                  render: (_, record) => (
                    <Flex gap={8}>
                      <Button type="link" onClick={() => navigate(`/workflow/definitions/${record.id}`)}>
                        {t['workflow.definitions.edit'] || '编辑'}
                      </Button>
                      <Button
                        type="link"
                        onClick={async () => {
                          const item = await WorkflowController.definition(record.id);
                          const created = await WorkflowController.createDefinition({
                            title: `${t[record.title] || record.title} ${t['workflow.definitions.copySuffix'] || '副本'}`,
                            graph: item.graph,
                          });
                          message.success(t['workflow.definitions.copied'] || '已复制为我的流程');
                          navigate(`/workflow/definitions/${created.id}`);
                        }}
                      >
                        {t['workflow.definitions.copy'] || '复制'}
                      </Button>
                    </Flex>
                  ),
                },
              ]}
            />
          )}
        </Flex>
      </Flex>
    </ProductSurface>
  );
}
