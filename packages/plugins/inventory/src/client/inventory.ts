import { pluginIpc } from './port';
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

export default class InventoryController {
  static async listItems(query?: InventoryItemFilterVo) {
    return pluginIpc().get<{ list: InventoryItemVo[] }>('/inventory/items', query);
  }

  static async createItem(body: CreateInventoryItemVo) {
    return pluginIpc().post<InventoryItemVo>('/inventory/items', body);
  }

  static async updateItem(id: string, body: UpdateInventoryItemVo) {
    return pluginIpc().put<InventoryItemVo>(`/inventory/items/${id}`, body);
  }

  static async listLocations() {
    return pluginIpc().get<{ list: InventoryLocationVo[] }>('/inventory/locations');
  }

  static async createLocation(body: CreateInventoryLocationVo) {
    return pluginIpc().post<InventoryLocationVo>('/inventory/locations', body);
  }

  static async updateLocation(id: string, body: UpdateInventoryLocationVo) {
    return pluginIpc().put<InventoryLocationVo>(`/inventory/locations/${id}`, body);
  }

  static async deleteLocation(id: string) {
    return pluginIpc().remove<boolean>(`/inventory/locations/${id}`);
  }

  static async listMovements(query?: InventoryMovementFilterVo) {
    return pluginIpc().get<{ list: InventoryMovementVo[] }>('/inventory/movements', query);
  }

  static async inbound(body: RecordInventoryMovementVo) {
    return pluginIpc().post<InventoryMovementVo>('/inventory/inbound', body);
  }

  static async outbound(body: RecordInventoryMovementVo) {
    return pluginIpc().post<InventoryMovementVo>('/inventory/outbound', body);
  }

  static async adjust(body: RecordInventoryMovementVo) {
    return pluginIpc().post<InventoryMovementVo>('/inventory/adjust', body);
  }
}
