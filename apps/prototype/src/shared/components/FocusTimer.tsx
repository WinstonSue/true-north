import { useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Button, Card, Flex, Select, Space, Tooltip, message } from '@sue/design-web-react';
import { Check, Maximize2, Minimize2, Pause, Play, TimerReset, X } from 'lucide-react';
import { productRef } from '../../product-wiki';
import type { FocusSession, Task } from '../types';
import styles from './FocusTimer.module.css';

const FOCUS_SECONDS = 25 * 60;

type Props = {
  open: boolean;
  initialTaskId?: string;
  tasks: Task[];
  sessions: FocusSession[];
  onClose: () => void;
  onTaskSelected: () => void;
  setSessions: Dispatch<SetStateAction<FocusSession[]>>;
  updateTask: (id: string, patch: Partial<Task>) => void;
};

export function FocusTimer({
  open,
  initialTaskId,
  tasks,
  sessions,
  onClose,
  onTaskSelected,
  setSessions,
  updateTask,
}: Props) {
  const [mode, setMode] = useState<'mini' | 'full'>('mini');
  const [taskId, setTaskId] = useState<string>();
  const [remaining, setRemaining] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const task = tasks.find((item) => item.id === taskId);
  const taskOptions = useMemo(
    () =>
      tasks
        .filter((item) => item.status !== 'done' && item.status !== 'abandoned')
        .map((item) => ({ value: item.id, label: item.title })),
    [tasks],
  );

  useEffect(() => {
    if (!initialTaskId) return;
    setTaskId(initialTaskId);
    setMode('mini');
    onTaskSelected();
  }, [initialTaskId, onTaskSelected]);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  const recordSession = () => {
    setRunning(false);
    setRemaining(FOCUS_SECONDS);
    setSessions((items) => [
      {
        id: `f${Date.now()}`,
        taskId,
        title: task?.title || '独立专注',
        minutes: 25,
        at: '刚刚',
      },
      ...items,
    ]);
    if (task) {
      const actual = Math.round((task.actual + 25 / 60) * 100) / 100;
      updateTask(task.id, { actual, status: task.status === 'todo' ? 'doing' : task.status });
    }
    message.success(task ? '已记录 25 分钟专注，并回写实际耗时' : '已记录 25 分钟独立专注');
  };

  useEffect(() => {
    if (running && remaining === 0) recordSession();
  }, [remaining, running]);

  if (!open) return null;

  const reset = () => {
    setRunning(false);
    setRemaining(FOCUS_SECONDS);
  };
  const close = () => {
    if (running) return setMode('mini');
    onClose();
  };
  const selector = (
    <Select
      allowClear
      className={styles.taskSelect}
      value={taskId}
      placeholder="选择任务（可选）"
      options={taskOptions}
      onChange={(value) => setTaskId(value as string | undefined)}
    />
  );
  const controls = (
    <Space size={8}>
      <Tooltip title="重置计时">
        <Button shape="circle" icon={<TimerReset size={16} />} aria-label="重置计时" onClick={reset} />
      </Tooltip>
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={running ? <Pause size={18} /> : <Play size={18} />}
        aria-label={running ? '暂停计时' : '开始计时'}
        onClick={() => setRunning((value) => !value)}
      />
    </Space>
  );

  if (mode === 'full') {
    return (
      <div className={styles.fullscreen} data-product-ref={productRef('growth.track-time.overview')}>
        <Flex vertical className={styles.fullscreenContent} align="center" justify="center" gap={28}>
          <Flex className={styles.fullscreenHeader} align="center" justify="space-between">
            <div>
              <h1>专注计时</h1>
              <p>记录此刻真正投入的时间</p>
            </div>
            <Tooltip title="最小化">
              <Button type="text" icon={<Minimize2 size={19} />} aria-label="最小化计时器" onClick={() => setMode('mini')} />
            </Tooltip>
          </Flex>
          <Flex vertical align="center" gap={20}>
            {selector}
            <div className={styles.fullTimer}>{formatSeconds(remaining)}</div>
            <span className={styles.taskName}>{task?.title || '独立专注'}</span>
            {controls}
            <Button type="link" icon={<Check size={15} />} onClick={recordSession}>
              结束并记录 25 分钟
            </Button>
          </Flex>
          <Card className={styles.sessionPanel} title="今日时间记录">
            {sessions.length ? (
              <Flex vertical gap={10}>
                {sessions.map((session) => (
                  <Flex key={session.id} align="center" justify="space-between">
                    <span>{session.title}</span>
                    <b>{session.minutes} 分钟</b>
                  </Flex>
                ))}
              </Flex>
            ) : (
              <span className={styles.emptySessions}>尚无时间记录</span>
            )}
          </Card>
        </Flex>
      </div>
    );
  }

  return (
    <Card className={styles.miniTimer} data-product-ref={productRef('growth.track-time.overview')}>
      <Flex vertical gap={12}>
        <Flex align="center" justify="space-between">
          <b>专注计时</b>
          <Space size={0}>
            <Tooltip title="展开全屏">
              <Button type="text" size="small" icon={<Maximize2 size={16} />} aria-label="展开全屏计时器" onClick={() => setMode('full')} />
            </Tooltip>
            <Tooltip title={running ? '计时进行中，已最小化' : '关闭计时器'}>
              <Button type="text" size="small" icon={<X size={16} />} aria-label="关闭计时器" onClick={close} />
            </Tooltip>
          </Space>
        </Flex>
        {selector}
        <Flex className={styles.miniBody} align="center" justify="space-between" gap={12}>
          <Flex vertical gap={2}>
            <b className={styles.miniTime}>{formatSeconds(remaining)}</b>
            <span className={styles.taskName}>{task?.title || '独立专注'}</span>
          </Flex>
          {controls}
        </Flex>
      </Flex>
    </Card>
  );
}

function formatSeconds(total: number) {
  const minutes = Math.floor(total / 60).toString().padStart(2, '0');
  const seconds = (total % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
