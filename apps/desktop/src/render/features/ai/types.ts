import type { RefObject } from 'react';
import { Input, type GetRef } from '@sue/design-web-react';
import type {
  ConversationVo,
  MessageVo,
  RuntimeAgentVo,
} from '@true-north/vo';

export type ComposerInputRef = GetRef<typeof Input.TextArea>;

export type AiDraft = {
  text: string;
  links: Array<{ type: string; id: string; label: string }>;
};

export type SessionValue = {
  conversations: ConversationVo[];
  activeConversationId: string | null;
  activeConversation: ConversationVo | undefined;
  activeMessages: MessageVo[];
  draft: AiDraft;
  setDraft: (value: string | AiDraft) => void;
  composerInputRef: RefObject<ComposerInputRef>;
  focusComposer: () => void;
  streaming: boolean;
  streamingAssistantId: string | null;
  streamingConversationIds: string[];
  streamError: string | null;
  loading: boolean;
  codingAgents: RuntimeAgentVo[];
  selectedAgentId: string;
  selectedAgent: RuntimeAgentVo | undefined;
  selectCodingAgent: (id: string) => Promise<void>;
  canSend: boolean;
  threadWillReset: boolean;
  selectConversation: (id: string) => void;
  createBlankConversation: () => Promise<void>;
  renameConversation: (id: string, title: string) => Promise<boolean>;
  pinConversation: (id: string, pinned: boolean) => Promise<boolean>;
  deleteConversation: (id: string) => Promise<void>;
  sendUserMessage: () => Promise<void>;
  cancelStreaming: () => Promise<void>;
  openWorkspace: (messageId: string) => void;
  openResource: (uri: string) => void;
  boundLabel: (conversation?: ConversationVo) => string;
};
