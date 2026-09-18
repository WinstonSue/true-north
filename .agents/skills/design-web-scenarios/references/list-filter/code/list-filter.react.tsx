import { useState } from "react";
import { Alert, Button, Empty, Flex, Form, Input, Pagination, Table } from "@sue/design-web-react";

type Row = { id: string; name: string; status: string };

export function ListFilter() {
  const [form] = Form.useForm<{ keyword?: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setRows([]);
      setTotal(0);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Flex vertical container="full">
      <Flex container="fixed">
        <Form
          form={form}
          layout="inline"
          onFinish={() => {
            setCurrent(1);
            void load();
          }}
        >
          <Form.Item name="keyword">
            <Input placeholder="搜索" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
      </Flex>
      <Flex vertical container="fill">
        {error ? (
          <Alert type="error" showIcon message={error} action={<Button onClick={() => void load()}>重试</Button>} />
        ) : !loading && rows.length === 0 ? (
          <Empty description="暂无数据" />
        ) : (
          <Table rowKey="id" loading={loading} dataSource={rows} pagination={false} />
        )}
        <Flex container="fixed">
          <Pagination
            current={current}
            total={total}
            onChange={(page) => {
              setCurrent(page);
              void load();
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
