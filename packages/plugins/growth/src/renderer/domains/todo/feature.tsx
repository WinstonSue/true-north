'use client';

import { Button, Dropdown, Space } from '@sue/design-web-react';
import { HOST_AI_START } from '@true-north/plugin-sdk';
import { useHostActions, usePluginViewRuntime, usePluginViewState } from '@true-north/plugin-sdk/renderer';
import { ChevronDown, Plus } from 'lucide-react';
import { useTodoDetail } from './detail';
import { AgendaProvider, useAgendaDate } from '../../shared/agenda/context';
import { todoViewCodec } from '../../../contract/view-state';
import TodoToday from './today';
import TodoCalendar from './calendar';
import TodoAll from './all';
import { GrowthPage } from '../../ui/GrowthPage';
import { CompactViewNav } from '../../ui/CompactViewNav';
import { compactNavItems, usesCompactNav } from '../../shared/navigation';

function TodoPageContent() {
  const { mode } = usePluginViewRuntime();
  const [state, setState] = usePluginViewState(todoViewCodec);
  const { openCreateDrawer } = useTodoDetail();
  const { selectedDate } = useAgendaDate();
  const hostActions = useHostActions();
  const openManualCreate = () => {
    openCreateDrawer({
      contentProps: {
        initialFormData: {
          planDate: selectedDate.format('YYYY-MM-DD'),
        },
      },
    });
  };

  return (
    <GrowthPage
      extra={
        <Space.Compact>
          <Button type="primary" icon={<Plus size={14} />} onClick={openManualCreate}>
            新建待办
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
                    void hostActions.invoke(HOST_AI_START, { message: '请帮我创建一条待办' });
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
            items={compactNavItems('todo')}
            activeKey={state.tab}
            onSelect={(tab) => setState({ tab: tab as typeof state.tab })}
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
