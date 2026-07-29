import { Button, Card, Col, Flex, Row, Statistic } from '@sue/design-web-react';
import { CheckCircle2, CircleDot, Flame, Plus } from 'lucide-react';
import { PageHeader, PriorityTag } from '../../shared/components';
import { productRef } from '../../product-wiki';
import { TODAY } from '../../shared/mock-data';
import type { Goal, Habit, Score, Task, Todo, View } from '../../shared/types';
import { frequencyLabel, goalName } from '../../shared/utils';
import styles from './index.module.css';

type Props = {
  goals: Goal[];
  tasks: Task[];
  todos: Todo[];
  habits: Habit[];
  setView: (view: View) => void;
  completeTodo: (todo: Todo) => void;
  scoreHabit: (habit: Habit, score: Score) => void;
};

export function Workbench({ goals, tasks, todos, habits, setView, completeTodo, scoreHabit }: Props) {
  const due = todos.filter((todo) => todo.status !== 'done' && todo.planned <= TODAY);
  return (
    <>
      <PageHeader
        productReference={productRef('growth.overview')}
        title="工作台"
        action={
          <span data-product-ref={productRef('growth.todo.interaction')}>
            <Button type="primary" icon={<Plus size={15} />} onClick={() => setView('todo')}>
              新建待办
            </Button>
          </span>
        }
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <div data-product-ref={productRef('growth.goal.overview')}>
            <Card>
              <Statistic title="活跃目标" value={goals.filter((goal) => goal.status === 'doing').length} suffix="个" />
            </Card>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div data-product-ref={productRef('growth.todo.overview')}>
            <Card>
              <Statistic title="今日待办" value={due.length} suffix="项" />
            </Card>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div data-product-ref={productRef('growth.track-time.overview')}>
            <Card>
              <Statistic
                title="专注投入"
                value={Math.round(tasks.reduce((sum, task) => sum + task.actual, 0) * 10) / 10}
                suffix="小时"
              />
            </Card>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div data-product-ref={productRef('growth.habit.metrics')}>
            <Card>
              <Statistic title="习惯连续" value={Math.max(...habits.map((habit) => habit.streak))} suffix="天" />
            </Card>
          </div>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className={styles.sectionRow}>
        <Col xs={24} lg={14}>
          <div data-product-ref={productRef('growth.todo.overview')}>
            <Card
              title="今日待办"
              extra={
                <Button type="link" onClick={() => setView('todo')}>
                  全部待办
                </Button>
              }
            >
              <div className={styles.list}>
                {due.map((todo) => (
                  <Flex className={styles.listRow} align="center" gap={10} key={todo.id}>
                    <span data-product-ref={productRef('growth.todo.interaction')}>
                      <Button
                        type="text"
                        shape="circle"
                        icon={todo.status === 'done' ? <CheckCircle2 size={17} /> : <CircleDot size={17} />}
                        onClick={() => completeTodo(todo)}
                      />
                    </span>
                    <Flex vertical className={styles.listItemContent} gap={4}>
                      <b>{todo.title}</b>
                      <small>
                        {todo.recurrenceId ? '周期执行 · ' : ''}
                        {todo.due} · {todo.reminder !== 'none' ? '已设置提醒' : '无提醒'}
                      </small>
                    </Flex>
                    <span data-product-ref={productRef('growth.todo.priority')}>
                      <PriorityTag importance={todo.importance} urgency={todo.urgency} />
                    </span>
                  </Flex>
                ))}
              </div>
            </Card>
          </div>
        </Col>
        <Col xs={24} lg={10}>
          <div data-product-ref={productRef('growth.habit.overview')}>
            <Card
              title="习惯打卡"
              extra={
                <Button type="link" onClick={() => setView('habit')}>
                  查看统计
                </Button>
              }
            >
              <div className={styles.list}>
                {habits.map((habit) => (
                  <Flex className={styles.listRow} align="center" gap={10} key={habit.id}>
                    <span className={styles.habitIcon}>
                      <Flame size={16} />
                    </span>
                    <Flex vertical className={styles.listItemContent} gap={4}>
                      <b>{habit.title}</b>
                      <small>
                        {frequencyLabel(habit.frequency)} · 连续 {habit.streak} 天 · {goalName(goals, habit.goalIds[0])}
                      </small>
                    </Flex>
                    <span data-product-ref={productRef('growth.habit.interaction')}>
                      <Button size="small" onClick={() => scoreHabit(habit, 'perfect')}>
                        完成
                      </Button>
                    </span>
                  </Flex>
                ))}
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
}
