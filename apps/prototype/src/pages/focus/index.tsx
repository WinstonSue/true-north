import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { Alert, Button, Card, Col, Flex, Row, Select, Space, Tooltip, message } from '@sue/design-web-react';
import { Pause, Play, TimerReset } from 'lucide-react';
import { PageHeader } from '../../shared/components';
import { productRef } from '../../product-wiki';
import type { FocusSession, Task } from '../../shared/types';
import styles from './index.module.css';

type Props = {
  tasks: Task[];
  sessions: FocusSession[];
  setSessions: Dispatch<SetStateAction<FocusSession[]>>;
  updateTask: (id: string, patch: Partial<Task>) => void;
};
export function FocusPage({ tasks, sessions, setSessions, updateTask }: Props) {
  const [taskId, setTaskId] = useState(tasks[0]?.id || '');
  const [running, setRunning] = useState(false);
  const task = tasks.find((item) => item.id === taskId);
  const finish = () => {
    if (!task) return;
    setRunning(false);
    setSessions((items) => [{ id: `f${Date.now()}`, taskId, title: task.title, minutes: 25, at: '刚刚' }, ...items]);
    updateTask(task.id, { actual: task.actual + 25 / 60, status: task.status === 'todo' ? 'doing' : task.status });
    message.success('已记录 25 分钟 TrackTime，并回写实际工时');
  };
  return (
    <>
      <PageHeader productReference={productRef('growth.track-time.overview')} title="专注计时" />
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <div data-product-ref={productRef('growth.track-time.overview')}>
            <Card>
              <Flex vertical className={styles.timerCard} align="center" gap={22}>
                <Select
                  value={taskId}
                  options={tasks
                    .filter((item) => item.status !== 'done')
                    .map((item) => ({ value: item.id, label: item.title }))}
                  onChange={(value) => setTaskId(value as string)}
                />
                <div className={styles.timerCircle}>
                  <b>25:00</b>
                  <span>{task?.title || '选择任务'}</span>
                </div>
                <Space>
                  <Tooltip title="重置计时">
                    <Button shape="circle" icon={<TimerReset size={17} />} />
                  </Tooltip>
                  <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    icon={running ? <Pause size={18} /> : <Play size={18} />}
                    onClick={() => (running ? finish() : setRunning(true))}
                  />
                </Space>
              </Flex>
            </Card>
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div data-product-ref={productRef('growth.track-time.overview')}>
            <Card title="今日时间记录">
              {sessions.length ? (
                sessions.map((session) => (
                  <Flex className={styles.session} key={session.id} align="center" justify="space-between">
                    <span>{session.title}</span>
                    <b>{session.minutes} 分钟</b>
                  </Flex>
                ))
              ) : (
                <Alert type="info" showIcon title="尚无时间记录。" />
              )}
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
}
