import { useState } from "react";
import { Button, Card, Form, Input, Space, message } from "@sue/design-web-react";

type Values = {
  title: string;
  description?: string;
};

export function BasicForm() {
  const [form] = Form.useForm<Values>();
  const [submitting, setSubmitting] = useState(false);

  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 640 }}
        onFinish={async (values) => {
          setSubmitting(true);
          try {
            await Promise.resolve(values);
            message.success("已提交");
            form.resetFields();
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <Form.Item name="title" label="标题" rules={[{ required: true, message: "请输入标题" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="说明">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={submitting}>
            提交
          </Button>
          <Button htmlType="reset">重置</Button>
        </Space>
      </Form>
    </Card>
  );
}
