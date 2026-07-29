import { Button, Card, Col, Flex, Progress, Row, Space, Statistic } from '@sue/design-web-react';
import { Flame, Plus } from 'lucide-react';
import { PageHeader, StateTag } from '../../shared/components';
import { productRef } from '../../product-wiki';
import type { DrawerState, Goal, Habit, Score } from '../../shared/types';
import { frequencyLabel, goalName } from '../../shared/utils';
import styles from './index.module.css';

type Props = {
  habits: Habit[];
  goals: Goal[];
  setDrawer: (drawer: DrawerState) => void;
  scoreHabit: (habit: Habit, score: Score) => void;
};
export function HabitsPage({ habits, goals, setDrawer, scoreHabit }: Props) {
  return (
    <>
      <PageHeader
        productReference={productRef('growth.habit.overview')}
        title="习惯追踪"
        action={
          <span data-product-ref={productRef('growth.habit.interaction')}>
            <Button type="primary" icon={<Plus size={15} />} onClick={() => setDrawer({ kind: 'habit' })}>
              新建习惯
            </Button>
          </span>
        }
      />
      <Row gutter={[16, 16]}>
        {habits.map((habit) => (
          <Col xs={24} md={12} xl={8} key={habit.id}>
            <div data-product-ref={productRef('growth.habit.view.list')}>
              <Card title={habit.title} extra={<StateTag status={habit.status} />}>
                <p data-product-ref={productRef('growth.habit.rules')} className={styles.habitGoal}>
                  {habit.goalIds.map((id) => goalName(goals, id)).join(' · ')}
                </p>
                <p data-product-ref={productRef('growth.habit.rules')} className={styles.habitFrequency}>
                  执行频率：{frequencyLabel(habit.frequency)}
                </p>
                <div data-product-ref={productRef('growth.habit.metrics')}>
                  <Statistic title="当前连续" value={habit.streak} suffix="天" prefix={<Flame size={16} />} />
                  <Progress percent={Math.min(100, habit.streak * 7)} showInfo={false} />
                </div>
                <Flex justify="space-between" align="center" className={styles.cardActions}>
                  <span data-product-ref={productRef('growth.habit.interaction')}>
                    <Space>
                      <Button size="small" onClick={() => scoreHabit(habit, 'perfect')}>
                        完美
                      </Button>
                      <Button size="small" onClick={() => scoreHabit(habit, 'good')}>
                        良好
                      </Button>
                    </Space>
                  </span>
                  <span data-product-ref={productRef('growth.habit.interaction')}>
                    <Button type="link" onClick={() => setDrawer({ kind: 'habit', id: habit.id })}>
                      编辑
                    </Button>
                  </span>
                </Flex>
              </Card>
            </div>
          </Col>
        ))}
      </Row>
    </>
  );
}
