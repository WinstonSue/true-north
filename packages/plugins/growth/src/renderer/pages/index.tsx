import { Flex } from '@sue/design-web-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import type { GrowthArea } from '@true-north/plugin-growth/contract';
import { growthHref } from '@true-north/plugin-growth/contract';
import { useLocale } from '@true-north/plugin-sdk/renderer';
import TodoFeature from '../features/todo';
import TaskFeature from '../features/task';
import HabitFeature from '../features/habit';
import GoalFeature from '../features/goal';
import { useGrowthView } from './view';
import styles from './GrowthApp.module.less';

const AREAS: Array<{ area: GrowthArea; nameKey: string }> = [
  { area: 'todo', nameKey: 'menu.todo' },
  { area: 'task', nameKey: 'menu.task' },
  { area: 'habit', nameKey: 'menu.habit' },
  { area: 'goal', nameKey: 'menu.goal' },
];

export default function GrowthApp() {
  const t = useLocale();
  const navigate = useNavigate();
  const { area, tab, id } = useGrowthView();

  return (
    <Flex vertical container="full" className={styles.page}>
      <Flex align="center" gap={4} className={styles.tabs}>
        {AREAS.map((item) => {
          const active = area === item.area;
          return (
            <button
              key={item.area}
              type="button"
              className={clsx(styles.tab, active && styles.tabActive)}
              onClick={() => {
                if (!active) navigate(growthHref({ area: item.area }));
              }}
            >
              {t[item.nameKey] || item.nameKey}
            </button>
          );
        })}
      </Flex>
      <Flex vertical container="fill" className={styles.stage}>
        {area === 'todo' ? (
          <TodoFeature tab={tab} onTabChange={(next) => navigate(growthHref({ area: 'todo', tab: next }))} />
        ) : null}
        {area === 'task' ? (
          <TaskFeature tab={tab} onTabChange={(next) => navigate(growthHref({ area: 'task', tab: next }))} />
        ) : null}
        {area === 'habit' ? (
          <HabitFeature
            tab={tab}
            id={id}
            onViewChange={(next) => navigate(growthHref({ area: 'habit', tab: next.tab, id: next.id }))}
          />
        ) : null}
        {area === 'goal' ? <GoalFeature /> : null}
      </Flex>
    </Flex>
  );
}
