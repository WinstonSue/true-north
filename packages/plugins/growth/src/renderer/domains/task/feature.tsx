'use client';

import { Button, Dropdown, Space } from '@sue/design-web-react';
import { HOST_AI_START } from '@true-north/plugin-sdk';
import { useHostActions, usePluginViewRuntime, usePluginViewState } from '@true-north/plugin-sdk/renderer';
import { ChevronDown, Plus } from 'lucide-react';
import { useTaskDetail } from './form';
import { AgendaProvider, useAgendaDate } from '../../shared/agenda/context';
import { taskViewCodec } from '../../../contract/view-state';
import { TaskDetailPane } from './detail/TaskDrawer';
import TaskToday from './today';
import TaskCalendar from './calendar';
import TaskAll from './all';
import { GrowthPage } from '../../ui/GrowthPage';
import { CompactViewNav } from '../../ui/CompactViewNav';
import { compactNavItems, usesCompactNav } from '../../shared/navigation';

function TaskPageContent() {
  const { mode } = usePluginViewRuntime();
  const [state, setState] = usePluginViewState(taskViewCodec);
  const { openCreateDrawer } = useTaskDetail();
  const { selectedDate } = useAgendaDate();
  const hostActions = useHostActions();
  const openManualCreate = () => {
    openCreateDrawer({
      contentProps: {
        initialFormData: {
          planTimeRange: [selectedDate.startOf('day'), selectedDate.endOf('day')],
        },
      },
    });
  };

  return (
    <GrowthPage
      extra={
        <Space.Compact>
          <Button type="primary" icon={<Plus size={14} />} onClick={openManualCreate}>
            新建任务
          </Button>
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                { key: 'manual', label: '手动创建', onClick: openManualCreate },
                {
                  key: 'ai',
                  label: '使用 AI 创建',
                  onClick: () => {
                    void hostActions.invoke(HOST_AI_START, { message: '请帮我创建一项任务' });
                  },
                },
              ],
            }}
          >
            <Button type="primary" aria-label="更多创建方式" icon={<ChevronDown size={14} />} />
          </Dropdown>
        </Space.Compact>
      }
      compactNav={
        mode === 'workbench' && usesCompactNav(mode) ? (
          <CompactViewNav
            items={compactNavItems('task')}
            activeKey={state.tab}
            onSelect={(tab) => setState({ tab: tab as typeof state.tab })}
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
