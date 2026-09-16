import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@true-north/plugin-sdk/main';
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
import { inventoryService } from './inventory.service';

@Controller('/inventory')
export class InventoryController {
  @Get('/items', { description: '物资列表' })
  async items(@Query() query?: InventoryItemFilterVo): Promise<{ list: InventoryItemVo[] }> {
    return { list: await inventoryService.listItems(query) };
  }

  @Post('/items', { description: '创建物资' })
  async createItem(@Body() body: CreateInventoryItemVo): Promise<InventoryItemVo> {
    return inventoryService.createItem(body);
  }

  @Put('/items/:id', { description: '更新物资' })
  async updateItem(@Param('id') id: string, @Body() body: UpdateInventoryItemVo): Promise<InventoryItemVo> {
    return inventoryService.updateItem(id, body);
  }

  @Get('/locations', { description: '位置列表' })
  async locations(): Promise<{ list: InventoryLocationVo[] }> {
    return { list: await inventoryService.listLocations() };
  }

  @Post('/locations', { description: '创建位置' })
  async createLocation(@Body() body: CreateInventoryLocationVo): Promise<InventoryLocationVo> {
    return inventoryService.createLocation(body);
  }

  @Put('/locations/:id', { description: '更新位置' })
  async updateLocation(
    @Param('id') id: string,
    @Body() body: UpdateInventoryLocationVo,
  ): Promise<InventoryLocationVo> {
    return inventoryService.updateLocation(id, body);
  }

  @Delete('/locations/:id', { description: '删除位置' })
  async deleteLocation(@Param('id') id: string): Promise<boolean> {
    return inventoryService.deleteLocation(id);
  }

  @Get('/movements', { description: '出入库记录' })
  async movements(@Query() query?: InventoryMovementFilterVo): Promise<{ list: InventoryMovementVo[] }> {
    return { list: await inventoryService.listMovements(query) };
  }

  @Post('/inbound', { description: '入库' })
  async inbound(@Body() body: RecordInventoryMovementVo): Promise<InventoryMovementVo> {
    return inventoryService.recordMovement('inbound', body);
  }

  @Post('/outbound', { description: '出库' })
  async outbound(@Body() body: RecordInventoryMovementVo): Promise<InventoryMovementVo> {
    return inventoryService.recordMovement('outbound', body);
  }

  @Post('/adjust', { description: '盘点调整' })
  async adjust(@Body() body: RecordInventoryMovementVo): Promise<InventoryMovementVo> {
    return inventoryService.recordMovement('adjust', body);
  }
}
