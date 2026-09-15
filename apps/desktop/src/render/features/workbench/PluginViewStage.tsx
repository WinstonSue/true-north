import { useMemo } from 'react';
import {
  useRendererPlatform,
  WorkbenchViewRuntimeProvider,
} from '@true-north/plugin-sdk/renderer';
import { PluginLazyStage } from '@/plugin/PluginStage';
import { useWorkbench } from './context';
import type { WorkbenchPluginViewTab } from './context';
import styles from './style.module.less';

export function PluginViewStage({ tab }: { tab: WorkbenchPluginViewTab }) {
  const views = useRendererPlatform().workbenchViews || [];
  const { clearPluginViewTarget } = useWorkbench();
  const view = useMemo(() => views.find((item) => item.id === tab.viewId), [tab.viewId, views]);

  if (!view) {
    return <p className={styles.toolStageError}>未知插件功能：{tab.viewId}</p>;
  }

  return (
    <div className={styles.pluginStage}>
      <WorkbenchViewRuntimeProvider
        value={{
          viewId: tab.viewId,
          target: tab.target ?? null,
          generation: tab.targetGeneration ?? 0,
          clearTarget: () => clearPluginViewTarget(tab.viewId),
        }}
      >
        <PluginLazyStage pluginId={view.pluginId} load={view.load} />
      </WorkbenchViewRuntimeProvider>
    </div>
  );
}
