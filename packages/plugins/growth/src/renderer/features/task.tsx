'use client';

import { CreateButton } from '@true-north/plugin-ui';
import { useTaskDetail } from '../pages/components';
import { AgendaProvider, useAgendaDate } from '../pages/components/day-agenda/context';
import { usePluginViewRuntime, usePluginViewState } from '@true-north/plugin-sdk/renderer';
import { taskViewCodec } from '../../contract/view-state';
import { TaskDetailPane } from '../pages/task/detail/TaskDrawer';
import TaskToday from '../pages/task/task-today';
import TaskCalendar from '../pages/task/task-calendar';
import TaskAll from '../pages/task/task-all';
import { GrowthPage } from '../ui/GrowthPage';
import { CompactViewNav } from '../ui/CompactViewNav';
import { growthIds } from '../../contract';
import { growthNavigation, usesCompactNav } from '../layout/nav';

function TaskPageContent() {
  const { mode } = usePluginViewRuntime();
  const [state, setState] = usePluginViewState(taskViewCodec);
  const { openCreateDrawer } = useTaskDetail();
  const { selectedDate } = useAgendaDate();
  const children = growthNavigation.find((group) => group.view === 'task')?.children || [];

  return (
    <GrowthPage
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
      compactNav={
        mode === 'workbench' && usesCompactNav(mode) ? (
          <CompactViewNav
            viewId={growthIds.views.task}
            children={children}
            activeTab={state.tab}
            onSelect={(tab) => setState({ tab: (tab as typeof state.tab) || 'today' })}
          />
        ) : null
      }
    >
      {state.tab === 'calendar' ? <TaskCalendar /> : null}
      {state.tab === 'all' ? <TaskAll /> : null}
      {state.tab === 'today' ? <TaskToday /> : null}
    </GrowthPage>
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
