import { usePluginRuntime } from '@true-north/plugin-sdk/renderer';
import styles from './CompactViewNav.module.less';

export function CompactViewNav(props: {
  items: { key: string; labelKey: string }[];
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  const { locale } = usePluginRuntime();
  return (
    <div className={styles.bar} role="tablist">
      {props.items.map((item) => {
        const active = props.activeKey === item.key;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            className={`${styles.item}${active ? ` ${styles.itemActive}` : ''}`}
            onClick={() => props.onSelect(item.key)}
          >
            {locale.t(item.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
