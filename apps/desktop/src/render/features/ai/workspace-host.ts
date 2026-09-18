import type { AiWorkspacePartVo, AiWorkspacePayloadVo } from '@true-north/vo';
import { AiService } from '@true-north/web-service';
import type { PluginIpcPort, WorkbenchWorkspaceHost } from '@true-north/plugin-sdk';

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

export function createHostWorkspaceHost(ipc: PluginIpcPort): WorkbenchWorkspaceHost {
  const ai = createAiWorkspaceHost();
  const isWorkflow = (conversationId: string, messageId: string) =>
    conversationId === 'workflow' || messageId.startsWith('workflow:');
  return {
    async load(conversationId, messageId, workspaceId) {
      if (isWorkflow(conversationId, messageId)) {
        const row = (await ipc.get(`/workflow/workspaces/${workspaceId}`)) as {
          id: string;
          contributionId: string;
          state: Record<string, unknown>;
        };
        return { workspaceId: row.id || workspaceId, workspaceKey: row.contributionId, payload: row.state };
      }
      return ai.load(conversationId, messageId, workspaceId);
    },
    subscribe(messageId, workspaceId, onUpdate) {
      if (messageId.startsWith('workflow:')) return () => undefined;
      return ai.subscribe(messageId, workspaceId, onUpdate);
    },
    async patch(messageId, workspaceId, payload: AiWorkspacePayloadVo) {
      if (messageId.startsWith('workflow:')) {
        const row = (await ipc.put(`/workflow/workspaces/${workspaceId}`, payload)) as { state: Record<string, unknown> };
        return row.state;
      }
      return ai.patch(messageId, workspaceId, payload);
    },
  };
}
