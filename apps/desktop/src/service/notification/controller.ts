import { Body, Controller, Get, Param, Put } from '@true-north/plugin-sdk/main';
import { notificationService } from './service';

@Controller('/notifications')
export class NotificationController {
  @Get('/list', { description: '通知收件箱' })
  async list() {
    return notificationService.list();
  }

  @Put('/:id/read', { description: '标记一条通知已读' })
  async markRead(@Param('id') id: string) {
    const item = await notificationService.markRead(id);
    if (!item) throw new Error('notification not found');
    return item;
  }

  @Put('/:id/ignore', { description: '忽略一条通知及其来源' })
  async ignore(@Param('id') id: string) {
    const item = await notificationService.ignore(id);
    if (!item) throw new Error('notification not found');
    return item;
  }

  @Put('/read-all', { description: '全部标为已读' })
  async markAllRead(@Body() _body?: unknown) {
    return notificationService.markAllRead();
  }
}
