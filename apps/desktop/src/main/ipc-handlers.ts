import { registerIpcHandlers } from 'electron-ipc-restful';
import { GoalController } from '../growth/goal/goal.controller';
import { HabitController } from '../growth/habit/habit.controller';
import { TaskController } from '../growth/task/task.controller';
import { TodoController } from '../growth/todo/todo.controller';
import { TrackTimeController } from '../growth/track-time/track-time.controller';

/**
 * 初始化所有 IPC 处理器
 */
export function initIpcRouter(): void {
  registerIpcHandlers({
    controllers: [GoalController, HabitController, TaskController, TodoController, TrackTimeController],
  });
}
