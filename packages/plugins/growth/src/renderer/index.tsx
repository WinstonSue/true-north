import type { ReactNode } from 'react';
import { Clock, Sprout } from 'lucide-react';
import { Tooltip } from '@sue/design-web-react';
import { defineRendererImplementation, parsePluginResourceUri } from '@true-north/plugin-sdk';
import { useHostActions } from '@true-north/plugin-sdk/renderer';
import { useEffect } from 'react';
import { growthManifest } from '../manifest';
import { growthLocales } from './locales';
import { goalDecomposeTool, taskDecomposeTool } from './contributions/ai-decomposition/tools';
import { suggestTodoTool } from './contributions/suggest/tool';
import { FocusTimerProvider, useFocusTimer } from './runtime/focus-timer';
import { GrowthDrawerHost } from './runtime/drawer';
import { bindPluginIpc } from '../client';

function FocusTimerSlot({ children }: { children?: ReactNode }) {
  return <FocusTimerProvider>{children}</FocusTimerProvider>;
}

function TaskDrawerSlot() {
  return <GrowthDrawerHost />;
}

function FocusActionSlot() {
  const { open } = useFocusTimer();
  const hostActions = useHostActions();
  useEffect(() => hostActions.register('growth.open-focus', (input) => open(input as never)), [hostActions, open]);
  return (
    <Tooltip title="打开专注计时" placement="right">
      <button type="button" aria-label="打开专注计时" onClick={() => open()}>
        <Clock size={16} />
      </button>
    </Tooltip>
  );
}

export function createRenderer() {
  return defineRendererImplementation(growthManifest, {
    activate(ctx) {
      bindPluginIpc(ctx.ipc);
      return {
        icon: Sprout,
        locales: [growthLocales],
        hub: {
          load: () => import('./layout/GrowthPageShell'),
        },
        workbench: {
          workspaces: {
            goalDecompose: goalDecomposeTool,
            taskDecompose: taskDecomposeTool,
            suggestTodo: suggestTodoTool,
          },
        },
        shell: {
          slots: {
            focusTimer: { render: FocusTimerSlot },
            taskDrawer: { render: TaskDrawerSlot },
            focusAction: { render: FocusActionSlot },
          },
        },
        openResource(uri) {
          const parsed = parsePluginResourceUri(uri);
          if (!parsed || parsed.pluginId !== 'growth' || !parsed.id) return null;
          if (parsed.collection === 'goals') {
            return { pluginId: 'growth', location: { view: 'goal', tab: 'tree', id: parsed.id } };
          }
          if (parsed.collection === 'tasks') {
            return { pluginId: 'growth', location: { view: 'task', id: parsed.id } };
          }
          if (parsed.collection === 'todos') {
            return { pluginId: 'growth', location: { view: 'todo' } };
          }
          return null;
        },
      };
    },
  });
}
