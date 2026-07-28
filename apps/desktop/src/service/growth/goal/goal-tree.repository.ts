import { TreeRepository } from 'typeorm';
import { AppDataSource } from '../../db/database.config';
import { Goal } from './goal.entity';
import type { GoalTreeRepository as IGoalTreeRepository } from './goal.repository';

export class GoalTreeRepository implements IGoalTreeRepository {
  repo: TreeRepository<Goal> = AppDataSource.getTreeRepository(Goal);

  async findRoots(): Promise<Goal[]> {
    return await this.repo.findRoots();
  }

  async findDescendants(entity: Goal): Promise<Goal[]> {
    return await this.repo.findDescendants(entity);
  }

  async findAncestors(entity: Goal): Promise<Goal[]> {
    return await this.repo.findAncestors(entity);
  }

  async findDescendantsTree(entity: Goal): Promise<Goal> {
    return await this.repo.findDescendantsTree(entity);
  }
}
