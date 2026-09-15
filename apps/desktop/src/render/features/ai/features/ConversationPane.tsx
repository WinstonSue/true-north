import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Input, Select } from '@sue/design-web-react';
import { ProductSurface, type ProductSurfaceHostProps } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import type { AiResourceMentionVo } from '@true-north/vo';
import { AiService } from '@true-north/web-service';
import useLocale from '@/utils/useLocale';
import {
  Conversation,
  ConversationEmptyState,
  ConversationScrollButton,
  ConversationViewport,
} from '../components/Conversation';
import { Message, MessageContent, MessageParts } from '../components/Message';
import { PromptInput, PromptInputSubmit } from '../components/PromptInput';
import { useAiSessionContext } from '../context';
import {
  cycleMentionIndex,
  insertMentionToken,
  mentionKindLabel,
  mentionOptionId,
  readMentionQuery,
  resourceLinksInText,
  upsertResourceLink,
} from '../mention';
import styles from '../style.module.less';
import type { ComposerInputRef } from '../types';

const MENTION_DEBOUNCE_MS = 120;

export function ConversationPane({ 'data-product-ref': productRefAttr }: ProductSurfaceHostProps) {
  const {
    activeConversation,
    activeConversationId,
    activeMessages,
    draft,
    setDraft,
    sendUserMessage,
    cancelStreaming,
    streaming,
    streamingAssistantId,
    openWorkspace,
    openResource,
    codingAgents,
    selectedAgentId,
    selectedAgent,
    selectCodingAgent,
    canSend,
    threadWillReset,
    composerInputRef,
  } = useAiSessionContext();
  const t = useLocale();
  const [cursor, setCursor] = useState(0);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [mentionItems, setMentionItems] = useState<AiResourceMentionVo[]>([]);
  const mentionRequestRef = useRef(0);

  const mention = mentionOpen ? readMentionQuery(draft.text, cursor) : null;
  const mentionQuery = mention ? mention.query : null;

  useEffect(() => {
    if (mentionQuery === null) {
      mentionRequestRef.current += 1;
      setMentionItems([]);
      return;
    }
    const requestId = mentionRequestRef.current + 1;
    mentionRequestRef.current = requestId;
    const timer = window.setTimeout(() => {
      void AiService.searchResourceMentions(mentionQuery).then((result) => {
        if (requestId !== mentionRequestRef.current) return;
        setMentionItems(result.ok ? result.data : []);
      });
    }, MENTION_DEBOUNCE_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [mentionQuery]);

  useEffect(() => {
    setMentionIndex(0);
  }, [mention?.query, mentionItems.length]);

  const insertMention = (item: AiResourceMentionVo) => {
    const applied = insertMentionToken(draft.text, cursor, item.label);
    if (!applied) return;
    setDraft({
      text: applied.text,
      links: resourceLinksInText(applied.text, upsertResourceLink(draft.links, { uri: item.uri, label: item.label })),
    });
    setMentionOpen(false);
    setMentionItems([]);
    setCursor(applied.cursor);
    composerInputRef.current?.focus();
    requestAnimationFrame(() => {
      const textarea = resolveTextArea(composerInputRef.current);
      textarea?.setSelectionRange(applied.cursor, applied.cursor);
    });
  };

  const onComposerKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Escape' && mentionOpen) {
      event.preventDefault();
      setMentionOpen(false);
      return;
    }

    if (mentionOpen && mentionItems.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setMentionIndex((index) => cycleMentionIndex(index, 1, mentionItems.length));
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setMentionIndex((index) => cycleMentionIndex(index, -1, mentionItems.length));
        return;
      }
      if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
        event.preventDefault();
        insertMention(mentionItems[mentionIndex] ?? mentionItems[0]);
        return;
      }
    }

    if (event.nativeEvent.isComposing || event.key === 'Process') return;
    if (event.key !== 'Enter') return;
    if (event.shiftKey) return;
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  const isEmpty = activeMessages.length === 0;
  const composerDisabled = streaming || !canSend;
  const sendDisabled = !canSend || !draft.text.trim() || streaming;
  const unavailableReason = !codingAgents.length
    ? '还没有可用的 AI，无法发送'
    : selectedAgent && !selectedAgent.available
      ? selectedAgent.unavailableReason || '当前 Agent 不可用，无法发送'
      : '当前 Agent 不可用，无法发送';

  const agentPicker = (
    <ProductSurface id={productRef('ai.session.view.agent-picker')}>
      <Select
        size="small"
        variant="borderless"
        value={selectedAgentId || undefined}
        aria-label="编码 Agent"
        className={styles.agentSelect}
        popupMatchSelectWidth={false}
        options={codingAgents.map((agent) => ({
          value: agent.id,
          label: agent.available ? agent.name : `${agent.name}（${agent.unavailableReason}）`,
          disabled: !agent.available,
        }))}
        onChange={(value) => void selectCodingAgent(String(value))}
      />
    </ProductSurface>
  );

  const agentHint =
    threadWillReset && selectedAgent ? (
      <span className={styles.agentSwitchHint}>
        之后的发送将由「{selectedAgent.name}」重新开始，不会续跑上一 Agent 的对话线程。
      </span>
    ) : null;

  const mentionSlot =
    mention && mentionItems.length ? (
      <div className={styles.mentionPanel} role="listbox">
        {mentionItems.map((item, index) => (
          <button
            key={item.uri}
            id={mentionOptionId(item.uri)}
            type="button"
            role="option"
            aria-selected={index === mentionIndex}
            className={`${styles.mentionItem}${index === mentionIndex ? ` ${styles.mentionItemActive}` : ''}`}
            onMouseEnter={() => setMentionIndex(index)}
            onMouseDown={(event) => {
              event.preventDefault();
              insertMention(item);
            }}
          >
            <span className={styles.mentionKind}>{mentionKindLabel(item, t as Record<string, string>)}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    ) : null;

  const mentionActiveItem = mentionItems[mentionIndex] ?? mentionItems[0];
  const mentionComboboxProps =
    mention && mentionItems.length && mentionActiveItem
      ? {
          role: 'combobox' as const,
          'aria-expanded': true,
          'aria-activedescendant': mentionOptionId(mentionActiveItem.uri),
        }
      : undefined;

  return (
    <Conversation data-product-ref={productRefAttr}>
      <ConversationViewport resetKey={activeConversationId} followOnSend={streaming}>
        {isEmpty ? (
          <ConversationEmptyState>开始一段新对话，或直接记下今天的事</ConversationEmptyState>
        ) : (
          activeMessages.map((message) => (
            <Message key={message.id} role={message.role}>
              <MessageContent role={message.role}>
                <MessageParts
                  message={message}
                  streaming={streaming && message.id === streamingAssistantId}
                  onOpenWorkspace={openWorkspace}
                  onOpenResource={openResource}
                />
              </MessageContent>
            </Message>
          ))
        )}
        <ConversationScrollButton />
      </ConversationViewport>
      <PromptInput
        mentionSlot={mentionSlot}
        tools={agentPicker}
        hint={agentHint}
        submit={
          <PromptInputSubmit
            streaming={streaming}
            disabled={sendDisabled}
            onStop={() => void cancelStreaming()}
          />
        }
        onSubmit={() => {
          if (!sendDisabled) void sendUserMessage();
        }}
      >
        <Input.TextArea
          ref={composerInputRef}
          className="w-full"
          variant="borderless"
          autoSize={{ minRows: 2, maxRows: 8 }}
          value={draft.text}
          placeholder={
            canSend
              ? activeConversation
                ? '继续追问…'
                : '记下今天的事，或直接提问…'
              : unavailableReason
          }
          disabled={composerDisabled}
          onKeyDown={onComposerKey}
          onChange={(event) => {
            const nextText = event.target.value;
            const nextCursor = event.target.selectionStart ?? nextText.length;
            setDraft({
              text: nextText,
              links: resourceLinksInText(nextText, draft.links),
            });
            setCursor(nextCursor);
            setMentionOpen(Boolean(readMentionQuery(nextText, nextCursor)));
          }}
          onSelect={(event) => {
            const target = event.target as HTMLTextAreaElement;
            const nextCursor = target.selectionStart ?? 0;
            setCursor(nextCursor);
            setMentionOpen(Boolean(readMentionQuery(draft.text, nextCursor)));
          }}
          {...mentionComboboxProps}
        />
      </PromptInput>
    </Conversation>
  );
}

function resolveTextArea(ref: ComposerInputRef | null): HTMLTextAreaElement | null {
  if (!ref) return null;
  if (ref.nativeElement instanceof HTMLTextAreaElement) return ref.nativeElement;
  const nested = ref.resizableTextArea?.textArea;
  return nested instanceof HTMLTextAreaElement ? nested : null;
}
