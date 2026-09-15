'use client';

import { TabsPage } from '@true-north/plugin-ui';
import { CreateButton } from '@true-north/plugin-ui';
import { useTodoDetail } from '../pages/components';
import { AgendaProvider, useAgendaDate } from '../pages/components/day-agenda/context';
import { usePluginViewState } from '@true-north/plugin-sdk/renderer';
import { todoViewCodec } from '../../contract/view-state';
import TodoToday from '../pages/todo/todo-today';
import TodoCalendar from '../pages/todo/todo-calendar';
import TodoAll from '../pages/todo/todo-all';

const TODO_TABS = [
  { tab: 'today' as const, name: '当前待办' },
  { tab: 'calendar' as const, name: '待办日历' },
  { tab: 'all' as const, name: '全部待办' },
];

function TodoPageContent() {
  const [state, setState] = usePluginViewState(todoViewCodec);
  const { openCreateDrawer } = useTodoDetail();
  const { selectedDate } = useAgendaDate();

  return (
    <TabsPage
      tabs={TODO_TABS.map((item) => ({
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
                  planDate: selectedDate.format('YYYY-MM-DD'),
                },
              },
            });
          }}
        >
          新建待办
        </CreateButton>
      }
    >
      {state.tab === 'calendar' ? <TodoCalendar /> : null}
      {state.tab === 'all' ? <TodoAll /> : null}
      {state.tab === 'today' ? <TodoToday /> : null}
    </TabsPage>
  );
}

export default function TodoFeature() {
  return (
    <AgendaProvider>
      <TodoPageContent />
    </AgendaProvider>
  );
}
