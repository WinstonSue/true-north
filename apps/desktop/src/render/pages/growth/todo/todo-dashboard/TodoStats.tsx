'use client';

import { useMemo } from 'react';
import { Card, Row, Col } from '@sue/design-web-react';

import { useTodoContext } from './context';

export function TodoStats() {
  const { todoList } = useTodoContext();

  const stats = useMemo(() => {
    const total = todoList.length;
    const completed = todoList.filter((todo) => todo.status === 'done').length;
    const pending = total - completed;
    const highPriority = todoList.filter(
      (todo) => todo.importance === 1 && todo.urgency === 1
    ).length;

    return { total, completed, pending, highPriority };
  }, [todoList]);

  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Card className="bg-bg-2 border-border-1">
          <h6 className="text-title-1 font-medium text-text-1">
            Total Tasks
          </h6>
          <span

            className="text-text-1" style={{ fontSize: 24, fontWeight: 600 }}>

            {stats.total}
          </span>
        </Card>
      </Col>
      <Col span={6}>
        <Card className="bg-bg-2 border-border-1">
          <h6 className="text-title-1 font-medium text-text-1">
            Completed
          </h6>
          <span

            className="text-success" style={{ fontSize: 24, fontWeight: 600 }}>

            {stats.completed}
          </span>
        </Card>
      </Col>
      <Col span={6}>
        <Card className="bg-bg-2 border-border-1">
          <h6 className="text-title-1 font-medium text-text-1">
            Pending
          </h6>
          <span

            className="text-warning" style={{ fontSize: 24, fontWeight: 600 }}>

            {stats.pending}
          </span>
        </Card>
      </Col>
      <Col span={6}>
        <Card className="bg-bg-2 border-border-1">
          <h6 className="text-title-1 font-medium text-text-1">
            High Priority
          </h6>
          <span

            className="text-danger" style={{ fontSize: 24, fontWeight: 600 }}>

            {stats.highPriority}
          </span>
        </Card>
      </Col>
    </Row>);

}