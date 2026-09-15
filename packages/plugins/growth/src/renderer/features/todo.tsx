'use client';

import { useState } from 'react';
import { TabsPage } from '@true-north/plugin-ui';
import { CreateButton } from '@true-north/plugin-ui';
import { useTodoDetail } from '../pages/components';
import { AgendaProvider, useAgendaDate } from '../pages/components/day-agenda/context';
import { growthHref } from '@true-north/plugin-growth/contract';
import type { GrowthTab } from '@true-north/plugin-growth/contract';
import TodoToday from '../pages/todo/todo-today';
import TodoCalendar from '../pages/todo/todo-calendar';
import TodoAll from '../pages/todo/todo-all';

const TODO_TABS: Array<{ tab: Extract<GrowthTab, 'today' | 'calendar' | 'all'>; name: string }> = [
  { tab: 'today', name: '当前待办' },
  { tab: 'calendar', name: '待办日历' },
  { tab: 'all', name: '全部待办' },
];

function parseTodoTab(tab?: GrowthTab): Extract<GrowthTab, 'today' | 'calendar' | 'all'> {
  return tab === 'calendar' || tab === 'all' ? tab : 'today';
}

function TodoPageContent({
  tab,
  onSelectTab,
}: {
  tab: Extract<GrowthTab, 'today' | 'calendar' | 'all'>;
  onSelectTab: (tab: Extract<GrowthTab, 'today' | 'calendar' | 'all'>) => void;
}) {
  const { openCreateDrawer } = useTodoDetail();
  const { selectedDate } = useAgendaDate();
  const currentTab = parseTodoTab(tab);

  return (
    <TabsPage
      tabs={TODO_TABS.map((item) => ({
        name: item.name,
        key: item.tab,
        href: growthHref({ area: 'todo', tab: item.tab }),
        active: currentTab === item.tab,
      }))}
      onSelect={(item) => onSelectTab(parseTodoTab(item.key as GrowthTab))}
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
      {currentTab === 'calendar' ? <TodoCalendar /> : null}
      {currentTab === 'all' ? <TodoAll /> : null}
      {currentTab === 'today' ? <TodoToday /> : null}
    </TabsPage>
  );
}

export default function TodoFeature({
  tab,
  onTabChange,
}: {
  tab?: GrowthTab;
  onTabChange?: (tab: GrowthTab) => void;
} = {}) {
  const [localTab, setLocalTab] = useState<GrowthTab>(tab ?? 'today');
  const currentTab = parseTodoTab(tab ?? localTab);

  return (
    <AgendaProvider>
      <TodoPageContent
        tab={currentTab}
        onSelectTab={(next) => {
          if (onTabChange) onTabChange(next);
          else setLocalTab(next);
        }}
      />
    </AgendaProvider>
  );
}
