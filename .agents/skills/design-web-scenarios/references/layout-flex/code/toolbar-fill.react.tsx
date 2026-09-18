import { useState } from "react";
import { Flex, Form, Pagination, Table } from "@sue/design-web-react";

type Row = { id: string };

export function ToolbarFillList(props: {
  rows: Row[];
  loading: boolean;
  total: number;
}) {
  const [current, setCurrent] = useState(1);

  return (
    <Flex vertical container="full">
      <Flex container="fixed">
        <Form layout="inline">{/* filters */}</Form>
      </Flex>

      <Flex vertical container="fill">
        <Table rowKey="id" loading={props.loading} dataSource={props.rows} pagination={false} />
        <Flex container="fixed">
          <Pagination current={current} total={props.total} onChange={setCurrent} />
        </Flex>
      </Flex>
    </Flex>
  );
}
