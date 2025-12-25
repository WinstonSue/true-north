import { useState } from 'react';
import dayjs from 'dayjs';

export const useTodoHooks = () => {
  const [today, setToday] = useState(dayjs().format('YYYY-MM-DD'));
  const [yesterday, setYesterday] = useState(
    dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
  );
  const [weekStart, setWeekStart] = useState(
    dayjs().startOf('week').format('YYYY-MM-DD'),
  );
  const [weekEnd, setWeekEnd] = useState(
    dayjs().endOf('week').format('YYYY-MM-DD'),
  );

  return {
    today,
    yesterday,
    weekStart,
    weekEnd,
  };
};
