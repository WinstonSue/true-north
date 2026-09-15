import { usePluginRuntime } from '@true-north/plugin-sdk/renderer';
import { activeNavState, growthNavigation, locationForNavChild } from './nav';
import styles from './GrowthNavigation.module.less';

export function GrowthNavigation(props: {
  location: Record<string, string>;
  navigate: (next: Record<string, string>) => void;
}) {
  const { locale } = usePluginRuntime();
  const active = activeNavState(props.location);

  return (
    <nav className={styles.nav} aria-label={locale.t('menu.growth')}>
      {growthNavigation.map((group) => (
        <div key={group.view} className={styles.group}>
          <div className={styles.groupName}>{locale.t(group.nameKey)}</div>
          {group.children.map((child) => {
            const selected =
              active.group.view === group.view &&
              (active.child?.nameKey === child.nameKey || (!active.child && !child.tab));
            return (
              <button
                key={child.nameKey}
                type="button"
                className={`${styles.item}${selected ? ` ${styles.itemActive}` : ''}`}
                onClick={() => props.navigate(locationForNavChild(group.view, child))}
              >
                {locale.t(child.nameKey)}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
