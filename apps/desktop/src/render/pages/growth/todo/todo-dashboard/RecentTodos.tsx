'use client';

import {
  Tag,
  Avatar,
  Flex,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@sue/design-web-react';
import { ExclamationOutlined } from '@ant-design/icons';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { TodoVo } from '@true-north/vo';

interface RecentTodosProps {
  todoList: TodoVo[];
}

export function RecentTodos({ todoList }: RecentTodosProps) {
  // 最近完成的任务（最近7天）
  const recentCompleted = todoList.
  filter((todo) => {
    if (todo.status !== 'done' || !todo.doneAt) return false;
    const doneDate = new Date(todo.doneAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return doneDate >= weekAgo;
  }).
  sort(
    (a, b) => new Date(b.doneAt!).getTime() - new Date(a.doneAt!).getTime()
  ).
  slice(0, 5);

  // 即将到期的任务
  const upcomingTasks = todoList.
  filter((todo) => todo.status === 'todo').
  sort(
    (a, b) => new Date(a.planDate).getTime() - new Date(b.planDate).getTime()
  ).
  slice(0, 5);

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return '今天';
    if (isTomorrow(date)) return '明天';
    if (isPast(date)) return '已逾期';
    return format(date, 'MM/dd');
  };

  const getDateColor = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isPast(date)) return 'red';
    if (isToday(date)) return 'orange';
    if (isTomorrow(date)) return 'blue';
    return 'gray';
  };

  const getPriorityIcon = (importance?: number, urgency?: number) => {
    if (importance === 1 && urgency === 1) {
      return <ExclamationOutlined style={{ color: '#f53f3f' }} />;
    }
    return <ClockCircleOutlined style={{ color: '#86909c' }} />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 最近完成 */}
      <div className="bg-bg-2 rounded-xl p-6 shadow-sm border border-border-1">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-success-light-1 rounded-lg flex items-center justify-center mr-3">
            <div className="w-5 h-5 bg-success rounded"></div>
          </div>
          <div>
            <h5 className="text-title-1 font-medium !mb-0">
              最近完成
            </h5>
            <div className="text-sm text-text-3">最近7天完成的任务</div>
          </div>
        </div>

        {recentCompleted.length === 0 ?
        <div className="text-center py-8">
            <span className="text-text-3 text-text-3">
              暂无最近完成的任务
            </span>
          </div> :

        recentCompleted.map((todo, index) =>
        <div
          key={todo.id}
          className="!px-0"
          style={{
            padding: '12px 0',
            display: 'flex',
            gap: 8,
            borderTop:
            index > 0 ?
            '1px solid var(--color-border-2, #e5e6eb)' :
            undefined
          }}>

              <div style={{ flex: 1, minWidth: 0 }}>
                <Flex gap={12} align="flex-start">
                  <Avatar size={24} style={{ backgroundColor: '#10b981' }}>
                    <CheckCircleOutlined />
                  </Avatar>
                  <Flex vertical gap={4} style={{ minWidth: 0, flex: 1 }}>
                    <span

                  className="truncate text-text-1" style={{ maxWidth: 200 }}>

                      {todo.name}
                    </span>
                    <span

                  className="text-text-3 text-text-3" style={{ fontSize: 12 }}>

                      {format(new Date(todo.doneAt!), 'MM/dd HH:mm')} 完成
                    </span>
                  </Flex>
                </Flex>
              </div>
              {todo.tags && todo.tags.length > 0 &&
          <div className="flex gap-1">
                  {todo.tags.slice(0, 2).map((tag) =>
            <Tag key={tag} >
                      {tag}
                    </Tag>
            )}
                </div>
          }
            </div>
        )
        }
      </div>

      {/* 即将到期 */}
      <div className="bg-bg-2 rounded-xl p-6 shadow-sm border border-border-1">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-warning-light-1 rounded-lg flex items-center justify-center mr-3">
            <div className="w-5 h-5 bg-warning rounded"></div>
          </div>
          <div>
            <h5 className="text-title-1 font-medium !mb-0">
              即将到期
            </h5>
            <div className="text-sm text-text-3">按计划日期排序的待办任务</div>
          </div>
        </div>

        {upcomingTasks.length === 0 ?
        <div className="text-center py-8">
            <span className="text-text-3 text-text-3">
              暂无待处理任务
            </span>
          </div> :

        upcomingTasks.map((todo, index) =>
        <div
          key={todo.id}
          className="!px-0"
          style={{
            padding: '12px 0',
            display: 'flex',
            gap: 8,
            borderTop:
            index > 0 ?
            '1px solid var(--color-border-2, #e5e6eb)' :
            undefined
          }}>

              <div style={{ flex: 1, minWidth: 0 }}>
                <Flex gap={12} align="flex-start">
                  <Avatar size={24} style={{ backgroundColor: '#3b82f6' }}>
                    {getPriorityIcon(todo.importance, todo.urgency)}
                  </Avatar>
                  <Flex vertical gap={4} style={{ minWidth: 0, flex: 1 }}>
                    <span

                  className="truncate text-text-1" style={{ maxWidth: 200 }}>

                      {todo.name}
                    </span>
                    <div className="flex gap-2">
                      <Tag color={getDateColor(todo.planDate)} >
                        {getDateLabel(todo.planDate)}
                      </Tag>
                      {todo.importance === 1 && todo.urgency === 1 &&
                  <Tag color="red" >
                          高优先级
                        </Tag>
                  }
                    </div>
                  </Flex>
                </Flex>
              </div>
            </div>
        )
        }
      </div>
    </div>);

}