import { z } from 'zod';
import type { AgentTool, PluginResourceProvider } from '@true-north/plugin-sdk';
import { contributionKey, pluginResourceUri } from '@true-north/plugin-contract';
import { store } from '../storage';
import { InventoryItem } from './item.entity';
import { InventoryLocation } from './location.entity';
import { InventoryMovement } from './movement.entity';
import { InventoryBalance } from './balance.entity';
import { isLowStock, restockQuantity } from './stock';

export const inventorySuggestItemKey = contributionKey('inventory', 'suggestItem');
export const inventorySuggestMovementKey = contributionKey('inventory', 'suggestMovement');

const itemSchema = z.object({
  title: z.string().min(1),
  category: z.string().optional(),
  unit: z.string().optional(),
  minStock: z.coerce.number().optional(),
  targetStock: z.coerce.number().optional(),
  quantity: z.coerce.number().optional(),
  locationName: z.string().optional(),
  note: z.string().optional(),
});

const movementSchema = z.object({
  itemId: z.string().min(1),
  type: z.enum(['inbound', 'outbound', 'adjust']),
  quantity: z.coerce.number().optional(),
  targetQuantity: z.coerce.number().optional(),
  locationId: z.string().optional(),
  locationName: z.string().optional(),
  note: z.string().optional(),
});

export const suggestItemTool: AgentTool = {
  name: 'suggest_item',
  description:
    '把可储存、可计量、可定位的家庭实物主档理解成建议工作台。不要创建实体。「家里滤芯剩1个，低于2个要补到4个」才用这个工具。票务、服务、预约、订阅、数字权益和单纯「提醒我购买」不要用这个工具。「9月17日提醒我购买汕头到深圳的高铁票」和「提醒我买两盒滤芯」不要用这个工具。',
  parameters: {
    type: 'object',
    properties: {
      title: { type: 'string', description: '物资名称，例如滤芯' },
      category: { type: 'string' },
      unit: { type: 'string' },
      minStock: { type: 'number', description: '库存下限' },
      targetStock: { type: 'number', description: '目标量' },
      quantity: { type: 'number', description: '若同时要记下当前数量' },
      locationName: { type: 'string' },
      note: { type: 'string' },
    },
    required: ['title'],
  },
  schema: itemSchema,
  async execute(args, ctx) {
    const parsed = itemSchema.parse(args);
    const workspaceId = ctx.appendWorkspace({
      type: 'workspace',
      workspaceKey: inventorySuggestItemKey,
      payload: parsed,
    });
    return JSON.stringify({ ok: true, workspaceId, nodeId: workspaceId, hint: '物资建议已写入工作台，等待确认。' });
  },
};

export const suggestMovementTool: AgentTool = {
  name: 'suggest_movement',
  description:
    '把家庭实物的入库、出库或盘点理解成建议工作台。不要创建实体。「刚入库2盒滤芯，花了80元」时只建议物资变动，金额走记账。票务和服务不要用这个工具。',
  parameters: {
    type: 'object',
    properties: {
      itemId: { type: 'string' },
      type: { type: 'string', enum: ['inbound', 'outbound', 'adjust'] },
      quantity: { type: 'number', description: '入库或出库数量' },
      targetQuantity: { type: 'number', description: '盘点后的目标数量' },
      locationId: { type: 'string' },
      locationName: { type: 'string' },
      note: { type: 'string' },
    },
    required: ['itemId', 'type'],
  },
  schema: movementSchema,
  async execute(args, ctx) {
    const parsed = movementSchema.parse(args);
    const workspaceId = ctx.appendWorkspace({
      type: 'workspace',
      workspaceKey: inventorySuggestMovementKey,
      payload: parsed,
    });
    return JSON.stringify({ ok: true, workspaceId, nodeId: workspaceId, hint: '库存变动建议已写入工作台，等待确认。' });
  },
};

export const itemResource: PluginResourceProvider = {
  list: async () => {
    const rows = await store().getRepository(InventoryItem).find();
    return rows.map((row) => ({
      uri: pluginResourceUri('inventory', 'items', row.id),
      name: row.name,
      mimeType: 'application/json',
    }));
  },
  async read(uri) {
    const prefix = 'tn://inventory/items/';
    if (!uri.startsWith(prefix)) return null;
    const row = await store().getRepository(InventoryItem).findOneBy({ id: uri.slice(prefix.length) });
    if (!row) return null;
    const balances = await store().getRepository(InventoryBalance).findBy({ itemId: row.id });
    const total = balances.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify({
        id: row.id,
        name: row.name,
        unit: row.unit,
        minStock: row.minStock,
        targetStock: row.targetStock,
        totalQuantity: total,
        restockQuantity: restockQuantity(total, row.targetStock),
        lowStock: isLowStock(total, row.minStock),
        revision: row.revision || 1,
      }),
    };
  },
};

export const locationResource: PluginResourceProvider = {
  list: async () => {
    const rows = await store().getRepository(InventoryLocation).find();
    return rows.map((row) => ({
      uri: pluginResourceUri('inventory', 'locations', row.id),
      name: row.name,
      mimeType: 'application/json',
    }));
  },
  async read(uri) {
    const prefix = 'tn://inventory/locations/';
    if (!uri.startsWith(prefix)) return null;
    const row = await store().getRepository(InventoryLocation).findOneBy({ id: uri.slice(prefix.length) });
    if (!row) return null;
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify({ id: row.id, name: row.name, parentId: row.parentId, revision: row.revision || 1 }),
    };
  },
};

export const movementResource: PluginResourceProvider = {
  list: async () => {
    const rows = await store().getRepository(InventoryMovement).find();
    return rows.map((row) => ({
      uri: pluginResourceUri('inventory', 'movements', row.id),
      name: `${row.type} ${row.quantity}`,
      mimeType: 'application/json',
    }));
  },
  async read(uri) {
    const prefix = 'tn://inventory/movements/';
    if (!uri.startsWith(prefix)) return null;
    const row = await store().getRepository(InventoryMovement).findOneBy({ id: uri.slice(prefix.length) });
    if (!row) return null;
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify({
        id: row.id,
        itemId: row.itemId,
        locationId: row.locationId,
        type: row.type,
        quantity: row.quantity,
        beforeQty: row.beforeQty,
        afterQty: row.afterQty,
      }),
    };
  },
};
