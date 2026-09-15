import { randomUUID } from 'crypto';
import type { EntityManager } from 'typeorm';
import { AiMessageRole } from '@true-north/enum';
import type {
  AiMessagePartVo,
  AiTextPartVo,
  AiWorkspacePartVo,
  ConversationVo,
  EnsureResourceConversationResponseVo,
  MessageVo,
  PatchConversationRuntimeRequestVo,
  PatchWorkspaceRequestVo,
  PluginResourceAttachmentVo,
  StartMessageStreamResponseVo,
} from '@true-north/vo';
import { workspaceEntityRef } from '@true-north/vo';
import { bindStreamToCurrentTrace } from '@true-north/dev-lab/collector';
import { AiPlatformError } from '../ai-error';
import { agentDef } from '../runtime/registry';
import { killChildProcess, runtimeService } from '../runtime';
import { readRuntimeId } from '../runtime/settings-store';
import { AiConversation } from './conversation.entity';
import { AiConversationRepository } from './conversation.repository';
import { AiMessage } from './message.entity';
import { AiMessageRepository } from './message.repository';
import {
  nextRuntimeThreadId,
  runtimeIdForConversation,
  shouldResumeRuntimeThread,
} from './conversation-runtime';
import { claimConversationStream } from './conversation-stream';
import {
  cancelStream,
  emitStream,
  finishStream,
  registerStreamAbort,
} from './stream-bus';

const HISTORY_TURN_CAP = 20;
const HISTORY_CHAR_CAP = 12_000;
const DEFAULT_TITLE = '新会话';

function toIso(value: Date | string | undefined): string {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
}

function toConversationVo(entity: AiConversation): ConversationVo {
  return {
    id: entity.id,
    title: entity.title,
    updatedAt: toIso(entity.updatedAt),
    createdAt: toIso(entity.createdAt),
    pinned: Boolean(entity.pinned),
    purpose: entity.purpose || 'chat',
    attachments: entity.attachments || undefined,
    runtimeId: entity.runtimeId || undefined,
  };
}

function toMessageVo(entity: AiMessage): MessageVo {
  return {
    id: entity.id,
    conversationId: entity.conversationId,
    role: entity.role as MessageVo['role'],
    parts: entity.parts || [],
    createdAt: toIso(entity.createdAt),
  };
}

function formatAttachments(attachments: PluginResourceAttachmentVo[] | null | undefined): string {
  if (!attachments?.length) return '';
  return attachments
    .map((item) => `- ${item.label || item.uri} (${item.uri})${item.skill ? ` skill=${item.skill}` : ''}`)
    .join('\n');
}

function textFromParts(parts: AiMessagePartVo[]): string {
  const texts: string[] = [];
  for (const part of parts) {
    if (part.type === 'text') {
      const body = part.text || '';
      texts.push(body);
    } else if (part.type === 'workspace') {
      const ref = workspaceEntityRef(part.payload);
      const refLabel = ref ? ` ${ref.type}:${ref.id} ${ref.label}` : '';
      const summary = typeof part.payload.analysisSummary === 'string' ? part.payload.analysisSummary : '';
      texts.push(`[工作台:${part.workspaceKey}${refLabel}] ${summary}`.trim());
    } else if (part.type === 'tool') {
      texts.push(`[工具:${part.toolName} ${part.status}] ${part.resultSummary || part.argsSummary || ''}`.trim());
    }
  }
  return texts.filter(Boolean).join('\n');
}

function buildHistoryExcerpt(history: AiMessage[]): string {
  const recent = history.slice(-HISTORY_TURN_CAP);
  const lines: string[] = [];
  let chars = 0;
  for (const item of recent) {
    const content = textFromParts(item.parts || []);
    if (!content.trim()) continue;
    const role = item.role === AiMessageRole.ASSISTANT ? 'Assistant' : 'User';
    const line = `${role}: ${content}`;
    if (chars + line.length > HISTORY_CHAR_CAP && lines.length > 0) break;
    lines.push(line);
    chars += line.length;
  }
  return lines.join('\n');
}

function buildRuntimePrompt(history: AiMessage[], resume: boolean, latestUserText: string): string {
  if (resume) return latestUserText;
  const excerpt = buildHistoryExcerpt(history);
  return excerpt || latestUserText;
}

export class ConversationService {
  constructor(
    private readonly conversationRepository = new AiConversationRepository(),
    private readonly messageRepository = new AiMessageRepository(),
  ) {}

  async list(): Promise<ConversationVo[]> {
    const list = await this.conversationRepository.findByFilter({});
    return list.map(toConversationVo);
  }

  async createBlank(title?: string, purpose?: 'chat' | 'capture', runtimeId?: string): Promise<ConversationVo> {
    const requested = runtimeId?.trim();
    if (requested && !agentDef(requested)) {
      throw AiPlatformError.agentUnavailable('未知编码 Agent');
    }
    const entity = new AiConversation();
    entity.title = (title || DEFAULT_TITLE).trim() || DEFAULT_TITLE;
    entity.pinned = false;
    entity.purpose = purpose || 'chat';
    entity.runtimeId = runtimeIdForConversation(requested, readRuntimeId());
    const saved = await this.conversationRepository.create(entity);
    return toConversationVo(saved);
  }

  async ensureCaptureInbox(): Promise<ConversationVo> {
    const existing = await this.conversationRepository.findByFilter({ purpose: 'capture' });
    if (existing[0]) return toConversationVo(existing[0]);
    return this.createBlank('收集箱', 'capture');
  }

  async ensureResourceConversation(input: PluginResourceAttachmentVo): Promise<EnsureResourceConversationResponseVo> {
    const uri = input.uri?.trim();
    if (!uri) throw AiPlatformError.internal('缺少资源 URI');
    const existing = (await this.conversationRepository.findByFilter({})).find((item) =>
      (item.attachments || []).some((attachment) => attachment.uri === uri),
    );
    if (existing) {
      return { conversation: toConversationVo(existing), created: false };
    }
    const entity = new AiConversation();
    entity.title = input.label ? `拆解：${input.label}` : '资源会话';
    entity.attachments = [{ uri, label: input.label, skill: input.skill }];
    entity.pinned = false;
    entity.runtimeId = runtimeIdForConversation(undefined, readRuntimeId());
    const saved = await this.conversationRepository.create(entity);
    return { conversation: toConversationVo(saved), created: true };
  }

  async rename(conversationId: string, title?: string): Promise<ConversationVo> {
    const nextTitle = title?.trim();
    if (!nextTitle) throw AiPlatformError.internal('会话标题不能为空');
    const conversation = await this.conversationRepository.find(conversationId);
    conversation.title = nextTitle;
    const saved = await this.conversationRepository.update(conversation);
    return toConversationVo(saved);
  }

  async pin(conversationId: string, pinned: boolean): Promise<ConversationVo> {
    const saved = await this.conversationRepository.setPinned(conversationId, pinned);
    return toConversationVo(saved);
  }

  async remove(conversationId: string): Promise<void> {
    await this.conversationRepository.find(conversationId);
    await this.messageRepository.softDeleteByFilter({ conversationId });
    await this.conversationRepository.softDelete(conversationId);
  }

  async patchRuntime(conversationId: string, body: PatchConversationRuntimeRequestVo): Promise<ConversationVo> {
    const runtimeId = body?.runtimeId?.trim();
    if (!runtimeId || !agentDef(runtimeId)) {
      throw AiPlatformError.agentUnavailable('未知编码 Agent');
    }
    const conversation = await this.conversationRepository.find(conversationId);
    conversation.runtimeThreadId = nextRuntimeThreadId(
      conversation.runtimeId,
      runtimeId,
      conversation.runtimeThreadId
    );
    conversation.runtimeId = runtimeId;
    conversation.updatedAt = new Date();
    const saved = await this.conversationRepository.update(conversation);
    return toConversationVo(saved);
  }

  async getMessages(conversationId: string): Promise<MessageVo[]> {
    await this.conversationRepository.find(conversationId);
    const list = await this.messageRepository.findByFilter({ conversationId });
    return list.map(toMessageVo);
  }

  async startMessageStream(
    conversationId: string,
    text: string,
  ): Promise<StartMessageStreamResponseVo> {
    const trimmed = text?.trim();
    if (!trimmed) {
      throw AiPlatformError.internal('消息内容不能为空');
    }

    const conversation = await this.conversationRepository.find(conversationId);
    await runtimeService.resolveForSend(runtimeIdForConversation(conversation.runtimeId, readRuntimeId()));
    const streamId = randomUUID();
    const claimed = claimConversationStream(conversationId, streamId);
    if (claimed.ok === false) {
      throw AiPlatformError.internal(claimed.message);
    }
    bindStreamToCurrentTrace(streamId, conversationId);

    try {
      const user = new AiMessage();
      user.conversationId = conversationId;
      user.role = AiMessageRole.USER;
      const userPart: AiTextPartVo = { type: 'text', text: trimmed };
      user.parts = [userPart];
      const savedUser = await this.messageRepository.create(user);

      const assistant = new AiMessage();
      assistant.conversationId = conversationId;
      assistant.role = AiMessageRole.ASSISTANT;
      assistant.parts = [{ type: 'text', text: '' }];
      const savedAssistant = await this.messageRepository.create(assistant);

      conversation.updatedAt = new Date();
      await this.conversationRepository.update(conversation);

      const signal = registerStreamAbort(streamId);

      void this.dispatchOutboundMessage({
        streamId,
        conversationId,
        assistantId: savedAssistant.id,
        signal,
      });

      return {
        user: toMessageVo(savedUser),
        assistant: toMessageVo(savedAssistant),
        streamId,
      };
    } catch (error) {
      finishStream(streamId);
      throw error;
    }
  }

  cancelStream(streamId: string): { ok: true } {
    void killChildProcess(streamId);
    cancelStream(streamId);
    return { ok: true };
  }

  async patchWorkspacePayload(
    messageId: string,
    body: PatchWorkspaceRequestVo,
    manager?: EntityManager
  ): Promise<MessageVo> {
    const payload = body?.payload;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw AiPlatformError.internal('缺少工作台载荷');
    }

    const apply = async (message: AiMessage) => {
      const parts = [...(message.parts || [])];
      const workspaceIndex = parts.findIndex((part) => part.type === 'workspace');
      if (workspaceIndex < 0) {
        throw AiPlatformError.internal('消息中不存在工作台块');
      }
      const workspace = parts[workspaceIndex] as AiWorkspacePartVo;
      parts[workspaceIndex] = {
        ...workspace,
        payload,
      };
      message.parts = parts;
      return message;
    };

    if (manager) {
      const repo = manager.getRepository(AiMessage);
      const message = await repo.findOne({ where: { id: messageId } });
      if (!message) throw AiPlatformError.internal('消息不存在');
      await repo.save(await apply(message));
      const conversationRepo = manager.getRepository(AiConversation);
      const conversation = await conversationRepo.findOne({ where: { id: message.conversationId } });
      if (conversation) {
        conversation.updatedAt = new Date();
        await conversationRepo.save(conversation);
      }
      return toMessageVo(message);
    }

    const message = await apply(await this.messageRepository.find(messageId));
    const saved = await this.messageRepository.update(message);
    const conversation = await this.conversationRepository.find(message.conversationId);
    conversation.updatedAt = new Date();
    await this.conversationRepository.update(conversation);
    return toMessageVo(saved);
  }

  private async dispatchOutboundMessage(input: {
    streamId: string;
    conversationId: string;
    assistantId: string;
    signal: AbortSignal;
  }): Promise<void> {
    const { streamId, conversationId, assistantId, signal } = input;
    try {
      const conversation = await this.conversationRepository.find(conversationId);
      const history = await this.messageRepository.findByFilter({ conversationId });
      const withoutPlaceholder = history.filter((item) => item.id !== assistantId);
      const latestUser = [...withoutPlaceholder].reverse().find((item) => item.role === AiMessageRole.USER);
      const latestUserText = latestUser ? textFromParts(latestUser.parts || []) : '';

      const persistParts = async (parts: AiMessagePartVo[]): Promise<MessageVo> => {
        const assistant = await this.messageRepository.find(assistantId);
        assistant.parts = parts.length ? parts : [{ type: 'text', text: '' }];
        const saved = await this.messageRepository.update(assistant);
        const vo = toMessageVo(saved);
        emitStream({ streamId, event: 'message', message: vo });
        return vo;
      };

      const preferred = runtimeIdForConversation(conversation.runtimeId, readRuntimeId());
      const selected = await runtimeService.resolveForSend(preferred);
      const resume = shouldResumeRuntimeThread(
        conversation.runtimeId,
        conversation.runtimeThreadId,
        selected.id
      );
      const attachmentNote = formatAttachments(conversation.attachments);
      const historyPrompt = buildRuntimePrompt(withoutPlaceholder, resume, latestUserText);
      const prompt = resume
        ? latestUserText
        : [attachmentNote ? `当前会话附件:\n${attachmentNote}` : '', historyPrompt].filter(Boolean).join('\n\n');
      const result = await runtimeService.runChat({
        streamId,
        conversationId,
        assistantId,
        prompt,
        resumeThreadId: resume ? conversation.runtimeThreadId || undefined : undefined,
        preferredRuntimeId: preferred,
        signal,
        persistParts,
      });

      const latest = await this.conversationRepository.find(conversationId);
      latest.runtimeId = result.runtimeId;
      if (result.threadId) latest.runtimeThreadId = result.threadId;
      latest.updatedAt = new Date();
      await this.conversationRepository.update(latest);
      emitStream({ streamId, event: 'done', message: result.message, stopped: signal.aborted });
    } catch (error) {
      const code =
        error instanceof AiPlatformError
          ? error.aiCode
          : error instanceof Error && error.name === 'AbortError'
            ? 'TIMEOUT'
            : 'INTERNAL';
      const messageText = error instanceof Error ? error.message : '会话处理失败';
      try {
        const assistant = await this.messageRepository.find(assistantId);
        assistant.parts = [{ type: 'text', text: `生成失败：${messageText}` }];
        await this.messageRepository.update(assistant);
      } catch {
        // ignore
      }
      emitStream({ streamId, event: 'error', code, messageText });
    } finally {
      finishStream(streamId);
      await killChildProcess(streamId);
    }
  }
}

export const conversationService = new ConversationService();
