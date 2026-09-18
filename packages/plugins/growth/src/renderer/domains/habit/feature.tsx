import { useCallback, useState } from 'react';
import { Flex } from '@sue/design-web-react';
import { usePluginViewState } from '@true-north/plugin-sdk/renderer';
import { habitViewCodec } from '../../../contract/view-state';
import { HabitContext } from './context';
import { HabitVo } from '@true-north/vo';
import HabitList from './list';
import HabitDetailPage from './detail';

export default function HabitFeature() {
  const [state, setState] = usePluginViewState(habitViewCodec);
  const [selectedHabit, setSelectedHabit] = useState<HabitVo | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshHabits = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <HabitContext.Provider
      value={{
        selectedHabit,
        setSelectedHabit,
        refreshHabits,
        openDetail: (habitId) => setState({ tab: 'detail', id: habitId }),
        openList: () => setState({ tab: 'list' }),
      }}
    >
      <Flex key={refreshKey} vertical container="full" className="min-h-0">
        {state.tab === 'detail' && state.id ? <HabitDetailPage id={state.id} /> : <HabitList />}
      </Flex>
    </HabitContext.Provider>
  );
}
