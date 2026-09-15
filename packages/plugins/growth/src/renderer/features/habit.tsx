import { useCallback, useState } from 'react';
import { Flex } from '@sue/design-web-react';
import type { GrowthTab } from '@true-north/plugin-growth/contract';
import { HabitContext } from '../pages/habit/context';
import { HabitVo } from '@true-north/vo';
import HabitList from '../pages/habit/habit-list';
import HabitDetailPage from '../pages/habit/habit-detail';

export default function HabitFeature({
  tab,
  id,
  onViewChange,
}: {
  tab?: GrowthTab;
  id?: string;
  onViewChange?: (next: { tab: GrowthTab; id?: string }) => void;
} = {}) {
  const [localTab, setLocalTab] = useState<GrowthTab>(tab ?? 'list');
  const [localId, setLocalId] = useState<string | undefined>(id);
  const [selectedHabit, setSelectedHabit] = useState<HabitVo | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const currentTab = tab ?? localTab;
  const currentId = id ?? localId;

  const refreshHabits = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const changeView = useCallback(
    (next: { tab: GrowthTab; id?: string }) => {
      if (onViewChange) {
        onViewChange(next);
        return;
      }
      setLocalTab(next.tab);
      setLocalId(next.id);
    },
    [onViewChange],
  );

  return (
    <HabitContext.Provider
      value={{
        selectedHabit,
        setSelectedHabit,
        refreshHabits,
        openDetail: (habitId) => changeView({ tab: 'detail', id: habitId }),
        openList: () => changeView({ tab: 'list' }),
      }}
    >
      <Flex key={refreshKey} vertical container="full" className="min-h-0">
        {currentTab === 'detail' && currentId ? <HabitDetailPage id={currentId} /> : <HabitList />}
      </Flex>
    </HabitContext.Provider>
  );
}
