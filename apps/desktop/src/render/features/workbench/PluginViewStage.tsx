import { useMemo } from 'react';
import { useRendererPlatform } from '@true-north/plugin-sdk/renderer';
import { PluginViewFrame } from '@/plugin/PluginViewFrame';
import { useWorkbench } from './context';
import type { WorkbenchPluginViewTab } from './context';
import styles from './style.module.less';

export function PluginViewStage({ tab }: { tab: WorkbenchPluginViewTab }) {
  const views = useRendererPlatform().workbenchViews || [];
  const { updatePluginViewParams } = useWorkbench();
  const view = useMemo(() => views.find((item) => item.id === tab.viewId), [tab.viewId, views]);

  if (!view) {
    return <p className={styles.toolStageError}>未知插件功能：{tab.viewId}</p>;
  }

  return (
    <div className={styles.pluginStage}>
      <PluginViewFrame
        pluginId={view.pluginId}
        snapshot={{ viewId: tab.viewId, params: tab.params || {} }}
        revision={tab.revision}
        mode="workbench"
        load={view.load}
        onParamsChange={(params) => updatePluginViewParams(tab.viewId, params)}
      />
    </div>
  );
}
