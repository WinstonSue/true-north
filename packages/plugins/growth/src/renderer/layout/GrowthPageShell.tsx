import { useMemo, useState } from 'react';
import type { PluginPageProps } from '@true-north/plugin-sdk';
import { PluginViewRuntimeProvider } from '@true-north/plugin-sdk/renderer';
import { Flex } from '@sue/design-web-react';
import { PanelLeft } from 'lucide-react';
import TodoFeature from '../features/todo';
import TaskFeature from '../features/task';
import HabitFeature from '../features/habit';
import GoalFeature from '../features/goal';
import { GrowthNavigation } from './GrowthNavigation';
import { viewIdForLocal } from './nav';
import styles from './GrowthPageShell.module.less';
import '../ui/tokens.less';

const FEATURES = {
  todo: TodoFeature,
  task: TaskFeature,
  habit: HabitFeature,
  goal: GoalFeature,
} as const;

function featureFor(view: string) {
  return FEATURES[view as keyof typeof FEATURES] || FEATURES.todo;
}

export default function GrowthPageShell(props: PluginPageProps) {
  const [navOpen, setNavOpen] = useState(false);
  const view = props.location.view || 'todo';
  const Feature = featureFor(view);
  const params = useMemo(() => {
    const next = { ...props.location };
    delete next.view;
    return next;
  }, [props.location]);

  const navigate = (next: Record<string, string>) => {
    setNavOpen(false);
    props.navigate(next);
  };

  return (
    <Flex container="full" className={styles.shell}>
      <button
        type="button"
        className={styles.menuButton}
        aria-label="打开导航"
        onClick={() => setNavOpen(true)}
      >
        <PanelLeft size={16} />
      </button>
      {navOpen ? (
        <button type="button" className={styles.backdrop} aria-label="关闭导航" onClick={() => setNavOpen(false)} />
      ) : null}
      <Flex container="fixed" className={`${styles.nav}${navOpen ? ` ${styles.navOpen}` : ''}`}>
        <GrowthNavigation location={props.location} navigate={navigate} />
      </Flex>
      <Flex container="fill" className={styles.main}>
        <PluginViewRuntimeProvider
          value={{
            snapshot: { viewId: viewIdForLocal(view), params },
            revision: 0,
            mode: 'page',
            setParams: (next) => props.navigate({ ...next, view }),
          }}
        >
          <Feature />
        </PluginViewRuntimeProvider>
      </Flex>
    </Flex>
  );
}
