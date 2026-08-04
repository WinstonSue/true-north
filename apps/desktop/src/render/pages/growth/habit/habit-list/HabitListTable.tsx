import { Button, Col, Empty, Flex, Row, Spin } from '@sue/design-web-react';
import { useNavigate } from 'react-router-dom';
import { HabitStatus } from '@true-north/enum';
import HabitCard from '../components/HabitCard';
import { useHabitListContext } from './context';
import styles from './HabitListTable.module.less';

export default function HabitListTable() {
  const navigate = useNavigate();
  const { habits, loading, pagination, handlePageChange, handleHabitComplete, handleHabitDelete } = useHabitListContext();
  const canPrevious = pagination.current > 1;
  const canNext = pagination.current * pagination.pageSize < pagination.total;

  if (loading && !habits.length) return <Flex className={styles.loading} align="center" justify="center"><Spin /></Flex>;
  if (!habits.length) return <Empty className={styles.empty} description="暂无习惯，开始建立一个可持续的行动吧" />;

  return (
    <Flex vertical className={styles.wrapper}>
      <Row gutter={[16, 16]}>
        {habits.map((habit) => (
          <Col key={habit.id} xs={24} md={12} xl={8}>
            <HabitCard
              habit={habit}
              onComplete={habit.status === HabitStatus.ACTIVE && habit.cycleTodoId ? () => handleHabitComplete(habit.id) : undefined}
              onDelete={() => handleHabitDelete(habit.id)}
              onEdit={() => navigate(`/growth/habit/habit-detail/${habit.id}`)}
            />
          </Col>
        ))}
      </Row>
      <Flex className={styles.pagination} align="center" justify="space-between">
        <span>第 {pagination.current} 页，共 {pagination.total} 个习惯</span>
        <Flex gap={8}>
          <Button size="small" disabled={!canPrevious} onClick={() => handlePageChange(pagination.current - 1, pagination.pageSize)}>上一页</Button>
          <Button size="small" disabled={!canNext} onClick={() => handlePageChange(pagination.current + 1, pagination.pageSize)}>下一页</Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
