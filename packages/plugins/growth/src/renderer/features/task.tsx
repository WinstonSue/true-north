'use client';

import { TabsPage } from '@true-north/plugin-ui';
import { CreateButton } from '@true-north/plugin-ui';
import { useTaskDetail } from '../pages/components';
import { AgendaProvider, useAgendaDate } from '../pages/components/day-agenda/context';
import { usePluginViewState } from '@true-north/plugin-sdk/renderer';
import { taskViewCodec } from '../../contract/view-state';
import { TaskDetailPane } from '../pages/task/detail/TaskDrawer';
import TaskToday from '../pages/task/task-today';
import TaskCalendar from '../pages/task/task-calendar';
import TaskAll from '../pages/task/task-all';

const TASK_TABS = [
  { tab: 'today' as const, name: '当前任务' },
  { tab: 'calendar' as const, name: '任务日历' },
  { tab: 'all' as const, name: '全部任务' },
];

function TaskPageContent() {
  const [state, setState] = usePluginViewState(taskViewCodec);
  const { openCreateDrawer } = useTaskDetail();
  const { selectedDate } = useAgendaDate();

  return (
    <TabsPage
      tabs={TASK_TABS.map((item) => ({
        name: item.name,
        key: item.tab,
        active: state.tab === item.tab,
      }))}
      onSelect={(item) => setState({ tab: (item.key as typeof state.tab) || 'today' })}
      extra={
        <CreateButton
          onClick={() => {
            openCreateDrawer({
              contentProps: {
                initialFormData: {
                  planTimeRange: [selectedDate.startOf('day'), selectedDate.endOf('day')],
                },
              },
            });
          }}
        >
          新建任务
        </CreateButton>
      }
    >
      {state.tab === 'calendar' ? <TaskCalendar /> : null}
      {state.tab === 'all' ? <TaskAll /> : null}
      {state.tab === 'today' ? <TaskToday /> : null}
    </TabsPage>
  );
}

export default function TaskFeature() {
  const [state, setState] = usePluginViewState(taskViewCodec);

  if (state.id) {
    return (
      <TaskDetailPane
        key={state.id}
        taskId={state.id}
        compact
        onClose={() => setState({ tab: 'today' })}
      />
    );
  }

  return (
    <AgendaProvider>
      <TaskPageContent />
    </AgendaProvider>
  );
}
