import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { app } from 'electron';
import path from 'path';
import sqlite3 from 'sqlite3';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { HabitStatus, TaskStatus, TodoRelatedType } from '@true-north/enum';
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
      await repairGrowthV010BeforeSynchronize();
      await AppDataSource.initialize();
      await migrateGrowthV010();
      console.log('数据库连接已建立', databasePath);
    }
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
};

/**
 * TypeORM copies existing rows into a temporary table while synchronizing the
 * new Goal and Task schemas. Legacy values must be normalized before their
 * new CHECK and NOT NULL constraints are applied.
 */
async function repairGrowthV010BeforeSynchronize(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const database = new sqlite3.Database(databasePath, (openError) => {
      if (openError) {
        reject(openError);
        return;
      }

      database.all(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('goal', 'task', 'habit', 'todo')",
        (tableError, tables: Array<{ name: string }>) => {
          if (tableError) {
            database.close(() => reject(tableError));
            return;
          }
          const tableNames = new Set(tables.map((table) => table.name));
          const updates: string[] = [];
          if (tableNames.has('task')) {
            updates.push(`UPDATE task SET status = '${TaskStatus.TODO}' WHERE status IS NULL OR status = ''`);
          }
          if (tableNames.has('goal')) {
            // Legacy tables only allow objective/key_result. Disable the old
            // CHECK while replacing those values with the v0.1.0 enum.
            updates.push('PRAGMA ignore_check_constraints = ON');
            updates.push("UPDATE goal SET type = 'vision' WHERE type = 'objective'");
            updates.push("UPDATE goal SET type = 'result' WHERE type = 'key_result'");
            updates.push('PRAGMA ignore_check_constraints = OFF');
          }
          if (tableNames.has('habit')) {
            updates.push('PRAGMA ignore_check_constraints = ON');
            updates.push("UPDATE habit SET status = 'active' WHERE status IN ('todo', 'doing') OR status IS NULL OR status = ''");
            updates.push("UPDATE habit SET status = 'completed' WHERE status = 'done'");
            updates.push('PRAGMA ignore_check_constraints = OFF');
          }
          if (tableNames.has('todo')) {
            updates.push(`UPDATE todo SET related_type = '${TodoRelatedType.NONE}' WHERE related_type = 'manual' OR related_type IS NULL OR related_type = ''`);
          }

          if (!updates.length) {
            database.close((closeError) => (closeError ? reject(closeError) : resolve()));
            return;
          }

          database.exec(updates.join(';'), (updateError) => {
            database.close((closeError) => {
              if (updateError) reject(updateError);
              else if (closeError) reject(closeError);
              else resolve();
            });
          });
        }
      );
    });
  });
}

/** v0.1.0 data migration after TypeORM schema synchronization. */
async function migrateGrowthV010(): Promise<void> {
  await AppDataSource.query(
    "UPDATE task SET estimate_time = NULL WHERE estimate_time IS NOT NULL AND CAST(estimate_time AS TEXT) GLOB '*[^0-9]*'"
  );
}

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
