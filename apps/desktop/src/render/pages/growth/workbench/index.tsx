import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Flex, Row, Spin, Statistic, message } from '@sue/design-web-react';
import { CheckCircleOutlined, ClockCircleOutlined, FireOutlined, FlagOutlined, RightOutlined } from '@ant-design/icons';
import { GoalStatus, TodoRelatedType, TodoStatus } from '@true-north/enum';
import { GoalService, HabitService, TaskService, TodoService, TrackTimeController } from '@true-north/web-service';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.less';

type DashboardData = {
  goals: any[];
  todos: any[];
  habits: any[];
  focusSeconds: number;
};

const emptyData: DashboardData = { goals: [], todos: [], habits: [], focusSeconds: 0 };

export default function Workbench() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>(emptyData);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [goalResult, taskResult, todoResult, habitResult, trackTimeResult] = await Promise.all([
        GoalService.findByFilter({}),
        TaskService.findByFilter({}),
        TodoService.list(),
        HabitService.findByFilter({}),
        TrackTimeController.list(),
      ]);
      void taskResult;
      setData({
        goals: goalResult?.list || [],
        todos: todoResult?.list || [],
        habits: habitResult?.list || [],
        focusSeconds: (trackTimeResult?.list || []).reduce((total, record) => total + (record.duration || 0), 0),
      });
    } catch (error) {
      console.error('加载工作台失败:', error);
      message.error('加载工作台失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const dueTodos = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return data.todos
      .filter((todo) => todo.status !== TodoStatus.DONE && todo.status !== TodoStatus.ABANDONED && formatDate(todo.planDate) <= today)
      .sort((left, right) => formatDate(left.planDate).localeCompare(formatDate(right.planDate)));
  }, [data.todos]);

  const handleCompleteTodo = async (todo: any) => {
    try {
      await TodoService.done(todo.relatedType || TodoRelatedType.NONE, todo.id);
      await loadData();
    } catch (error) {
      console.error('完成待办失败:', error);
      message.error('完成待办失败');
    }
  };

  const activeGoals = data.goals.filter((goal) => goal.status === GoalStatus.DOING).length;
  const longestStreak = Math.max(0, ...data.habits.map((habit) => habit.currentStreak || 0));

  return (
    <Flex vertical container="full" className={styles.page} gap={20}>
      <Flex container="fixed" align="center" justify="space-between" className={styles.header}>
        <div><h1>工作台</h1><p>聚合今天最需要推进的行动和投入。</p></div>
        <Button onClick={() => void loadData()}>刷新</Button>
      </Flex>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} xl={6}><Metric title="活跃目标" value={activeGoals} icon={<FlagOutlined />} /></Col>
          <Col xs={24} sm={12} xl={6}><Metric title="今日待办" value={dueTodos.length} icon={<CheckCircleOutlined />} /></Col>
          <Col xs={24} sm={12} xl={6}><Metric title="专注投入" value={formatHours(data.focusSeconds)} icon={<ClockCircleOutlined />} /></Col>
          <Col xs={24} sm={12} xl={6}><Metric title="习惯连续" value={longestStreak} suffix="天" icon={<FireOutlined />} /></Col>
        </Row>
        <Row gutter={[16, 16]} className={styles.contentRow}>
          <Col xs={24} xl={14}>
            <Card title="今日待办" extra={<Button type="link" onClick={() => navigate('/growth/todo/todo-today')}>查看全部</Button>}>
              <Flex vertical className={styles.list} gap={4}>
                {dueTodos.length ? dueTodos.slice(0, 8).map((todo) => (
                  <Flex key={todo.id} align="center" justify="space-between" gap={12} className={styles.listRow}>
                    <Flex align="center" gap={10} className={styles.todoTitle}>
                      <Button type="text" shape="circle" icon={<CheckCircleOutlined />} aria-label={`完成 ${todo.name}`} onClick={() => void handleCompleteTodo(todo)} />
                      <div><b>{todo.name}</b><span>{formatDate(todo.planDate)}</span></div>
                    </Flex>
                    <Button type="text" icon={<RightOutlined />} aria-label={`查看 ${todo.name}`} onClick={() => navigate('/growth/todo/todo-all')} />
                  </Flex>
                )) : <div className={styles.empty}>今天没有待处理的待办。</div>}
              </Flex>
            </Card>
          </Col>
          <Col xs={24} xl={10}>
            <Card title="习惯打卡" extra={<Button type="link" onClick={() => navigate('/growth/habit/habit-list')}>查看习惯</Button>}>
              <Flex vertical className={styles.list} gap={4}>
                {data.habits.length ? data.habits.slice(0, 6).map((habit) => (
                  <Flex key={habit.id} align="center" justify="space-between" gap={12} className={styles.listRow}>
                    <Flex align="center" gap={10} className={styles.todoTitle}><FireOutlined className={styles.habitIcon} /><div><b>{habit.name}</b><span>连续 {habit.currentStreak || 0} 天</span></div></Flex>
                    <Button type="text" icon={<RightOutlined />} aria-label={`查看 ${habit.name}`} onClick={() => navigate(`/growth/habit/habit-detail/${habit.id}`)} />
                  </Flex>
                )) : <div className={styles.empty}>还没有进行中的习惯。</div>}
              </Flex>
            </Card>
          </Col>
        </Row>
      </Spin>
    </Flex>
  );
}

function Metric({ title, value, suffix, icon }: { title: string; value: string | number; suffix?: string; icon: React.ReactNode }) {
  return <Card className={styles.metric}><Flex align="center" justify="space-between"><Statistic title={title} value={value} suffix={suffix} /><span className={styles.metricIcon}>{icon}</span></Flex></Card>;
}

function formatDate(value?: string | Date) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

function formatHours(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
}
