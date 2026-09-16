import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { message } from '@sue/design-web-react';
import type {
  AiChatStreamEventVo,
  AiWorkspacePartVo,
  ConversationVo,
  MessageVo,
  RuntimeAgentVo,
} from '@true-north/vo';
import { AiService } from '@true-north/web-service';
import { useWorkbench } from '../workbench';
import { sharedReactContext, useRendererPlatform } from '@true-north/plugin-sdk/renderer';
import type { WorkbenchToolRegistry } from '../workbench/types';
import { resolveAgentId } from './agent-selection';
import {
  applyDeltaToMessages,
  applyFetchedMessages,
  applyMessageToList,
  enqueuePendingStreamEvent,
  findStreamByConversation,
  findStreamById,
  markStreamSuppressError,
  materializeBeginStream,
  patchConversationMessages,
  removeStream,
  streamingConversationIds,
  type PendingStreamBuffers,
  type StreamRegistry,
} from './stream-state';
import { resourceLinksInText } from './mention';
import type { AiDraft, SessionValue, ComposerInputRef } from './types';

const EMPTY_DRAFT: AiDraft = { text: '', links: [] };

function isAiPath(pathname: string) {
  return pathname === '/ai' || pathname.startsWith('/ai/');
}

const AiSessionContext = sharedReactContext<SessionValue | null>(
  '__true_north_ai_session_context__',
  null,
);

function toolTabTitle(part: AiWorkspacePartVo, tools: WorkbenchToolRegistry): string {
  const definition = tools.find(part.workspaceKey);
  if (!definition) return '工作台';
  try {
    return definition.title(definition.parsePayload(part.payload) as never);
  } catch {
    return '工作台';
  }
}

function workspaceParts(item: MessageVo): AiWorkspacePartVo[] {
  return item.parts.filter((part): part is AiWorkspacePartVo => part.type === 'workspace');
}

function shouldAutoOpenWorkspace(
  item: MessageVo,
  force: boolean,
  tools: WorkbenchToolRegistry
): boolean {
  return workspaceParts(item).some((workspace) => {
    const definition = tools.find(workspace.workspaceKey);
    if (!definition?.autoOpen) return force;
    try {
      return definition.autoOpen({
        payload: definition.parsePayload(workspace.payload) as never,
        message: item,
        force,
      });
    } catch {
      return force;
    }
  });
}

function tabInputForPart(
  item: MessageVo,
  part: AiWorkspacePartVo,
  tools: WorkbenchToolRegistry,
) {
  return {
    conversationId: item.conversationId,
    messageId: item.id,
    workspaceId: part.workspaceId,
    workspaceKey: part.workspaceKey,
    title: toolTabTitle(part, tools),
    payload: part.payload,
  };
}

function conversationSearch(id?: string | null) {
  const next = new URLSearchParams();
  if (id) next.set('conversationId', id);
  return next;
}

function titleFromFirstMessage(text: string): string {
  const compact = text.replace(/\s+/g, ' ').trim();
  if (!compact) return '新会话';
  return compact.length <= 24 ? compact : `${compact.slice(0, 24)}…`;
}

export function AiSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const onAiPage = isAiPath(location.pathname);
  const { openToolTab, openPluginView, pendingFollowUp, clearFollowUp, tools } = useWorkbench();
  const platform = useRendererPlatform();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState<ConversationVo[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, MessageVo[]>>(
    {}
  );
  const [draft, setDraftState] = useState<AiDraft>(EMPTY_DRAFT);
  const [streamRegistry, setStreamRegistry] = useState<StreamRegistry>({});
  const [streamError, setStreamError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [codingAgents, setCodingAgents] = useState<RuntimeAgentVo[]>([]);
  const [defaultAgentId, setDefaultAgentId] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [pendingThreadResetById, setPendingThreadResetById] = useState<Record<string, boolean>>({});
  const composerInputRef = useRef<ComposerInputRef>(null);
  const openToolTabRef = useRef(openToolTab);
  openToolTabRef.current = openToolTab;
  const toolsRef = useRef(tools);
  toolsRef.current = tools;
  const conversationIdRef = useRef<string | null>(null);
  const creatingConversationRef = useRef(false);
  const streamRegistryRef = useRef(streamRegistry);
  streamRegistryRef.current = streamRegistry;
  const messagesCacheRef = useRef(messagesByConversation);
  messagesCacheRef.current = messagesByConversation;
  const pendingStreamEventsRef = useRef<PendingStreamBuffers>({});
  conversationIdRef.current = activeConversationId;

  const commitStreamRegistry = useCallback(
    (updater: (registry: StreamRegistry) => StreamRegistry) => {
      setStreamRegistry((registry) => {
        const next = updater(registry);
        streamRegistryRef.current = next;
        return next;
      });
    },
    []
  );

  const commitMessages = useCallback(
    (updater: (cache: Record<string, MessageVo[]>) => Record<string, MessageVo[]>) => {
      setMessagesByConversation((cache) => {
        const next = updater(cache);
        messagesCacheRef.current = next;
        return next;
      });
    },
    []
  );

  const activeConversation = conversations.find((item) => item.id === activeConversationId);
  const selectedAgent = codingAgents.find((item) => item.id === selectedAgentId);
  const canSend = Boolean(selectedAgent?.available);
  const activeStream = findStreamByConversation(streamRegistry, activeConversationId);
  const streaming = Boolean(activeStream);
  const streamingAssistantId = activeStream?.assistantId ?? null;
  const activeMessages = activeConversationId
    ? messagesByConversation[activeConversationId] || []
    : [];
  const threadWillReset = Boolean(
    (activeConversationId && pendingThreadResetById[activeConversationId]) ||
      (activeConversation?.runtimeId && activeConversation.runtimeId !== selectedAgentId)
  );

  const setDraft = useCallback((value: string | AiDraft) => {
    if (typeof value === 'string') {
      setDraftState((prev) => ({ ...prev, text: value }));
      return;
    }
    setDraftState(value);
  }, []);

  const focusComposer = useCallback(() => {
    composerInputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!pendingFollowUp) return;
    if (!onAiPage) return;
    if (pendingFollowUp.conversationId !== activeConversationId) {
      const next = conversationSearch(pendingFollowUp.conversationId);
      setSearchParams(next, { replace: true });
      return;
    }
    setDraft(pendingFollowUp.text);
    focusComposer();
    clearFollowUp();
  }, [
    activeConversationId,
    clearFollowUp,
    clearFollowUp,
    focusComposer,
    onAiPage,
    pendingFollowUp,
    searchParams,
    setDraft,
    setSearchParams,
  ]);

  const refreshConversations = useCallback(async (preferId?: string | null) => {
    const result = await AiService.listConversations();
    if (result.ok === false) {
      message.error(result.message);
      return [] as ConversationVo[];
    }
    setConversations(result.data);
    if (preferId && result.data.some((item) => item.id === preferId)) {
      setActiveConversationId(preferId);
    }
    return result.data;
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    const result = await AiService.listMessages(conversationId);
    if (result.ok === false) {
      message.error(result.message);
      return;
    }
    commitMessages((cache) =>
      applyFetchedMessages(
        cache,
        conversationId,
        result.data,
        Boolean(findStreamByConversation(streamRegistryRef.current, conversationId))
      )
    );
  }, [commitMessages]);

  const beginStream = useCallback(
    (input: {
      conversationId: string;
      streamId: string;
      user: MessageVo;
      assistant: MessageVo;
      autoOpenOnDone: boolean;
    }) => {
      const started = materializeBeginStream({
        cache: messagesCacheRef.current,
        registry: streamRegistryRef.current,
        pending: pendingStreamEventsRef.current,
        conversationId: input.conversationId,
        streamId: input.streamId,
        user: input.user,
        assistant: input.assistant,
        autoOpenOnDone: input.autoOpenOnDone,
      });
      pendingStreamEventsRef.current = started.pending;
      streamRegistryRef.current = started.registry;
      messagesCacheRef.current = started.cache;
      setStreamRegistry(started.registry);
      setMessagesByConversation(started.cache);

      if (started.terminal?.event === 'done') {
        setPendingThreadResetById((prev) => {
          if (!prev[input.conversationId]) return prev;
          const next = { ...prev };
          delete next[input.conversationId];
          return next;
        });
        if (shouldAutoOpenWorkspace(started.terminal.message, input.autoOpenOnDone, toolsRef.current)) {
          const parts = workspaceParts(started.terminal.message);
          for (const part of parts) {
            void openToolTabRef.current(tabInputForPart(started.terminal.message, part, toolsRef.current));
          }
        }
        void refreshConversations(conversationIdRef.current);
      } else if (started.terminal?.event === 'error') {
        if (conversationIdRef.current === input.conversationId) {
          setStreamError(started.terminal.messageText);
        }
        message.error(started.terminal.messageText);
        void loadMessages(input.conversationId);
      }
    },
    [loadMessages, refreshConversations]
  );

  const loadMeta = useCallback(async () => {
    const [agentsResult, selectionResult] = await Promise.all([
      AiService.listRuntimeAgents(),
      AiService.getRuntimeSelection(),
    ]);
    const agents = agentsResult.ok === false ? [] : agentsResult.data;
    setCodingAgents(agents);
    const savedId = selectionResult.ok === false ? null : selectionResult.data.runtimeId;
    setDefaultAgentId(resolveAgentId(agents, savedId));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await loadMeta();
      if (cancelled) return;
      await refreshConversations();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadMeta, refreshConversations]);

  useEffect(() => {
    if (!onAiPage) return;
    void loadMeta();
  }, [loadMeta, onAiPage]);

  useEffect(() => {
    if (!activeConversationId) return;
    if (creatingConversationRef.current) return;
    if (findStreamByConversation(streamRegistryRef.current, activeConversationId)) return;
    void loadMessages(activeConversationId);
  }, [activeConversationId, loadMessages]);

  useEffect(() => {
    if (creatingConversationRef.current) return;
    if (!codingAgents.length) return;
    if (!activeConversationId) return;
    const conversation = conversations.find((item) => item.id === activeConversationId);
    if (!conversation) return;
    setSelectedAgentId(resolveAgentId(codingAgents, conversation.runtimeId || defaultAgentId));
  }, [activeConversationId, conversations, codingAgents, defaultAgentId]);

  useEffect(() => {
    if (creatingConversationRef.current) return;
    if (activeConversationId) return;
    if (!codingAgents.length) return;
    setSelectedAgentId(resolveAgentId(codingAgents, defaultAgentId));
  }, [activeConversationId, codingAgents, defaultAgentId]);

  useEffect(() => {
    if (!onAiPage) return;
    const conversationId = searchParams.get('conversationId');
    if (conversationId) {
      creatingConversationRef.current = false;
      if (conversationId !== activeConversationId) {
        setActiveConversationId(conversationId);
      }
      return;
    }
    if (creatingConversationRef.current) return;
    if (activeConversationId) {
      setActiveConversationId(null);
    }
  }, [onAiPage, searchParams, activeConversationId]);

  useEffect(() => {
    const unsubscribe = AiService.subscribeChatStream((event: AiChatStreamEventVo) => {
      const stream = findStreamById(streamRegistryRef.current, event.streamId);
      if (!stream) {
        if (event.event === 'message' || event.event === 'done') {
          commitMessages((cache) =>
            patchConversationMessages(cache, event.message.conversationId, (msgs) =>
              applyMessageToList(msgs, event.message)
            )
          );
        }
        pendingStreamEventsRef.current = enqueuePendingStreamEvent(
          pendingStreamEventsRef.current,
          event
        );
        return;
      }

      if (event.event === 'delta') {
        commitMessages((cache) =>
          patchConversationMessages(cache, stream.conversationId, (msgs) =>
            applyDeltaToMessages(msgs, stream.assistantId, event.delta)
          )
        );
        return;
      }

      if (event.event === 'message') {
        commitMessages((cache) =>
          patchConversationMessages(cache, stream.conversationId, (msgs) =>
            applyMessageToList(msgs, event.message)
          )
        );
        return;
      }

      if (event.event === 'done') {
        commitMessages((cache) =>
          patchConversationMessages(cache, stream.conversationId, (msgs) =>
            applyMessageToList(msgs, event.message)
          )
        );
        commitStreamRegistry((registry) => removeStream(registry, event.streamId));
        setPendingThreadResetById((prev) => {
          if (!prev[stream.conversationId]) return prev;
          const next = { ...prev };
          delete next[stream.conversationId];
          return next;
        });
        if (shouldAutoOpenWorkspace(event.message, stream.autoOpenOnDone, toolsRef.current)) {
          for (const part of workspaceParts(event.message)) {
            void openToolTabRef.current(tabInputForPart(event.message, part, toolsRef.current));
          }
        }
        void refreshConversations(conversationIdRef.current);
        return;
      }

      if (event.event === 'error') {
        const suppressed = stream.suppressError;
        commitStreamRegistry((registry) => removeStream(registry, event.streamId));
        if (suppressed) return;
        if (conversationIdRef.current === stream.conversationId) {
          setStreamError(event.messageText);
        }
        message.error(event.messageText);
        void loadMessages(stream.conversationId);
      }
    });
    return unsubscribe;
  }, [commitMessages, commitStreamRegistry, loadMessages, refreshConversations]);

  const selectConversation = useCallback(
    (id: string) => {
      setActiveConversationId(id);
      setStreamError(null);
      if (!onAiPage) {
        navigate(`/ai?conversationId=${encodeURIComponent(id)}`);
        return;
      }
      setSearchParams(conversationSearch(id), { replace: true });
    },
    [navigate, onAiPage, setSearchParams]
  );

  const createBlankConversation = useCallback(async () => {
    setActiveConversationId(null);
    setStreamError(null);
    if (!onAiPage) {
      navigate('/ai');
      return;
    }
    setSearchParams(conversationSearch(null), { replace: true });
    requestAnimationFrame(() => focusComposer());
  }, [focusComposer, navigate, onAiPage, setSearchParams]);

  const renameConversation = useCallback(async (id: string, title: string) => {
    const result = await AiService.renameConversation(id, { title });
    if (result.ok === false) {
      message.error(result.message);
      return false;
    }
    setConversations((items) => items.map((item) => (item.id === id ? result.data : item)));
    return true;
  }, []);

  const pinConversation = useCallback(async (id: string, pinned: boolean) => {
    const result = await AiService.pinConversation(id, { pinned });
    if (result.ok === false) {
      message.error(result.message);
      return false;
    }
    setConversations((items) =>
      [...items.map((item) => (item.id === id ? result.data : item))].sort((a, b) => {
        if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      })
    );
    return true;
  }, []);

  const deleteConversation = useCallback(
    async (id: string) => {
      const stream = findStreamByConversation(streamRegistryRef.current, id);
      if (stream) {
        commitStreamRegistry((registry) => markStreamSuppressError(registry, stream.streamId));
        await AiService.cancelMessageStream(stream.streamId);
      }
      const result = await AiService.deleteConversation(id);
      if (result.ok === false) {
        message.error(result.message);
        return;
      }
      commitStreamRegistry((registry) => (stream ? removeStream(registry, stream.streamId) : registry));
      commitMessages((cache) => {
        if (!(id in cache)) return cache;
        const next = { ...cache };
        delete next[id];
        return next;
      });
      setPendingThreadResetById((prev) => {
        if (!prev[id]) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
      const remaining = conversations.filter((item) => item.id !== id);
      setConversations(remaining);
      if (conversationIdRef.current !== id) return;
      setActiveConversationId(null);
      setStreamError(null);
      if (onAiPage) {
        setSearchParams(conversationSearch(null), { replace: true });
        requestAnimationFrame(() => focusComposer());
      }
    },
    [commitMessages, commitStreamRegistry, conversations, focusComposer, onAiPage, setSearchParams]
  );

  const selectCodingAgent = useCallback(
    async (id: string) => {
      const next = codingAgents.find((item) => item.id === id);
      if (!next?.available) return;
      const previousRuntimeId = activeConversation?.runtimeId;
      if (!activeConversationId) {
        setSelectedAgentId(id);
        return;
      }
      const patched = await AiService.patchConversationRuntime(activeConversationId, {
        runtimeId: id,
      });
      if (patched.ok === false) {
        message.error(patched.message);
        return;
      }
      setSelectedAgentId(id);
      setConversations((items) =>
        items.map((item) => (item.id === activeConversationId ? patched.data : item))
      );
      if (previousRuntimeId && previousRuntimeId !== id) {
        setPendingThreadResetById((prev) => ({ ...prev, [activeConversationId]: true }));
        message.info(`之后的发送将由「${next.name}」重新开始，不会续跑上一 Agent 的对话线程。`);
      }
    },
    [activeConversation?.runtimeId, activeConversationId, codingAgents]
  );

  const cancelStreaming = useCallback(async () => {
    const stream = findStreamByConversation(streamRegistryRef.current, conversationIdRef.current);
    if (!stream) return;
    commitStreamRegistry((registry) => markStreamSuppressError(registry, stream.streamId));
    await AiService.cancelMessageStream(stream.streamId);
    commitStreamRegistry((registry) => removeStream(registry, stream.streamId));
    void loadMessages(stream.conversationId);
  }, [commitStreamRegistry, loadMessages]);

  const sendUserMessage = useCallback(async () => {
    const text = draft.text.trim();
    if (!text || !canSend) return;
    if (findStreamByConversation(streamRegistryRef.current, activeConversationId)) return;
    const resourceLinks = resourceLinksInText(text, draft.links);

    setDraftState(EMPTY_DRAFT);
    setStreamError(null);

    let conversationId = activeConversationId;
    if (!conversationId) {
      creatingConversationRef.current = true;
      const created = await AiService.createConversation({
        title: titleFromFirstMessage(text),
        runtimeId: selectedAgentId || undefined,
      });
      if (created.ok === false) {
        creatingConversationRef.current = false;
        setDraftState({ text, links: resourceLinks });
        message.error(created.message);
        return;
      }
      conversationId = created.data.id;
      setConversations((items) => [created.data, ...items]);
      setActiveConversationId(conversationId);
      setSearchParams(conversationSearch(conversationId), { replace: true });
    }

    const result = await AiService.startMessageStream(conversationId, { text, resourceLinks });
    if (result.ok === false) {
      setDraftState({ text, links: resourceLinks });
      message.error(result.message);
      return;
    }

    beginStream({
      conversationId,
      streamId: result.data.streamId,
      user: result.data.user,
      assistant: result.data.assistant,
      autoOpenOnDone: false,
    });
  }, [
    activeConversationId,
    beginStream,
    canSend,
    draft,
    selectedAgentId,
    setSearchParams,
  ]);

  const openWorkspace = useCallback(
    (messageId: string, workspaceId?: string) => {
      const item = activeMessages.find((entry) => entry.id === messageId);
      if (!item) return;
      const parts = workspaceParts(item);
      const focused = workspaceId ? parts.find((part) => part.workspaceId === workspaceId) : parts[0];
      if (!focused) return;
      const others = parts.filter((part) => part.workspaceId !== focused.workspaceId);
      for (const part of [...others, focused]) {
        void openToolTab({
          ...tabInputForPart(item, part, tools),
          conversationId: item.conversationId || activeConversationId || '',
        });
      }
    },
    [activeConversationId, activeMessages, openToolTab, tools]
  );

  const openResource = useCallback(
    (uri: string) => {
      const request = platform.openResource(uri);
      if (!request) {
        message.warning('无法打开该资源');
        return;
      }
      void openPluginView(request);
    },
    [openPluginView, platform],
  );

  const boundLabel = useCallback((conversation?: ConversationVo) => {
    const attachment = conversation?.attachments?.[0];
    return attachment?.label || attachment?.uri || '';
  }, []);

  const value: SessionValue = {
    conversations,
    activeConversationId,
    activeConversation,
    activeMessages,
    draft,
    setDraft,
    composerInputRef,
    focusComposer,
    streaming,
    streamingAssistantId,
    streamingConversationIds: streamingConversationIds(streamRegistry),
    streamError,
    loading,
    codingAgents,
    selectedAgentId,
    selectedAgent,
    selectCodingAgent,
    canSend,
    threadWillReset,
    selectConversation,
    createBlankConversation,
    renameConversation,
    pinConversation,
    deleteConversation,
    sendUserMessage,
    cancelStreaming,
    openWorkspace,
    openResource,
    boundLabel,
  };

  return <AiSessionContext.Provider value={value}>{children}</AiSessionContext.Provider>;
}

export function useAiSessionContext() {
  const ctx = useContext(AiSessionContext);
  if (!ctx) {
    throw new Error('useAiSessionContext must be used within AiSessionProvider');
  }
  return ctx;
}
