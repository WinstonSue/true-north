import type { AiWorkspacePartVo, AiWorkspacePayloadVo } from '@true-north/vo';
import { AiService } from '@true-north/web-service';
import type { WorkbenchWorkspaceHost } from '@true-north/plugin-sdk';

function readWorkspacePart(
  parts: Array<{ type: string; workspaceId?: string; workspaceKey?: string; payload?: AiWorkspacePayloadVo }>,
  workspaceId?: string,
) {
  const matches = parts.filter((item) => item.type === 'workspace') as AiWorkspacePartVo[];
  const part = workspaceId ? matches.find((item) => item.workspaceId === workspaceId) : matches[0];
  return part?.workspaceKey && part.payload
    ? { workspaceId: part.workspaceId, workspaceKey: part.workspaceKey, payload: part.payload }
    : null;
}

export function createAiWorkspaceHost(): WorkbenchWorkspaceHost {
  return {
    async load(conversationId, messageId, workspaceId) {
      const result = await AiService.listMessages(conversationId);
      if (result.ok === false) throw new Error(result.message);
      const item = result.data.find((entry) => entry.id === messageId);
      const part = item ? readWorkspacePart(item.parts, workspaceId) : null;
      if (!part) throw new Error('未找到对应的工作台内容');
      return part;
    },
    subscribe(messageId, workspaceId, onUpdate) {
      return AiService.subscribeChatStream((event) => {
        if (event.event !== 'message' && event.event !== 'done') return;
        if (event.message.id !== messageId) return;
        const part = readWorkspacePart(event.message.parts, workspaceId);
        if (!part) return;
        onUpdate(part);
      });
    },
    async patch(messageId, workspaceId, payload: AiWorkspacePayloadVo) {
      const result = await AiService.patchWorkspace(messageId, { payload, workspaceId });
      if (result.ok === false) throw new Error(result.message);
      const part = readWorkspacePart(result.data.parts, workspaceId);
      if (!part) throw new Error('未找到对应的工作台内容');
      return part.payload;
    },
  };
}
