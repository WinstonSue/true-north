import { useEffect, useState } from 'react';
import { Button, Flex, Modal, Table, Tag, message } from '@sue/design-web-react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { EmptyState } from '@true-north/plugin-ui';
import { WorkflowController } from '@true-north/web-service';
import useLocale from '@/utils/useLocale';
import styles from './style.module.less';

function statusColor(status: string) {
  if (status === 'completed') return 'success';
  if (status === 'rolled_back' || status === 'cancelled') return 'default';
  if (status === 'conflict') return 'error';
  return 'processing';
}

export function RunList() {
  const t = useLocale();
  const [list, setList] = useState<Array<Record<string, unknown>>>([]);

  async function refresh() {
    const result = await WorkflowController.plans();
    setList(result?.list || []);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <ProductSurface id={productRef('workflow.view.runs')}>
      <Flex vertical container="full" className={styles.page}>
        <Flex vertical container="fill" className={styles.body}>
          {!list.length ? (
            <EmptyState description={t['workflow.runs.empty'] || '还没有流程实例'} />
          ) : (
            <Table
              className={styles.table}
              rowKey="id"
              dataSource={list}
              pagination={false}
              columns={[
                { title: t['workflow.runs.id'] || '实例', dataIndex: 'id', ellipsis: true },
                {
                  title: t['workflow.runs.status'] || '状态',
                  dataIndex: 'status',
                  width: 140,
                  render: (status: string) => (
                    <Tag color={statusColor(status)}>{t[`workflow.status.${status}`] || status}</Tag>
                  ),
                },
                { title: t['workflow.runs.definition'] || '定义', dataIndex: 'definitionId', ellipsis: true },
                { title: t['workflow.runs.version'] || '版本', dataIndex: 'definitionVersion', width: 88 },
                {
                  title: t['workflow.runs.actions'] || '操作',
                  width: 168,
                  render: (_, record) => (
                    <Flex gap={8}>
                      <Button
                        type="link"
                        onClick={async () => {
                          const detail = await WorkflowController.plan(String(record.id));
                          Modal.info({
                            title: t['workflow.runs.detail'] || '运行详情',
                            width: 640,
                            content: <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(detail, null, 2)}</pre>,
                          });
                        }}
                      >
                        {t['workflow.runs.detail'] || '详情'}
                      </Button>
                      {record.status !== 'rolled_back' && record.status !== 'cancelled' ? (
                        <Button
                          type="link"
                          danger
                          onClick={() =>
                            Modal.confirm({
                              title: t['workflow.runs.rollback.confirm'] || '确认回滚这个实例？',
                              content: t['workflow.runs.rollback.content'] || '将按发布时的补偿顺序撤销已执行步骤，例如已入账账单会软删除。',
                              onOk: async () => {
                                const result = await WorkflowController.rollbackPlan(String(record.id), { confirmed: true });
                                if (result?.status === 'conflict') {
                                  message.error(String(result.reason || t['workflow.runs.rollback.conflict'] || '回滚冲突，请到问题页处理'));
                                } else {
                                  message.success(t['workflow.runs.rollback.success'] || '已回滚');
                                }
                                await refresh();
                              },
                            })
                          }
                        >
                          {t['workflow.runs.rollback'] || '回滚'}
                        </Button>
                      ) : null}
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
