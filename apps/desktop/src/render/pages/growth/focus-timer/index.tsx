import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button, Card, Flex, Select, Space, Tooltip, message } from '@sue/design-web-react';
import { ClockCircleOutlined, CompressOutlined, ExpandOutlined, PauseCircleOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { TaskStatus, TrackTimeRelatedType } from '@true-north/enum';
import { TaskService, TrackTimeController } from '@true-north/web-service';
import styles from './style.module.less';

const DEFAULT_DURATION = 25 * 60;

type FocusTimerContextValue = {
  open: (taskId?: string) => void;
};

type TaskOption = { value: string; label: string };
type Session = { id: string; title: string; duration: number; startedAt?: string };

const FocusTimerContext = createContext<FocusTimerContextValue | null>(null);

export function useFocusTimer() {
  const context = useContext(FocusTimerContext);
  if (!context) throw new Error('FocusTimerProvider is required');
  return context;
}

export function FocusTimerProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [taskId, setTaskId] = useState<string>();
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState<number>();
  const [taskOptions, setTaskOptions] = useState<TaskOption[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  const loadTimerData = useCallback(async () => {
    try {
      const [taskResult, recordResult] = await Promise.all([
        TaskService.findByFilter({}),
        TrackTimeController.list(),
      ]);
      setTaskOptions(
        (taskResult?.list || [])
          .filter((task) => task.status !== TaskStatus.DONE && task.status !== TaskStatus.ABANDONED)
          .map((task) => ({ value: task.id, label: task.name })),
      );
      const today = new Date().toDateString();
      setSessions(
        (recordResult?.list || [])
          .filter((record) => record.startAt && new Date(record.startAt).toDateString() === today)
          .sort((left, right) => new Date(right.startAt || 0).getTime() - new Date(left.startAt || 0).getTime())
          .map((record) => ({
            id: record.id,
            title: record.relatedId
              ? taskResult?.list?.find((task) => task.id === record.relatedId)?.name || '关联任务'
              : '独立专注',
            duration: record.duration,
            startedAt: record.startAt,
          })),
      );
    } catch (error) {
      console.error('加载专注计时器数据失败:', error);
      message.error('加载专注计时器数据失败');
    }
  }, []);

  const open = useCallback((nextTaskId?: string) => {
    setTaskId(nextTaskId);
    setVisible(true);
    setFullScreen(false);
    void loadTimerData();
  }, [loadTimerData]);

  useEffect(() => {
    if (!running || !startedAt) return;
    const timer = window.setInterval(() => {
      setElapsed((value) => Math.min(DEFAULT_DURATION, value + 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, startedAt]);

  useEffect(() => {
    if (elapsed >= DEFAULT_DURATION && running) setRunning(false);
  }, [elapsed, running]);

  const reset = () => {
    setRunning(false);
    setStartedAt(undefined);
    setElapsed(0);
  };

  const toggleRunning = () => {
    if (running) {
      setRunning(false);
      setStartedAt(undefined);
      return;
    }
    if (elapsed >= DEFAULT_DURATION) return;
    setStartedAt(Date.now());
    setRunning(true);
  };

  const finish = async () => {
    if (!elapsed) {
      message.warning('请先开始专注再记录');
      return;
    }
    const endedAt = new Date();
    try {
      await TrackTimeController.create({
        relatedType: taskId ? TrackTimeRelatedType.TASK : TrackTimeRelatedType.NONE,
        relatedId: taskId,
        duration: elapsed,
        startAt: new Date(endedAt.getTime() - elapsed * 1000).toISOString(),
        endAt: endedAt.toISOString(),
      });
      message.success('专注记录已保存');
      reset();
      await loadTimerData();
    } catch (error) {
      console.error('保存专注记录失败:', error);
      message.error('保存专注记录失败');
    }
  };

  useEffect(() => {
    if (elapsed === DEFAULT_DURATION && startedAt) {
      setRunning(false);
      setStartedAt(undefined);
      void finish();
    }
  }, [elapsed, startedAt]);

  const close = () => {
    if (running) {
      setFullScreen(false);
      return;
    }
    setVisible(false);
    setFullScreen(false);
  };

  const contextValue = useMemo(() => ({ open }), [open]);
  const taskName = taskOptions.find((task) => task.value === taskId)?.label || '独立专注';

  return (
    <FocusTimerContext.Provider value={contextValue}>
      {children}
      {visible && (
        <FocusTimerOverlay
          elapsed={elapsed}
          fullScreen={fullScreen}
          running={running}
          sessions={sessions}
          taskId={taskId}
          taskName={taskName}
          taskOptions={taskOptions}
          onClose={close}
          onFinish={finish}
          onReset={reset}
          onSetTaskId={setTaskId}
          onToggleFullScreen={() => setFullScreen((value) => !value)}
          onToggleRunning={toggleRunning}
        />
      )}
    </FocusTimerContext.Provider>
  );
}

function FocusTimerOverlay({
  elapsed,
  fullScreen,
  running,
  sessions,
  taskId,
  taskName,
  taskOptions,
  onClose,
  onFinish,
  onReset,
  onSetTaskId,
  onToggleFullScreen,
  onToggleRunning,
}: {
  elapsed: number;
  fullScreen: boolean;
  running: boolean;
  sessions: Session[];
  taskId?: string;
  taskName: string;
  taskOptions: TaskOption[];
  onClose: () => void;
  onFinish: () => void;
  onReset: () => void;
  onSetTaskId: (value?: string) => void;
  onToggleFullScreen: () => void;
  onToggleRunning: () => void;
}) {
  const remaining = Math.max(DEFAULT_DURATION - elapsed, 0);
  const controls = (
    <Space size={8}>
      <Tooltip title="重置计时">
        <Button shape="circle" icon={<ReloadOutlined />} aria-label="重置计时" onClick={onReset} />
      </Tooltip>
      <Tooltip title={running ? '暂停计时' : '开始计时'}>
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={running ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          aria-label={running ? '暂停计时' : '开始计时'}
          onClick={onToggleRunning}
        />
      </Tooltip>
    </Space>
  );
  const selector = (
    <Select
      allowClear
      className={styles.taskSelector}
      value={taskId}
      placeholder="选择任务（可选）"
      options={taskOptions}
      onChange={(value) => onSetTaskId(value as string | undefined)}
    />
  );

  if (fullScreen) {
    return (
      <div className={styles.fullscreen}>
        <Flex vertical className={styles.fullscreenContent} align="center" justify="center" gap={28}>
          <Flex className={styles.fullscreenHeader} align="center" justify="space-between">
            <div><h1>专注计时</h1><p>记录此刻真正投入的时间</p></div>
            <Tooltip title="最小化"><Button type="text" icon={<CompressOutlined />} aria-label="最小化计时器" onClick={onToggleFullScreen} /></Tooltip>
          </Flex>
          <Flex vertical align="center" gap={20}>
            {selector}
            <div className={styles.fullTimer}>{formatSeconds(remaining)}</div>
            <span className={styles.taskName}>{taskName}</span>
            {controls}
            <Button type="link" icon={<ClockCircleOutlined />} onClick={onFinish}>结束并记录</Button>
          </Flex>
          <SessionList sessions={sessions} />
        </Flex>
      </div>
    );
  }

  return (
    <Card className={styles.miniTimer}>
      <Flex vertical gap={12}>
        <Flex align="center" justify="space-between">
          <b>专注计时</b>
          <Space size={0}>
            <Tooltip title="展开全屏"><Button type="text" size="small" icon={<ExpandOutlined />} aria-label="展开全屏计时器" onClick={onToggleFullScreen} /></Tooltip>
            <Tooltip title={running ? '计时进行中，保持迷你浮层' : '关闭计时器'}><Button type="text" size="small" aria-label="关闭计时器" onClick={onClose}>关闭</Button></Tooltip>
          </Space>
        </Flex>
        {selector}
        <Flex className={styles.miniBody} align="center" justify="space-between" gap={12}>
          <Flex vertical gap={2}><b className={styles.miniTime}>{formatSeconds(remaining)}</b><span className={styles.taskName}>{taskName}</span></Flex>
          {controls}
        </Flex>
        <Button type="link" className={styles.finishButton} onClick={onFinish}>结束并记录</Button>
      </Flex>
    </Card>
  );
}

function SessionList({ sessions }: { sessions: Session[] }) {
  return (
    <Card className={styles.sessionPanel} title="今日时间记录">
      {sessions.length ? (
        <Flex vertical gap={10}>{sessions.map((session) => <Flex key={session.id} align="center" justify="space-between"><span>{session.title}</span><b>{formatDuration(session.duration)}</b></Flex>)}</Flex>
      ) : <span className={styles.emptySessions}>尚无时间记录</span>}
    </Card>
  );
}

function formatSeconds(total: number) {
  const minutes = Math.floor(total / 60).toString().padStart(2, '0');
  const seconds = (total % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function formatDuration(total: number) {
  const minutes = Math.floor(total / 60);
  return minutes >= 60 ? `${Math.floor(minutes / 60)} 小时 ${minutes % 60} 分钟` : `${minutes} 分钟`;
}
