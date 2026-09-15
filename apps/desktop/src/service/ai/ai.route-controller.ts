import { Body, Controller, Delete, Get, Param, Post, Put } from '@true-north/plugin-sdk/main';
import type {
  CancelStreamResponseVo,
  ConversationVo,
  CreateConversationRequestVo,
  EnsureResourceConversationRequestVo,
  EnsureResourceConversationResponseVo,
  MessageVo,
  PatchConversationRuntimeRequestVo,
  PatchWorkspaceRequestVo,
  PinConversationRequestVo,
  PutRuntimeSelectionRequestVo,
  PutRuntimeSettingsRequestVo,
  RenameConversationRequestVo,
  RuntimeAgentVo,
  RuntimeSelectionVo,
  RuntimeSettingsVo,
  StartMessageStreamRequestVo,
  StartMessageStreamResponseVo,
} from '@true-north/vo';
import { AiPlatformError, toIpcError } from './ai-error';
import { conversationService } from './conversation/conversation.service';
import { runtimeService } from './runtime';

@Controller('/ai')
export class AiController {
  constructor(
    private readonly conversations = conversationService,
    private readonly runtime = runtimeService,
  ) {}

  @Get('/runtime/agents', { description: '本机编码 Agent 探测列表' })
  async listRuntimeAgents(): Promise<RuntimeAgentVo[]> {
    try {
      return await this.runtime.listAgents();
    } catch (error) {
      throw toIpcError(error);
    }
  }

  @Get('/runtime/settings', { description: '读取本机编码 Agent 设置与探测状态' })
  async getRuntimeSettings(): Promise<RuntimeSettingsVo> {
    try {
      return await this.runtime.getSettings();
    } catch (error) {
      throw toIpcError(error);
    }
  }

  @Put('/runtime/settings', { description: '写入本机编码 Agent 设置并重新探测' })
  async putRuntimeSettings(@Body() body: PutRuntimeSettingsRequestVo): Promise<RuntimeSettingsVo> {
    try {
      return await this.runtime.putSettings(body || {});
    } catch (error) {
      throw toIpcError(error);
    }
  }

  @Get('/runtime/selection', { description: '读取新对话默认编码 Agent' })
  async getRuntimeSelection(): Promise<RuntimeSelectionVo> {
    try {
      return this.runtime.getSelection();
    } catch (error) {
      throw toIpcError(error);
    }
  }

  @Put('/runtime/selection', { description: '写入新对话默认编码 Agent' })
  async putRuntimeSelection(@Body() body: PutRuntimeSelectionRequestVo): Promise<RuntimeSelectionVo> {
    try {
      if (!body?.runtimeId?.trim()) throw AiPlatformError.internal('缺少 runtimeId');
      return this.runtime.putSelection(body.runtimeId.trim());
    } catch (error) {
      throw toIpcError(error);
    }
  }

  @Post('/conversations/resource', { description: '确保资源附件会话' })
  async ensureResourceConversation(
    @Body() body: EnsureResourceConversationRequestVo
  ): Promise<EnsureResourceConversationResponseVo> {
    try {
      if (!body?.uri?.trim()) throw AiPlatformError.internal('缺少 uri');
      return await this.conversations.ensureResourceConversation(body);
    } catch (error) {
      throw toIpcError(error);
    }
  }

  @Get('/conversations', { description: '会话列表' })
  async listConversations(): Promise<ConversationVo[]> {
    try {
      return await this.conversations.list();
    } catch (error) {
      throw toIpcError(error);
    }
  }

  @Post('/conversations', { description: '创建空白会话' })
  async createConversation(@Body() body: CreateConversationRequestVo): Promise<ConversationVo> {
    try {
      return await this.conversations.createBlank(
        body?.title,
        body?.purpose === 'capture' ? 'capture' : 'chat',
        body?.runtimeId
      );
    } catch (error) {
      throw toIpcError(error);
    }
  }

  @Post('/conversations/capture', { description: '确保收集箱会话' })
  async ensureCaptureInbox(): Promise<ConversationVo> {
    try {
      return await this.conversations.ensureCaptureInbox();
    } catch (error) {
      throw toIpcError(error);
    }
  }

  @Put('/conversations/:id', { description: '重命名会话' })
  async renameConversation(
    @Param('id') id: string,
    @Body() body: RenameConversationRequestVo
  ): Promise<ConversationVo> {
    try {
      if (!id?.trim()) throw AiPlatformError.internal('缺少 conversationId');
      return await this.conversations.rename(id.trim(), body?.title);
    } catch (error) {
      throw toIpcError(error);
    }
  }

  @Put('/conversations/:id/pin', { description: '置顶或取消置顶会话' })
  async pinConversation(
    @Param('id') id: string,
    @Body() body: PinConversationRequestVo
  ): Promise<ConversationVo> {
    try {
      if (!id?.trim()) throw AiPlatformError.internal('缺少 conversationId');
      if (typeof body?.pinned !== 'boolean') throw AiPlatformError.internal('缺少 pinned');
      return await this.conversations.pin(id.trim(), body.pinned);
    } catch (error) {
      throw toIpcError(error);
    }
  }

  @Delete('/conversations/:id', { description: '删除会话及其消息' })
  async deleteConversation(@Param('id') id: string): Promise<void> {
    try {
      if (!id?.trim()) throw AiPlatformError.internal('缺少 conversationId');
      await this.conversations.remove(id.trim());
    } catch (error) {
      throw toIpcError(error);
    }
  }

  @Put('/conversations/:id/runtime', { description: '切换会话所用编码 Agent 并清空原生线程' })
  async patchConversationRuntime(
    @Param('id') id: string,
    @Body() body: PatchConversationRuntimeRequestVo
  ): Promise<ConversationVo> {
    try {
      if (!id?.trim()) throw AiPlatformError.internal('缺少 conversationId');
      return await this.conversations.patchRuntime(id.trim(), body || { runtimeId: '' });
    } catch (error) {
      throw toIpcError(error);
    }
  }

  @Get('/conversations/:id/messages', { description: '会话消息列表' })
  async listMessages(@Param('id') id: string): Promise<MessageVo[]> {
    try {
      if (!id?.trim()) throw AiPlatformError.internal('缺少 conversationId');
      return await this.conversations.getMessages(id.trim());
    } catch (error) {
      throw toIpcError(error);
    }
  }

  @Post('/conversations/:id/messages/stream', { description: '启动会话流式发消息' })
  async startMessageStream(
    @Param('id') id: string,
    @Body() body: StartMessageStreamRequestVo
  ): Promise<StartMessageStreamResponseVo> {
    try {
      if (!id?.trim()) throw AiPlatformError.internal('缺少 conversationId');
      return await this.conversations.startMessageStream(id.trim(), body?.text || '');
    } catch (error) {
      throw toIpcError(error);
    }
  }

  @Post('/conversations/streams/:streamId/cancel', { description: '取消会话流式生成' })
  async cancelMessageStream(@Param('streamId') streamId: string): Promise<CancelStreamResponseVo> {
    try {
      if (!streamId?.trim()) throw AiPlatformError.internal('缺少 streamId');
      return this.conversations.cancelStream(streamId.trim());
    } catch (error) {
      throw toIpcError(error);
    }
  }

  @Put('/messages/:id/workspace', { description: '写回工作台预览草稿' })
  async patchWorkspace(
    @Param('id') id: string,
    @Body() body: PatchWorkspaceRequestVo
  ): Promise<MessageVo> {
    try {
      if (!id?.trim()) throw AiPlatformError.internal('缺少 messageId');
      return await this.conversations.patchWorkspacePayload(id.trim(), body || { payload: {} });
    } catch (error) {
      throw toIpcError(error);
    }
  }
}
