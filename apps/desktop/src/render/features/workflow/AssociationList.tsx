import { useEffect, useState } from 'react';
import { Flex, Table } from '@sue/design-web-react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { EmptyState } from '@true-north/plugin-ui';
import { WorkflowController } from '@true-north/web-service';
import useLocale from '@/utils/useLocale';
import styles from './style.module.less';

export function AssociationList() {
  const t = useLocale();
  const [list, setList] = useState<Array<Record<string, unknown>>>([]);
  useEffect(() => {
    void WorkflowController.associations().then((result) => setList(result?.list || []));
  }, []);
  return (
    <ProductSurface id={productRef('workflow.view.associations')}>
      <Flex vertical container="full" className={styles.page}>
        <Flex vertical container="fill" className={styles.body}>
          {!list.length ? (
            <EmptyState description={t['workflow.associations.empty'] || '还没有对象关联流程'} />
          ) : (
            <Table
              className={styles.table}
              rowKey="id"
              dataSource={list}
              pagination={false}
              columns={[
                { title: t['workflow.associations.plugin'] || '领域', dataIndex: 'ownerPluginId', width: 140 },
                { title: t['workflow.associations.kind'] || '对象', dataIndex: 'ownerKind', width: 120 },
                { title: t['workflow.associations.owner'] || '对象 ID', dataIndex: 'ownerId', ellipsis: true },
                { title: t['workflow.associations.definition'] || '定义', dataIndex: 'definitionId', ellipsis: true },
                { title: t['workflow.associations.policy'] || '版本策略', dataIndex: 'versionPolicy', width: 140 },
              ]}
            />
          )}
        </Flex>
      </Flex>
    </ProductSurface>
  );
}
