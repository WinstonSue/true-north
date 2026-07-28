import { Button, Card, Col, Flex, Progress, Row, Space, Statistic } from '@sue/design-web-react';
import { Flame, Plus } from 'lucide-react';
import { PageHeader, StateTag } from '../../shared/components';
import type { DrawerState, Goal, Habit, Score } from '../../shared/types';
import { goalName } from '../../shared/utils';
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
        wikiId="habit-overview"
        title="习惯追踪"
        detail="以目标为约束，打卡和贡献权重共同回写长期进度。"
        action={
          <span data-product-wiki="habit-interaction">
            <Button type="primary" icon={<Plus size={15} />} onClick={() => setDrawer({ kind: 'habit' })}>
              新建习惯
            </Button>
          </span>
        }
      />
      <Row gutter={[16, 16]}>
        {habits.map((habit) => (
          <Col xs={24} md={12} xl={8} key={habit.id}>
            <div data-product-wiki="habit-overview">
              <Card title={habit.title} extra={<StateTag status={habit.status} />}>
                <p data-product-wiki="habit-rules" className={styles.habitGoal}>
                  {habit.goalIds.map((id) => goalName(goals, id)).join(' · ')}
                </p>
                <div data-product-wiki="habit-metrics">
                  <Statistic title="当前连续" value={habit.streak} suffix="天" prefix={<Flame size={16} />} />
                  <Progress percent={Math.min(100, habit.streak * 7)} showInfo={false} />
                </div>
                <Flex justify="space-between" align="center" className={styles.cardActions}>
                  <span data-product-wiki="habit-interaction">
                    <Space>
                      <Button size="small" onClick={() => scoreHabit(habit, 'perfect')}>
                        完美
                      </Button>
                      <Button size="small" onClick={() => scoreHabit(habit, 'good')}>
                        良好
                      </Button>
                    </Space>
                  </span>
                  <span data-product-wiki="habit-interaction">
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
