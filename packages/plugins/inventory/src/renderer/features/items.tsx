import { Button, Flex, Form, Input, InputNumber, Modal, Select, message } from '@sue/design-web-react';
import { useEffect, useState } from 'react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import type { CreateInventoryItemVo, InventoryItemVo, InventoryLocationVo } from '@true-north/vo';
import { InventoryController } from '../../client';

export default function ItemsFeature() {
  const [list, setList] = useState<InventoryItemVo[]>([]);
  const [locations, setLocations] = useState<InventoryLocationVo[]>([]);
  const [open, setOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState<InventoryItemVo | null>(null);
  const [form] = Form.useForm<CreateInventoryItemVo>();
  const [moveForm] = Form.useForm<{ type: 'inbound' | 'outbound' | 'adjust'; quantity?: number; targetQuantity?: number; locationId?: string; note?: string }>();

  const load = async () => {
    const [items, locs] = await Promise.all([InventoryController.listItems(), InventoryController.listLocations()]);
    setList(items?.list || []);
    setLocations(locs?.list || []);
  };

  useEffect(() => {
    void load();
  }, []);

  const submit = async () => {
    const values = await form.validateFields();
    await InventoryController.createItem(values);
    message.success('已保存物资');
    setOpen(false);
    form.resetFields();
    await load();
  };

  const move = async () => {
    if (!moveOpen) return;
    const values = await moveForm.validateFields();
    if (values.type === 'inbound') await InventoryController.inbound({ itemId: moveOpen.id, ...values });
    else if (values.type === 'outbound') await InventoryController.outbound({ itemId: moveOpen.id, ...values });
    else await InventoryController.adjust({ itemId: moveOpen.id, ...values });
    message.success('已记录库存变动');
    setMoveOpen(null);
    moveForm.resetFields();
    await load();
  };

  return (
    <ProductSurface id={productRef('inventory.view.items')}>
      <Flex vertical container="full" className="p-5 gap-4">
        <Flex justify="space-between" align="center">
          <h1 className="text-title-2 font-medium">物资</h1>
          <Button type="primary" onClick={() => setOpen(true)}>添加物资</Button>
        </Flex>
        <Flex vertical gap={8}>
          {list.map((item) => (
            <Flex key={item.id} justify="space-between" align="center" className="rounded-lg bg-bg-2 p-4">
              <div>
                <strong>{item.name}</strong>
                <p className="text-text-3 text-xs m-0">
                  总量 {item.totalQuantity}
                  {item.unit}
                  {item.minStock != null ? ` · 下限 ${item.minStock}` : ''}
                  {item.targetStock != null ? ` · 目标 ${item.targetStock}` : ''}
                  {item.lowStock ? ' · 低库存' : ''}
                  {item.restockQuantity > 0 ? ` · 建议补 ${item.restockQuantity}` : ''}
                </p>
              </div>
              <Button size="small" onClick={() => setMoveOpen(item)}>
                出入库
              </Button>
            </Flex>
          ))}
          {!list.length ? <p className="text-text-3">还没有物资。只记录可储存的家庭实物。</p> : null}
        </Flex>
        <Modal title="添加物资" open={open} onCancel={() => setOpen(false)} onOk={() => void submit()}>
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="名称" rules={[{ required: true }]}>
              <Input placeholder="例如：滤芯" />
            </Form.Item>
            <Form.Item name="unit" label="单位">
              <Input placeholder="个" />
            </Form.Item>
            <Flex gap={8}>
              <Form.Item name="minStock" label="库存下限">
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item name="targetStock" label="目标量">
                <InputNumber min={0} />
              </Form.Item>
            </Flex>
            <Form.Item name="quantity" label="初始数量">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="locationName" label="位置">
              <Input placeholder="家" />
            </Form.Item>
            <Form.Item name="note" label="备注">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Form>
        </Modal>
        <Modal title={moveOpen ? `变动 ${moveOpen.name}` : '出入库'} open={!!moveOpen} onCancel={() => setMoveOpen(null)} onOk={() => void move()}>
          <Form form={moveForm} layout="vertical" initialValues={{ type: 'inbound' }}>
            <Form.Item name="type" label="类型" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 'inbound', label: '入库' },
                  { value: 'outbound', label: '出库' },
                  { value: 'adjust', label: '盘点' },
                ]}
              />
            </Form.Item>
            <Form.Item name="locationId" label="位置">
              <Select allowClear options={locations.map((location) => ({ value: location.id, label: location.name }))} />
            </Form.Item>
            <Form.Item name="quantity" label="数量（入/出）">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="targetQuantity" label="盘点后数量">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="note" label="备注">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Flex>
    </ProductSurface>
  );
}
