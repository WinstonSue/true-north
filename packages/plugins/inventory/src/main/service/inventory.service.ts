import type { EntityManager } from 'typeorm';
import { InventoryMovementType } from '@true-north/enum';
import type {
  CreateInventoryItemVo,
  CreateInventoryLocationVo,
  InventoryItemFilterVo,
  InventoryItemVo,
  InventoryLocationVo,
  InventoryMovementFilterVo,
  InventoryMovementVo,
  RecordInventoryMovementVo,
  UpdateInventoryItemVo,
  UpdateInventoryLocationVo,
} from '@true-north/vo';
import { store } from '../storage';
import { InventoryItem } from './item.entity';
import { InventoryLocation } from './location.entity';
import { InventoryBalance } from './balance.entity';
import { InventoryMovement } from './movement.entity';
import { applyQuantityDelta, isLowStock, restockQuantity, type MovementType } from './stock';
import { recordInventoryActivity } from '../context';

function toIso(value: Date | string | undefined): string {
  if (!value) return new Date().toISOString();
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function totalsByItem(balances: InventoryBalance[]) {
  const totals = new Map<string, number>();
  for (const balance of balances) {
    totals.set(balance.itemId, (totals.get(balance.itemId) || 0) + Number(balance.quantity || 0));
  }
  return totals;
}

function toItemVo(item: InventoryItem, total: number): InventoryItemVo {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    unit: item.unit || '个',
    minStock: item.minStock,
    targetStock: item.targetStock,
    note: item.note,
    archived: !!item.archived,
    revision: item.revision || 1,
    totalQuantity: total,
    restockQuantity: restockQuantity(total, item.targetStock),
    lowStock: isLowStock(total, item.minStock),
    createdAt: toIso(item.createdAt),
    updatedAt: toIso(item.updatedAt),
  };
}

function toLocationVo(location: InventoryLocation): InventoryLocationVo {
  return {
    id: location.id,
    name: location.name,
    parentId: location.parentId,
    note: location.note,
    revision: location.revision || 1,
    createdAt: toIso(location.createdAt),
    updatedAt: toIso(location.updatedAt),
  };
}

function toMovementVo(
  movement: InventoryMovement,
  item?: InventoryItem | null,
  location?: InventoryLocation | null,
): InventoryMovementVo {
  return {
    id: movement.id,
    itemId: movement.itemId,
    itemName: item?.name,
    locationId: movement.locationId,
    locationName: location?.name,
    type: movement.type,
    quantity: movement.quantity,
    beforeQty: movement.beforeQty,
    afterQty: movement.afterQty,
    note: movement.note,
    occurredAt: toIso(movement.occurredAt),
    createdAt: toIso(movement.createdAt),
    updatedAt: toIso(movement.updatedAt),
  };
}

export class InventoryService {
  private manager(manager?: EntityManager) {
    return manager ?? store().manager;
  }

  async listItems(filter?: InventoryItemFilterVo): Promise<InventoryItemVo[]> {
    const qb = this.manager().getRepository(InventoryItem).createQueryBuilder('item').andWhere('item.deletedAt IS NULL');
    if (filter?.archived != null) qb.andWhere('item.archived = :archived', { archived: filter.archived ? 1 : 0 });
    else qb.andWhere('item.archived = :archived', { archived: 0 });
    if (filter?.category) qb.andWhere('item.category = :category', { category: filter.category });
    if (filter?.keyword?.trim()) {
      qb.andWhere('(item.name LIKE :keyword OR item.note LIKE :keyword)', { keyword: `%${filter.keyword.trim()}%` });
    }
    const items = await qb.orderBy('item.updatedAt', 'DESC').getMany();
    const balances = await this.manager().getRepository(InventoryBalance).find();
    const totals = totalsByItem(balances);
    return items
      .map((item) => toItemVo(item, totals.get(item.id) || 0))
      .filter((item) => (filter?.lowStock ? item.lowStock : true));
  }

  async createItem(body: CreateInventoryItemVo, options?: { manager?: EntityManager }): Promise<InventoryItemVo> {
    const name = body?.name?.trim();
    if (!name) throw new Error('请填写物资名称');
    const run = async (manager: EntityManager) => {
      const repo = manager.getRepository(InventoryItem);
      const saved = await repo.save(
        repo.create({
          name,
          category: body.category?.trim() || undefined,
          unit: body.unit?.trim() || '个',
          minStock: body.minStock,
          targetStock: body.targetStock,
          note: body.note,
          archived: false,
          revision: 1,
        }),
      );
      if (body.quantity && body.quantity > 0) {
        await this.recordMovement(
          'inbound',
          {
            itemId: saved.id,
            locationId: body.locationId,
            locationName: body.locationName,
            quantity: body.quantity,
          },
          { manager },
        );
      }
      if (!options?.manager) {
        await recordInventoryActivity('itemCreated', { title: saved.name, entityId: saved.id, collection: 'items' });
      }
      const balances = await manager.getRepository(InventoryBalance).findBy({ itemId: saved.id });
      return toItemVo(saved, totalsByItem(balances).get(saved.id) || 0);
    };
    if (options?.manager) return run(options.manager);
    return store().runInTransaction((tx) => run(tx.manager));
  }

  async updateItem(id: string, body: UpdateInventoryItemVo): Promise<InventoryItemVo> {
    const repo = this.manager().getRepository(InventoryItem);
    const current = await repo.findOneBy({ id });
    if (!current) throw new Error('物资不存在');
    if (body.name !== undefined) current.name = body.name.trim();
    if (body.category !== undefined) current.category = body.category?.trim() || undefined;
    if (body.unit !== undefined) current.unit = body.unit.trim() || '个';
    if (body.minStock !== undefined) current.minStock = body.minStock;
    if (body.targetStock !== undefined) current.targetStock = body.targetStock;
    if (body.note !== undefined) current.note = body.note;
    if (body.archived !== undefined) current.archived = body.archived;
    current.revision = (current.revision || 1) + 1;
    const saved = await repo.save(current);
    const balances = await this.manager().getRepository(InventoryBalance).findBy({ itemId: id });
    return toItemVo(saved, totalsByItem(balances).get(id) || 0);
  }

  async listLocations(): Promise<InventoryLocationVo[]> {
    const list = await this.manager()
      .getRepository(InventoryLocation)
      .createQueryBuilder('location')
      .andWhere('location.deletedAt IS NULL')
      .orderBy('location.name', 'ASC')
      .getMany();
    return list.map(toLocationVo);
  }

  async createLocation(body: CreateInventoryLocationVo, options?: { manager?: EntityManager }): Promise<InventoryLocationVo> {
    const name = body?.name?.trim();
    if (!name) throw new Error('请填写位置名称');
    const repo = this.manager(options?.manager).getRepository(InventoryLocation);
    const saved = await repo.save(
      repo.create({
        name,
        parentId: body.parentId || undefined,
        note: body.note,
        revision: 1,
      }),
    );
    return toLocationVo(saved);
  }

  async updateLocation(id: string, body: UpdateInventoryLocationVo): Promise<InventoryLocationVo> {
    const repo = this.manager().getRepository(InventoryLocation);
    const current = await repo.findOneBy({ id });
    if (!current) throw new Error('位置不存在');
    if (body.name !== undefined) current.name = body.name.trim();
    if (body.parentId !== undefined) current.parentId = body.parentId || undefined;
    if (body.note !== undefined) current.note = body.note;
    current.revision = (current.revision || 1) + 1;
    return toLocationVo(await repo.save(current));
  }

  async deleteLocation(id: string): Promise<boolean> {
    const balances = await this.manager().getRepository(InventoryBalance).findBy({ locationId: id });
    if (balances.some((row) => Number(row.quantity) !== 0)) {
      throw new Error('该位置仍有库存，不能删除');
    }
    await this.manager().getRepository(InventoryLocation).softDelete(id);
    return true;
  }

  async ensureLocation(
    input: { locationId?: string; locationName?: string },
    manager?: EntityManager,
  ): Promise<InventoryLocation> {
    const repo = this.manager(manager).getRepository(InventoryLocation);
    if (input.locationId) {
      const found = await repo.findOneBy({ id: input.locationId });
      if (!found) throw new Error('位置不存在');
      return found;
    }
    const name = input.locationName?.trim() || '家';
    const existing = await repo.findOne({ where: { name } });
    if (existing) return existing;
    return repo.save(repo.create({ name, revision: 1 }));
  }

  async listMovements(filter?: InventoryMovementFilterVo): Promise<InventoryMovementVo[]> {
    const qb = this.manager().getRepository(InventoryMovement).createQueryBuilder('movement');
    if (filter?.itemId) qb.andWhere('movement.itemId = :itemId', { itemId: filter.itemId });
    if (filter?.locationId) qb.andWhere('movement.locationId = :locationId', { locationId: filter.locationId });
    if (filter?.type) qb.andWhere('movement.type = :type', { type: filter.type });
    const rows = await qb.orderBy('movement.occurredAt', 'DESC').getMany();
    const items = await this.manager().getRepository(InventoryItem).find();
    const locations = await this.manager().getRepository(InventoryLocation).find();
    const itemById = new Map(items.map((item) => [item.id, item]));
    const locationById = new Map(locations.map((location) => [location.id, location]));
    return rows.map((row) => toMovementVo(row, itemById.get(row.itemId), locationById.get(row.locationId)));
  }

  async recordMovement(
    type: MovementType,
    body: RecordInventoryMovementVo,
    options?: { manager?: EntityManager },
  ): Promise<InventoryMovementVo> {
    const run = async (manager: EntityManager) => {
      const item = await manager.getRepository(InventoryItem).findOneBy({ id: body.itemId });
      if (!item || item.archived) throw new Error(item?.archived ? '物资已归档' : '物资不存在');
      const location = await this.ensureLocation(body, manager);
      const balanceRepo = manager.getRepository(InventoryBalance);
      let balance = await balanceRepo.findOne({ where: { itemId: item.id, locationId: location.id } });
      const currentQty = balance?.quantity ?? 0;
      const applied = applyQuantityDelta(currentQty, type, body.quantity, body.targetQuantity);
      if ('error' in applied) throw new Error(applied.error === 'insufficient stock' ? '出库后不能小于零' : applied.error);
      if (!balance) {
        balance = balanceRepo.create({
          itemId: item.id,
          locationId: location.id,
          quantity: applied.next,
          revision: 1,
        });
      } else {
        balance.quantity = applied.next;
        balance.revision = (balance.revision || 1) + 1;
      }
      await balanceRepo.save(balance);
      const movementRepo = manager.getRepository(InventoryMovement);
      const movement = await movementRepo.save(
        movementRepo.create({
          itemId: item.id,
          locationId: location.id,
          type:
            type === 'inbound'
              ? InventoryMovementType.INBOUND
              : type === 'outbound'
                ? InventoryMovementType.OUTBOUND
                : InventoryMovementType.ADJUST,
          quantity: applied.delta,
          beforeQty: currentQty,
          afterQty: applied.next,
          note: body.note,
          occurredAt: new Date(),
        }),
      );
      const event =
        type === 'inbound' ? 'stockInbound' : type === 'outbound' ? 'stockOutbound' : 'stockAdjusted';
      if (!options?.manager) {
        await recordInventoryActivity(event, { title: item.name, entityId: movement.id, collection: 'movements' });
      }
      return toMovementVo(movement, item, location);
    };
    if (options?.manager) return run(options.manager);
    return store().runInTransaction((tx) => run(tx.manager));
  }
}

export const inventoryService = new InventoryService();
