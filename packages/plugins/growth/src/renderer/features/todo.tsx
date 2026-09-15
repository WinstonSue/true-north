'use client';

import { CreateButton } from '@true-north/plugin-ui';
import { useTodoDetail } from '../pages/components';
import { AgendaProvider, useAgendaDate } from '../pages/components/day-agenda/context';
import { usePluginViewRuntime, usePluginViewState } from '@true-north/plugin-sdk/renderer';
import { todoViewCodec } from '../../contract/view-state';
import TodoToday from '../pages/todo/todo-today';
import TodoCalendar from '../pages/todo/todo-calendar';
import TodoAll from '../pages/todo/todo-all';
import { GrowthPage } from '../ui/GrowthPage';
import { CompactViewNav } from '../ui/CompactViewNav';
import { growthIds } from '../../contract';
import { growthNavigation, usesCompactNav } from '../layout/nav';

function TodoPageContent() {
  const { mode } = usePluginViewRuntime();
  const [state, setState] = usePluginViewState(todoViewCodec);
  const { openCreateDrawer } = useTodoDetail();
  const { selectedDate } = useAgendaDate();
  const children = growthNavigation.find((group) => group.view === 'todo')?.children || [];

  return (
    <GrowthPage
      extra={
        <CreateButton
          onClick={() => {
            openCreateDrawer({
              contentProps: {
                initialFormData: {
                  planDate: selectedDate.format('YYYY-MM-DD'),
                },
              },
            });
          }}
        >
          新建待办
        </CreateButton>
      }
      compactNav={
        mode === 'workbench' && usesCompactNav(mode) ? (
          <CompactViewNav
            viewId={growthIds.views.todo}
            children={children}
            activeTab={state.tab}
            onSelect={(tab) => setState({ tab: (tab as typeof state.tab) || 'today' })}
          />
        ) : null
      }
    >
      {state.tab === 'calendar' ? <TodoCalendar /> : null}
      {state.tab === 'all' ? <TodoAll /> : null}
      {state.tab === 'today' ? <TodoToday /> : null}
    </GrowthPage>
  );
}

export default function TodoFeature() {
  return (
    <AgendaProvider>
      <TodoPageContent />
    </AgendaProvider>
  );
}
