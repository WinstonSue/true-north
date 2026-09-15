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
    const grouped = new Map<string, { pluginId: string; nameKey: string; views: typeof platform.workbenchViews }>();
    for (const plugin of platform.plugins) {
      grouped.set(plugin.pluginId, { pluginId: plugin.pluginId, nameKey: plugin.nameKey, views: [] });
    }
    for (const view of [...(platform.workbenchViews || [])].sort((a, b) => (a.order || 0) - (b.order || 0))) {
      const bucket = grouped.get(view.pluginId) || {
        pluginId: view.pluginId,
        nameKey: view.pluginId,
        views: [],
      };
      bucket.views = [...(bucket.views || []), view];
      grouped.set(view.pluginId, bucket);
    }

    const groups = [...grouped.values()]
      .filter((group) => group.views?.length)
      .map((group) => ({
        type: 'group' as const,
        key: `plugin:${group.pluginId}`,
        label: t[group.nameKey] || group.nameKey,
        children: (group.views || []).map((view) => ({
          key: view.id,
          label: t[view.nameKey] || view.nameKey,
        })),
      }));

    return [
      { key: 'web', label: t['workbench.new-tab.web'] || '新网页' },
      ...(groups.length ? [{ type: 'divider' as const, key: 'divider' }, ...groups] : []),
    ];
  }, [platform.plugins, platform.workbenchViews, t]);

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
            const view = (platform.workbenchViews || []).find((item) => item.id === key);
            if (!view) return;
            void openPluginView({ viewId: view.id });
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
