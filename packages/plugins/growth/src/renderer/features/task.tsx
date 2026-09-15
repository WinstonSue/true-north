'use client';

import { useState } from 'react';
import { TabsPage } from '@true-north/plugin-ui';
import { CreateButton } from '@true-north/plugin-ui';
import { useTaskDetail } from '../pages/components';
import { AgendaProvider, useAgendaDate } from '../pages/components/day-agenda/context';
import { growthHref } from '@true-north/plugin-growth/contract';
import type { GrowthTab } from '@true-north/plugin-growth/contract';
import { useWorkbenchViewRuntimeOptional } from '@true-north/plugin-sdk/renderer';
import { TaskDetailPane } from '../pages/task/detail/TaskDrawer';
import TaskToday from '../pages/task/task-today';
import TaskCalendar from '../pages/task/task-calendar';
import TaskAll from '../pages/task/task-all';

const TASK_TABS: Array<{ tab: Extract<GrowthTab, 'today' | 'calendar' | 'all'>; name: string }> = [
  { tab: 'today', name: '当前任务' },
  { tab: 'calendar', name: '任务日历' },
  { tab: 'all', name: '全部任务' },
];

function parseTaskTab(tab?: GrowthTab): Extract<GrowthTab, 'today' | 'calendar' | 'all'> {
  return tab === 'calendar' || tab === 'all' ? tab : 'today';
}

function TaskPageContent({
  tab,
  onSelectTab,
}: {
  tab: Extract<GrowthTab, 'today' | 'calendar' | 'all'>;
  onSelectTab: (tab: Extract<GrowthTab, 'today' | 'calendar' | 'all'>) => void;
}) {
  const { openCreateDrawer } = useTaskDetail();
  const { selectedDate } = useAgendaDate();
  const currentTab = parseTaskTab(tab);

  return (
    <TabsPage
      tabs={TASK_TABS.map((item) => ({
        name: item.name,
        key: item.tab,
        href: growthHref({ area: 'task', tab: item.tab }),
        active: currentTab === item.tab,
      }))}
      onSelect={(item) => onSelectTab(parseTaskTab(item.key as GrowthTab))}
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
      {currentTab === 'calendar' ? <TaskCalendar /> : null}
      {currentTab === 'all' ? <TaskAll /> : null}
      {currentTab === 'today' ? <TaskToday /> : null}
    </TabsPage>
  );
}

export default function TaskFeature({
  tab,
  onTabChange,
}: {
  tab?: GrowthTab;
  onTabChange?: (tab: GrowthTab) => void;
} = {}) {
  const viewRuntime = useWorkbenchViewRuntimeOptional();
  const focusedTaskId = viewRuntime?.target?.type === 'task' ? viewRuntime.target.id : undefined;
  const [localTab, setLocalTab] = useState<GrowthTab>(tab ?? 'today');
  const currentTab = parseTaskTab(tab ?? localTab);

  if (focusedTaskId) {
    return (
      <TaskDetailPane
        key={`${focusedTaskId}:${viewRuntime?.generation ?? 0}`}
        taskId={focusedTaskId}
        compact
        onClose={() => viewRuntime?.clearTarget()}
      />
    );
  }

  return (
    <AgendaProvider>
      <TaskPageContent
        tab={currentTab}
        onSelectTab={(next) => {
          if (onTabChange) onTabChange(next);
          else setLocalTab(next);
        }}
      />
    </AgendaProvider>
  );
}
