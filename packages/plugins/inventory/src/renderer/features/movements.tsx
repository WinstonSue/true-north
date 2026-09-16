import { Flex } from '@sue/design-web-react';
import { useEffect, useState } from 'react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import type { InventoryMovementVo } from '@true-north/vo';
import { InventoryController } from '../../client';

const TYPE_LABEL: Record<string, string> = {
  inbound: '入库',
  outbound: '出库',
  adjust: '盘点',
};

export default function MovementsFeature() {
  const [list, setList] = useState<InventoryMovementVo[]>([]);

  useEffect(() => {
    void InventoryController.listMovements().then((result) => setList(result?.list || []));
  }, []);

  return (
    <ProductSurface id={productRef('inventory.view.movements')}>
      <Flex vertical container="full" className="p-5 gap-4">
        <h1 className="text-title-2 font-medium">出入库</h1>
        <Flex vertical gap={8}>
          {list.map((row) => (
            <Flex key={row.id} justify="space-between" align="center" className="rounded-lg bg-bg-2 p-4">
              <div>
                <strong>
                  {TYPE_LABEL[row.type] || row.type} · {row.itemName || row.itemId}
                </strong>
                <p className="text-text-3 text-xs m-0">
                  {row.locationName || row.locationId} · {row.beforeQty} → {row.afterQty}
                  {row.note ? ` · ${row.note}` : ''}
                </p>
              </div>
              <span className="text-text-3 text-xs">{row.occurredAt.slice(0, 16).replace('T', ' ')}</span>
            </Flex>
          ))}
          {!list.length ? <p className="text-text-3">还没有入库、出库或盘点记录。</p> : null}
        </Flex>
      </Flex>
    </ProductSurface>
  );
}
