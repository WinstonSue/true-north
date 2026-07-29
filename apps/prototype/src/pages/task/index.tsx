import { Alert, Button, Card, Col, Flex, Row, Select, Table, Tabs, Tag } from '@sue/design-web-react';
import { Plus } from 'lucide-react';
import { PageHeader } from '../../shared/components';
import { productRef } from '../../product-wiki';
import type { DrawerState, Goal, Task, TaskStatus, Todo } from '../../shared/types';
import { goalName, statusLabel } from '../../shared/utils';
import styles from './index.module.css';

type Props = {
  tasks: Task[];
  goals: Goal[];
  todos: Todo[];
  setDrawer: (drawer: DrawerState) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
};
export function TasksPage({ tasks, goals, todos, setDrawer, updateTask }: Props) {
  const columns = [
    {
      title: '任务',
      dataIndex: 'title',
      render: (title: string, task: Task) => (
        <span data-product-ref={productRef('growth.task.interaction')}>
          <Button type="link" onClick={() => setDrawer({ kind: 'task', id: task.id })}>
            {title}
          </Button>
        </span>
      ),
    },
    {
      title: '关联',
      render: (_: unknown, task: Task) => (
        <span data-product-ref={productRef('growth.task.rule.single-parent')}>
          {goalName(goals, task.goalId || tasks.find((item) => item.id === task.parentId)?.goalId)}
        </span>
      ),
    },
    { title: '排程', dataIndex: 'planned' },
    {
      title: '预估 / 实际',
      render: (_: unknown, task: Task) => (
        <span
          data-product-ref={productRef('growth.track-time.overview')}
        >{`${task.estimated}h / ${task.actual}h`}</span>
      ),
    },
    {
      title: '状态',
      render: (_: unknown, task: Task) => (
        <span data-product-ref={productRef('growth.task.rule.single-parent')}>
          <Select
            size="small"
            value={task.status}
            style={{ width: 100 }}
            options={['todo', 'doing', 'blocked', 'done', 'abandoned'].map((value) => ({
              value,
              label: statusLabel(value),
            }))}
            onChange={(value) => updateTask(task.id, { status: value as TaskStatus })}
          />
        </span>
      ),
    },
  ];
  return (
    <>
      <PageHeader
        productReference={productRef('growth.task.overview')}
        title="任务管理"
        action={
          <span data-product-ref={productRef('growth.task.interaction')}>
            <Button type="primary" icon={<Plus size={15} />} onClick={() => setDrawer({ kind: 'task' })}>
              新建任务
            </Button>
          </span>
        }
      />
      <div data-product-ref={productRef('growth.task.interaction')}>
        <Tabs
          items={[
            {
              key: 'week',
              label: '本周任务',
              children: <div data-product-ref={productRef('growth.task.view.week')}><TaskBoard tasks={tasks} goals={goals} setDrawer={setDrawer} /></div>,
            },
            {
              key: 'all',
              label: '全部任务',
              children: <div data-product-ref={productRef('growth.task.view.all')}><Table rowKey="id" dataSource={tasks} columns={columns} pagination={false} /></div>,
            },
            {
              key: 'calendar',
              label: '月度排程',
              children: (
                <div data-product-ref={productRef('growth.task.view.calendar')}>
                  <Alert type="info" showIcon title={`本月已有 ${tasks.length} 项任务排程，编辑任务可调整计划日期。`} />
                  <Flex className={styles.scheduleList} wrap="wrap" gap={8}>
                    {tasks.map((task) => (
                      <Tag key={task.id} color="blue">
                        {task.planned} · {task.title}
                      </Tag>
                    ))}
                  </Flex>
                </div>
              ),
            },
          ]}
        />
      </div>
      <div data-product-ref={productRef('growth.task.rule.single-parent')}>
        <Card className={styles.sectionRow} title="任务联动">
          <p>
            已关联 {todos.filter((todo) => todo.taskId).length}/{todos.length}{' '}
            项待办；任务完成时可在详情中确认其子任务与待办状态。
          </p>
        </Card>
      </div>
    </>
  );
}
function TaskBoard({
  tasks,
  goals,
  setDrawer,
}: {
  tasks: Task[];
  goals: Goal[];
  setDrawer: (drawer: DrawerState) => void;
}) {
  return (
    <Row gutter={[16, 16]}>
      {(['todo', 'doing', 'blocked', 'done'] as TaskStatus[]).map((status) => (
        <Col xs={24} md={12} xl={6} key={status}>
          <div data-product-ref={productRef('growth.task.rule.single-parent')}>
            <Card size="small" title={statusLabel(status)}>
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <Button
                    type="text"
                    block
                    className={styles.taskListItem}
                    key={task.id}
                    onClick={() => setDrawer({ kind: 'task', id: task.id })}
                  >
                    <b>{task.title}</b>
                    <small>
                      {goalName(goals, task.goalId)} · {task.planned}
                    </small>
                  </Button>
                ))}
            </Card>
          </div>
        </Col>
      ))}
    </Row>
  );
}
