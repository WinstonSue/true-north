import type { ReactNode } from 'react';
import { Clock, Sprout } from 'lucide-react';
import { Tooltip } from '@sue/design-web-react';
import { defineRendererImplementation, parsePluginResourceUri } from '@true-north/plugin-sdk';
import { useHostActions } from '@true-north/plugin-sdk/renderer';
import { useEffect } from 'react';
import { growthManifest } from '../manifest';
import { growthIds } from '../contract';
import { growthLocales } from './locales';
import { goalDecomposeTool, taskDecomposeTool } from './contributions/ai-decomposition/tools';
import { FocusTimerProvider, useFocusTimer } from './pages/focus-timer';
import { TaskDrawerHost } from './pages/task/detail/TaskDrawer';
import { bindPluginIpc } from '../client';

function FocusTimerSlot({ children }: { children?: ReactNode }) {
  return <FocusTimerProvider>{children}</FocusTimerProvider>;
}

function TaskDrawerSlot() {
  return <TaskDrawerHost />;
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
        views: {
          todo: { load: () => import('./features/todo') },
          task: { load: () => import('./features/task') },
          habit: { load: () => import('./features/habit') },
          goal: { load: () => import('./features/goal') },
        },
        workbench: {
          workspaces: {
            goalDecompose: goalDecomposeTool,
            taskDecompose: taskDecomposeTool,
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
            return { viewId: growthIds.views.goal, params: { tab: 'tree', id: parsed.id } };
          }
          if (parsed.collection === 'tasks') {
            return { viewId: growthIds.views.task, params: { id: parsed.id } };
          }
          if (parsed.collection === 'habits') {
            return { viewId: growthIds.views.habit, params: { tab: 'detail', id: parsed.id } };
          }
          if (parsed.collection === 'todos') {
            return { viewId: growthIds.views.todo, params: {} };
          }
          return null;
        },
      };
    },
  });
}
