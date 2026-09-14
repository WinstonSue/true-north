import { BrowserWindow, type WebContents } from 'electron';
import type { AiChatStreamEventVo } from '@true-north/vo';
import { AI_CONVERSATION_STREAM_CHANNEL } from '@true-north/vo';
import { recordAiStreamEvent } from '@true-north/dev-lab/collector';
import { releaseConversationStream } from './conversation-stream';

const controllers = new Map<string, AbortController>();
let rendererContents: WebContents | null = null;

export function bindStreamRenderer(contents: WebContents): void {
  rendererContents = contents;
  contents.once('destroyed', () => {
    if (rendererContents === contents) rendererContents = null;
  });
}

function sendToRenderer(event: AiChatStreamEventVo): void {
  if (rendererContents && !rendererContents.isDestroyed()) {
    rendererContents.send(AI_CONVERSATION_STREAM_CHANNEL, event);
    return;
  }
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) win.webContents.send(AI_CONVERSATION_STREAM_CHANNEL, event);
  }
}

export function registerStreamAbort(streamId: string): AbortSignal {
  cancelStream(streamId);
  const controller = new AbortController();
  controllers.set(streamId, controller);
  return controller.signal;
}

export function cancelStream(streamId: string): boolean {
  const existing = controllers.get(streamId);
  if (!existing) return false;
  existing.abort();
  controllers.delete(streamId);
  return true;
}

export function finishStream(streamId: string): void {
  controllers.delete(streamId);
  releaseConversationStream(streamId);
}

export function emitStream(event: AiChatStreamEventVo): void {
  sendToRenderer(event);
  if (event.event === 'delta') {
    recordAiStreamEvent({ streamId: event.streamId, event: 'delta', chars: event.delta.length });
  } else if (event.event === 'message') {
    recordAiStreamEvent({
      streamId: event.streamId,
      event: 'message',
      partKinds: (event.message.parts || []).map((part) => part.type),
    });
  } else if (event.event === 'done') {
    recordAiStreamEvent({ streamId: event.streamId, event: 'done', stopped: Boolean(event.stopped) });
  } else {
    recordAiStreamEvent({ streamId: event.streamId, event: 'error', code: event.code });
  }
}
