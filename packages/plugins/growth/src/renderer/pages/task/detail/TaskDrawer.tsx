import { Button, Drawer, Empty, Flex, Spin } from '@sue/design-web-react';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { TaskDetailProvider, useTaskDetailContext } from './context';
import TaskAside from './TaskAside';
import TaskMain from './TaskMain';
import { TaskEditor } from '../../components/task-detail';
import styles from './style.module.less';

type OpenTaskDrawerOptions = {
  taskId: string;
  onRefresh?: () => Promise<void> | void;
};

type TaskDrawerController = ReturnType<typeof Drawer.useDrawer>[0];

let taskDrawerController: TaskDrawerController | null = null;
let pendingDrawerOptions: OpenTaskDrawerOptions | null = null;

/** Renders task detail drawers within the app's existing provider and router tree. */
export function TaskDrawerHost() {
  const [drawer, drawerContextHolder] = Drawer.useDrawer();

  useEffect(() => {
    taskDrawerController = drawer;
    if (pendingDrawerOptions) {
      const options = pendingDrawerOptions;
      pendingDrawerOptions = null;
      openTaskDrawer(options);
    }

    return () => {
      if (taskDrawerController === drawer) {
        taskDrawerController = null;
      }
    };
  }, [drawer]);

  return drawerContextHolder;
}

/** Opens task details in the current page instead of navigating to a detail route. */
export function openTaskDrawer({ taskId, onRefresh }: OpenTaskDrawerOptions) {
  if (!taskDrawerController) {
    pendingDrawerOptions = { taskId, onRefresh };
    return { destroy: () => { pendingDrawerOptions = null; } };
  }

  let instance: ReturnType<typeof Drawer.open>;
  instance = taskDrawerController.open({
    title: '任务详情',
    size: 1100,
    content: (
      <TaskDetailPane taskId={taskId} onClose={() => instance.destroy()} onRefresh={onRefresh} />
    ),
  });
  return instance;
}

export function TaskDetailPane({
  taskId,
  onClose,
  onRefresh,
  compact,
}: {
  taskId: string;
  onClose?: () => void;
  onRefresh?: () => Promise<void> | void;
  compact?: boolean;
}) {
  return (
    <TaskDetailProvider taskId={taskId} onRefresh={async () => onRefresh?.()}>
      <TaskDetailBody onClose={onClose} compact={compact} />
    </TaskDetailProvider>
  );
}

function TaskDetailBody({ onClose, compact }: { onClose?: () => void; compact?: boolean }) {
  const { currentTask, loading, refreshData } = useTaskDetailContext();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setEditing(false);
  }, [currentTask?.id]);

  if (loading && !currentTask) {
    return <Flex container="full" justify="center" align="center"><Spin /></Flex>;
  }
  if (!currentTask) {
    return (
      <Flex vertical container="full">
        {compact && onClose ? <CompactBackBar onClose={onClose} /> : null}
        <Flex container="fill" justify="center" align="center">
          <Empty description="任务不存在或已被删除" />
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex vertical container="full" className={compact ? styles.compactBody : styles.drawerBody}>
      {compact && onClose ? <CompactBackBar onClose={onClose} /> : null}
      <Flex container="fill">
        {compact ? null : (
          <Flex container="fixed" className={styles.aside}>
            <TaskAside currentTaskId={currentTask.id} />
          </Flex>
        )}
        <Flex container="fill">
          {editing ? (
            <TaskEditor
              task={currentTask}
              afterSubmit={async () => {
                await refreshData();
                setEditing(false);
              }}
              onClose={() => setEditing(false)}
            />
          ) : (
            <TaskMain
              task={currentTask}
              onDeleted={onClose}
              onEdit={() => setEditing(true)}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

function CompactBackBar({ onClose }: { onClose: () => void }) {
  return (
    <Flex container="fixed" align="center" className={styles.compactToolbar}>
      <Button type="text" icon={<ArrowLeft size={16} />} onClick={onClose}>
        返回任务
      </Button>
    </Flex>
  );
}
