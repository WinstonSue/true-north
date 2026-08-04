import { useEffect, useMemo, useState } from 'react';
import { Card, Col, Empty, Flex, Row, Spin, Statistic } from '@sue/design-web-react';
import { TaskService } from '@true-north/web-service';
import { TaskWithoutRelationsVo } from '@true-north/vo';
import { TaskStatus } from '@true-north/enum';
import dayjs from 'dayjs';
import styles from './style.module.less';

export default function TaskStatistics() {
  const [tasks, setTasks] = useState<TaskWithoutRelationsVo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TaskService.findByFilter({}).then((result) => setTasks(result?.list || [])).finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.status === TaskStatus.DONE).length;
    const doing = tasks.filter((task) => task.status === TaskStatus.DOING).length;
    const overdue = tasks.filter(
      (task) =>
        (task.status === TaskStatus.TODO || task.status === TaskStatus.DOING) &&
        task.endAt &&
        dayjs(task.endAt).isBefore(dayjs(), 'day'),
    ).length;
    return { total, done, doing, overdue, completionRate: total ? Math.round(done / total * 100) : 0 };
  }, [tasks]);

  if (loading) return <Flex container="full" justify="center" align="center"><Spin /></Flex>;
  if (!tasks.length) return <Flex container="full" justify="center" align="center"><Empty description="暂无任务数据" /></Flex>;

  return (
    <Row gutter={[16, 16]} className={styles.statistics}>
      <Col xs={24} md={12} xl={6}><Card><Statistic title="任务总数" value={stats.total} suffix="项" /></Card></Col>
      <Col xs={24} md={12} xl={6}><Card><Statistic title="完成率" value={stats.completionRate} suffix="%" /></Card></Col>
      <Col xs={24} md={12} xl={6}><Card><Statistic title="进行中" value={stats.doing} suffix="项" /></Card></Col>
      <Col xs={24} md={12} xl={6}><Card><Statistic title="已过期" value={stats.overdue} suffix="项" /></Card></Col>
    </Row>
  );
}
