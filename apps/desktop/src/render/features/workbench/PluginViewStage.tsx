import { useMemo } from 'react';
import { useRendererPlatform } from '@true-north/plugin-sdk/renderer';
import { PluginViewFrame } from '@/plugin/PluginViewFrame';
import { useWorkbench } from './context';
import type { WorkbenchPluginViewTab } from './context';
import styles from './style.module.less';

export function PluginViewStage({ tab }: { tab: WorkbenchPluginViewTab }) {
  const newTabs = useRendererPlatform().workbenchNewTabs || [];
  const { updatePluginViewParams } = useWorkbench();
  const spec = useMemo(() => newTabs.find((item) => item.id === tab.viewId), [tab.viewId, newTabs]);

  if (!spec) {
    return <p className={styles.toolStageError}>未知工作台页：{tab.viewId}</p>;
  }

  return (
    <div className={styles.pluginStage}>
      <PluginViewFrame
        pluginId={spec.pluginId}
        snapshot={{ viewId: tab.viewId, params: tab.params || {} }}
        revision={tab.revision}
        mode="workbench"
        load={spec.load}
        onParamsChange={(params) => updatePluginViewParams(tab.viewId, params)}
      />
    </div>
  );
}
