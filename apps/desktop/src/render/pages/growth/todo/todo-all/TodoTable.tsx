import type { TableColumnProps } from '@sue/design-web-react';
import { Table, Button } from '@sue/design-web-react';
import dayjs from 'dayjs';
import { URGENCY_MAP, IMPORTANCE_MAP } from '../../constants';
import { useTodoAllContext } from './context';
import { TodoService } from '@true-north/web-service';
import { openModal } from '@/hooks/OpenModal';
import { TodoEditor } from '../../components';
import { TodoRelatedType, TodoStatus } from '@true-north/enum';

import { TodoVo } from '@true-north/vo';
import { emitTodoChanged } from '../../events';
import { formatTodoPlanTime, isTodoPlanRange } from '../../components/TodoDetail/planTime';
import { useFocusTimer } from '../../focus-timer';

export default function TodoTable(props: {
  selectedRowKeys: string[];
  onSelectionChange: (keys: string[]) => void;
}) {
  const { todoList, getTodoPage } = useTodoAllContext();
  const { open: openFocusTimer } = useFocusTimer();

  const columns: TableColumnProps<TodoVo>[] = [
    { title: '待办', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => {
        switch (record.status) {
          case TodoStatus.DONE:
            return (
              <div className="text-success">
                已完成({dayjs(record.doneAt).format('YY-MM-DD HH:mm')})
              </div>
            );
          case TodoStatus.TODO:
            return <div className="text-warning">未完成</div>;
          case TodoStatus.ABANDONED:
            return (
              <div className="text-danger">
                已放弃({dayjs(record.abandonedAt).format('YY-MM-DD HH:mm')})
              </div>
            );
          default:
            return '--';
        }
      },
    },
    {
      title: '计划日期',
      key: 'planDate',
      render: (_, record) => {
        const planTime = formatTodoPlanTime(record.planStartTime, record.planEndTime);
        return (
          <div>
            {dayjs(record.planDate).format('YYYY-MM-DD')}
            {planTime ? ` ${planTime}` : ''}
          </div>
        );
      },
    },
    {
      title: '紧急程度',
      key: 'urgency',
      render: (_, record) => (
        <div>{URGENCY_MAP.get(record.urgency)?.label || '--'}</div>
      ),
    },
    {
      title: '重要程度',
      key: 'importance',
      render: (_, record) => (
        <div>{IMPORTANCE_MAP.get(record.importance)?.label || '--'}</div>
      ),
    },
    {
      title: <span className="text-text-1 font-medium px-4">操作</span>,
      key: 'action',
      render: (_, record) => {
        const relatedType = record.relatedType || TodoRelatedType.NONE;
        const isActive = record.status === TodoStatus.TODO;
        return (
          <div>
            <Button
              type="text"
              onClick={() => {
                openModal({
                  title: <div className="text-body-3">编辑</div>,
                  content: (
                    <div className="ml-[-6px]">
                      <TodoEditor
                        todo={record}
                        onClose={null}
                        afterSubmit={async () => {
                          await getTodoPage();
                        }}
                      />
                    </div>
                  ),
                  onCancel: () => {
                    getTodoPage();
                  },
                });
              }}
            >
              编辑
            </Button>
            {isActive && isTodoPlanRange(record.planStartTime, record.planEndTime) && (
              <Button
                type="text"
                onClick={() => openFocusTimer({ todoId: record.id, label: record.name })}
              >
                开始专注
              </Button>
            )}
            {isActive && (
              <>
                <Button
                  type="text"
                  onClick={async () => {
                    await TodoService.done(relatedType, record.id);
                    emitTodoChanged();
                    await getTodoPage();
                  }}
                >
                  完成
                </Button>
                <Button
                  type="text"
                  onClick={async () => {
                    await TodoService.abandon(relatedType, record.id);
                    emitTodoChanged();
                    await getTodoPage();
                  }}
                >
                  放弃
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Table
        className="w-full"
        // @ts-expect-error design-web Table generics currently mismatch ColumnProps<TodoVo>
        columns={columns}
        data={todoList as any}
        pagination={false}
        rowKey="id"
        rowSelection={{
          selectedRowKeys: props.selectedRowKeys,
          onChange: (keys: React.Key[]) => props.onSelectionChange(keys.map(String)),
          getCheckboxProps: (record: TodoVo) => ({
            disabled: record.status !== TodoStatus.TODO,
          }),
        }}
      />
  );
}
