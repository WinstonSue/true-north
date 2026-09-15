import { usePluginRuntime } from '@true-north/plugin-sdk/renderer';
import { locationForNavChild, defaultTabForView, localViewFromViewId, type GrowthNavChild } from '../layout/nav';
import styles from './CompactViewNav.module.less';

export function CompactViewNav(props: {
  viewId: string;
  children: GrowthNavChild[];
  activeTab?: string;
  onSelect: (tab?: string) => void;
}) {
  const { locale } = usePluginRuntime();
  return (
    <div className={styles.bar} role="tablist">
      {props.children.map((child) => {
        const current = props.activeTab || defaultTabForView(props.viewId);
        const tab = child.tab || defaultTabForView(props.viewId);
        const active = current === tab;
        const location = locationForNavChild(localViewFromViewId(props.viewId), child);
        return (
          <button
            key={child.nameKey}
            type="button"
            role="tab"
            aria-selected={active}
            className={`${styles.item}${active ? ` ${styles.itemActive}` : ''}`}
            onClick={() => props.onSelect(location.tab)}
          >
            {locale.t(child.nameKey)}
          </button>
        );
      })}
    </div>
  );
}
