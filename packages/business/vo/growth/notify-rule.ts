export const PLAN_START_TOKEN = 'planStart';

export type TodoNotifyRule = {
  overdueTimes: string[];
  todayTimes: string[];
};

export type TaskNotifyRule = {
  overdueTimes: string[];
  currentTimes: string[];
};

export type HabitNotifyRule = {
  times: string[];
};

export type GrowthNotifySettings = {
  todo: TodoNotifyRule;
  task: TaskNotifyRule;
  habit: HabitNotifyRule;
};

export const DEFAULT_GROWTH_NOTIFY_SETTINGS: GrowthNotifySettings = {
  todo: { overdueTimes: ['08:00', '21:00'], todayTimes: [PLAN_START_TOKEN, '21:00'] },
  task: { overdueTimes: ['08:00', '21:00'], currentTimes: [PLAN_START_TOKEN] },
  habit: { times: ['21:00'] },
};
