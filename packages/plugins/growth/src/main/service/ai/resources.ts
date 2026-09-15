import type { PluginResourceProvider } from '@true-north/plugin-sdk';
import { pluginResourceUri } from '@true-north/plugin-contract';
import { store } from '../../storage';
import { Goal } from '../goal/goal.entity';
import { Task } from '../task/task.entity';

function parseId(uri: string, collection: string) {
  const prefix = `tn://growth/${collection}/`;
  return uri.startsWith(prefix) ? uri.slice(prefix.length) : null;
}

export const growthGoalResource: PluginResourceProvider = {
  async list() {
    const rows = await store().getRepository(Goal).find();
    return rows.map((row) => ({
      uri: pluginResourceUri('growth', 'goals', row.id),
      name: row.name,
      mimeType: 'application/json',
    }));
  },
  async read(uri) {
    const id = parseId(uri, 'goals');
    if (!id) return null;
    const row = await store().getRepository(Goal).findOne({ where: { id } });
    if (!row) return null;
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify({ id: row.id, name: row.name, status: row.status }),
    };
  },
};

export const growthTaskResource: PluginResourceProvider = {
  async list() {
    const rows = await store().getRepository(Task).find();
    return rows.map((row) => ({
      uri: pluginResourceUri('growth', 'tasks', row.id),
      name: row.name,
      mimeType: 'application/json',
    }));
  },
  async read(uri) {
    const id = parseId(uri, 'tasks');
    if (!id) return null;
    const row = await store().getRepository(Task).findOne({ where: { id } });
    if (!row) return null;
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify({ id: row.id, name: row.name, status: row.status }),
    };
  },
};
