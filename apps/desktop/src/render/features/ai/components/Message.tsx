import type { ReactNode } from 'react';
import { Button, Flex } from '@sue/design-web-react';
import type {
  AiTextPartVo,
  AiToolPartVo,
  AiWorkspacePartVo,
  MessageVo,
} from '@true-north/vo';
import { useWorkbench } from '../../workbench';
import { splitTextByMentions } from '../mention';
import { Tool } from './Tool';
import styles from '../style.module.less';

type MessageProps = {
  role: MessageVo['role'];
  children: ReactNode;
};

type MessagePartsProps = {
  message: MessageVo;
  streaming?: boolean;
  onOpenResource?: (uri: string) => void;
  onOpenWorkspace?: (messageId: string, workspaceId?: string) => void;
};

export function Message({ role, children }: MessageProps) {
  const isUser = role === 'user';
  return (
    <Flex
      className={styles.messageRow}
      justify={isUser ? 'flex-end' : 'flex-start'}
    >
      {children}
    </Flex>
  );
}

export function MessageContent({ role, children }: { role?: MessageVo['role']; children: ReactNode }) {
  const isUser = role === 'user';
  return <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : ''}`}>{children}</div>;
}

export function MessageTextPart({
  part,
  showCursor,
  onOpenResource,
}: {
  part: AiTextPartVo;
  showCursor?: boolean;
  onOpenResource?: (uri: string) => void;
}) {
  const resourceLinks = part.resourceLinks || [];
  const entityLinks = part.entityLinks || [];
  if (!part.text && !resourceLinks.length && !entityLinks.length && !showCursor) return null;
  const split = splitTextByMentions(part.text || '', resourceLinks, entityLinks);
  const nodes: ReactNode[] = split.segments.map((segment, index) => {
    if (segment.type === 'text') return <span key={`text-${index}`}>{segment.value}</span>;
    if (segment.type === 'resource') {
      return (
        <button
          key={`resource-${segment.uri}-${index}`}
          type="button"
          className={styles.entityLink}
          onClick={() => onOpenResource?.(segment.uri)}
        >
          @{segment.label}
        </button>
      );
    }
    return (
      <span key={`entity-${segment.key}-${index}`} className={styles.entityLink}>
        @{segment.label}
      </span>
    );
  });
  return (
    <>
      {part.text || showCursor ? (
        <p className={styles.bubbleText}>
          {nodes}
          {showCursor ? <span className={styles.streamCursor} /> : null}
        </p>
      ) : null}
      {split.unmatchedResources.length || split.unmatchedEntities.length ? (
        <Flex gap={8} wrap="wrap">
          {split.unmatchedResources.map((link) => (
            <button
              key={link.uri}
              type="button"
              className={styles.entityLink}
              onClick={() => onOpenResource?.(link.uri)}
            >
              @{link.label}
            </button>
          ))}
          {split.unmatchedEntities.map((link) => (
            <span key={`${link.type}-${link.id}`} className={styles.entityLink}>
              @{link.label}
            </span>
          ))}
        </Flex>
      ) : null}
    </>
  );
}

export function MessageWorkspacePart({
  part,
  messageId,
  onOpenWorkspace,
}: {
  part: AiWorkspacePartVo;
  messageId: string;
  onOpenWorkspace?: (messageId: string, workspaceId?: string) => void;
}) {
  const { tools } = useWorkbench();
  if (!onOpenWorkspace) return null;
  const definition = tools.find(part.workspaceKey);
  let label = '打开工作台';
  if (definition) {
    try {
      label = definition.entryLabel(definition.parsePayload(part.payload) as never);
    } catch {
      label = '打开工作台';
    }
  }
  return (
      <div className={styles.workspaceChip}>
        <Button size="small" type="link" onClick={() => onOpenWorkspace(messageId, part.workspaceId)}>
          {label}
        </Button>
      </div>
  );
}

export function MessageParts({
  message,
  streaming,
  onOpenResource,
  onOpenWorkspace,
}: MessagePartsProps) {
  const parts = message.parts || [];
  const lastTextIndex = parts.reduce((found, part, index) => (part.type === 'text' ? index : found), -1);

  return (
    <>
      {parts.map((part, index) => {
        const key = `${message.id}-${part.type}-${index}`;
        if (part.type === 'text') {
          return (
            <MessageTextPart
              key={key}
              part={part}
              showCursor={Boolean(streaming && index === lastTextIndex)}
              onOpenResource={onOpenResource}
            />
          );
        }
        if (part.type === 'tool') {
          return <Tool key={key} part={part as AiToolPartVo} />;
        }
        if (part.type === 'workspace') {
          return (
            <MessageWorkspacePart
              key={key}
              part={part}
              messageId={message.id}
              onOpenWorkspace={onOpenWorkspace}
            />
          );
        }
        return null;
      })}
    </>
  );
}
