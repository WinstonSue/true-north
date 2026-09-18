import { useMemo, useState } from 'react';
import { Dropdown } from '@sue/design-web-react';
import { Plus } from 'lucide-react';
import { useRendererPlatform } from '@true-north/plugin-sdk/renderer';
import useLocale from '@/utils/useLocale';
import { useWorkbench } from './context';
import styles from './style.module.less';

type MenuInfo = { key: string };

export function NewTabPicker({ 'data-product-ref': productRefAttr }: { 'data-product-ref'?: string }) {
  const t = useLocale();
  const { createTab, openPluginView } = useWorkbench();
  const platform = useRendererPlatform();
  const [open, setOpen] = useState(false);

  const items = useMemo(() => {
    const grouped = new Map<string, { pluginId: string; nameKey: string; tabs: typeof platform.workbenchNewTabs }>();
    for (const plugin of platform.plugins) {
      grouped.set(plugin.pluginId, { pluginId: plugin.pluginId, nameKey: plugin.nameKey, tabs: [] });
    }
    for (const tab of [...(platform.workbenchNewTabs || [])].sort((a, b) => (a.order || 0) - (b.order || 0))) {
      const bucket = grouped.get(tab.pluginId) || {
        pluginId: tab.pluginId,
        nameKey: tab.pluginId,
        tabs: [],
      };
      bucket.tabs = [...(bucket.tabs || []), tab];
      grouped.set(tab.pluginId, bucket);
    }

    const groups = [...grouped.values()]
      .filter((group) => group.tabs?.length)
      .map((group) => ({
        type: 'group' as const,
        key: `plugin:${group.pluginId}`,
        label: t[group.nameKey] || group.nameKey,
        children: (group.tabs || []).map((tab) => ({
            key: tab.id,
          label: t[tab.nameKey] || tab.nameKey,
        })),
      }));

    return [
      { key: 'web', label: t['workbench.new-tab.web'] || '新网页' },
      ...(groups.length ? [{ type: 'divider' as const, key: 'divider' }, ...groups] : []),
    ];
  }, [platform.plugins, platform.workbenchNewTabs, t]);

  return (
    <span data-product-ref={productRefAttr}>
      <Dropdown
        trigger={['click']}
        open={open}
        onOpenChange={setOpen}
        menu={{
          items,
          onClick: ({ key }: MenuInfo) => {
            setOpen(false);
            if (key === 'web') {
              void createTab();
              return;
            }
            const tab = (platform.workbenchNewTabs || []).find((item) => item.id === key);
            if (!tab) return;
            void openPluginView({ viewId: tab.id, params: {} });
          },
        }}
      >
        <button type="button" className={styles.iconBtn} aria-label={t['workbench.new-tab'] || '新标签'}>
          <Plus size={16} />
        </button>
      </Dropdown>
    </span>
  );
}
