import { Button, Flex, Form, Input, Modal, Select, message } from '@sue/design-web-react';
import { useEffect, useState } from 'react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import type { CreateInventoryLocationVo, InventoryLocationVo } from '@true-north/vo';
import { InventoryController } from '../../client';

export default function LocationsFeature() {
  const [list, setList] = useState<InventoryLocationVo[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<CreateInventoryLocationVo>();

  const load = async () => {
    const result = await InventoryController.listLocations();
    setList(result?.list || []);
  };

  useEffect(() => {
    void load();
  }, []);

  const submit = async () => {
    const values = await form.validateFields();
    await InventoryController.createLocation(values);
    message.success('已保存位置');
    setOpen(false);
    form.resetFields();
    await load();
  };

  return (
    <ProductSurface id={productRef('inventory.view.locations')}>
      <Flex vertical container="full" className="p-5 gap-4">
        <Flex justify="space-between" align="center">
          <h1 className="text-title-2 font-medium">位置</h1>
          <Button type="primary" onClick={() => setOpen(true)}>添加位置</Button>
        </Flex>
        <Flex vertical gap={8}>
          {list.map((location) => (
            <Flex key={location.id} justify="space-between" align="center" className="rounded-lg bg-bg-2 p-4">
              <div>
                <strong>{location.name}</strong>
                {location.note ? <p className="text-text-3 text-xs m-0">{location.note}</p> : null}
              </div>
              <Button
                size="small"
                onClick={() =>
                  InventoryController.deleteLocation(location.id)
                    .then(load)
                    .catch((error) => message.error(error instanceof Error ? error.message : '不能删除'))
                }
              >
                删除
              </Button>
            </Flex>
          ))}
          {!list.length ? <p className="text-text-3">还没有存放位置。例如厨房、储物柜。</p> : null}
        </Flex>
        <Modal title="添加位置" open={open} onCancel={() => setOpen(false)} onOk={() => void submit()}>
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="名称" rules={[{ required: true }]}>
              <Input placeholder="例如：厨房" />
            </Form.Item>
            <Form.Item name="parentId" label="上级位置">
              <Select allowClear options={list.map((location) => ({ value: location.id, label: location.name }))} />
            </Form.Item>
            <Form.Item name="note" label="备注">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Form>
        </Modal>
      </Flex>
    </ProductSurface>
  );
}
