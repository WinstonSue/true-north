import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { app } from 'electron';
import path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from '../users/user.entity';
import { Goal } from '../growth/goal/goal.entity';
import { Habit } from '../growth/habit/habit.entity';
import { Task } from '../growth/task/task.entity';
import { Todo } from '../growth/todo/todo.entity';
import { TodoRepeat } from '../growth/todo/todo-repeat.entity';
import { TrackTime } from '../growth/track-time/entity';

const getDatabasePath = () => {
  if (process.env.NODE_ENV === 'development') {
    return path.join(process.cwd(), 'database.sqlite');
  } else {
    try {
      return path.join(app.getPath('userData'), 'true-north.db');
    } catch (error) {
      return path.join(process.cwd(), 'true-north.db');
    }
  }
};

const databasePath = getDatabasePath();

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: databasePath,
  synchronize: true,
  logging: process.env.NODE_ENV === 'development' ? ['error'] : undefined,
  entities: [User, Goal, Task, Todo, TodoRepeat, Habit, TrackTime],
  migrations: [],
  subscribers: [],
  namingStrategy: new SnakeNamingStrategy(),
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('数据库连接已建立', databasePath);
    }
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  try {
    if (AppDataSource.isInitialized) {
      const closePromise = AppDataSource.destroy();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('数据库关闭超时')), 5000);
      });

      await Promise.race([closePromise, timeoutPromise]);
      console.log('数据库连接已关闭');
    }
  } catch (error) {
    console.error('关闭数据库连接失败:', error);
    if (AppDataSource.isInitialized) {
      try {
        (AppDataSource as any).isInitialized = false;
      } catch (e) {
        // ignore
      }
    }
  }
};
