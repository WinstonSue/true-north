import { registerIpcHandlers } from 'electron-ipc-restful';
import { GoalController } from '../service/growth/goal/goal.controller';
import { HabitController } from '../service/growth/habit/habit.controller';
import { TaskController } from '../service/growth/task/task.controller';
import { TodoController } from '../service/growth/todo/todo.controller';
import { TrackTimeController } from '../service/growth/track-time/track-time.controller';

/**
 * 初始化所有 IPC 处理器
 */
export function initIpcRouter(): void {
  registerIpcHandlers({
    controllers: [GoalController, HabitController, TaskController, TodoController, TrackTimeController],
  });
}
