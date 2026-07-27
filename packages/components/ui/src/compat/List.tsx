import React, { ReactNode } from 'react';
import { Flex } from '@sue/design-web-react';

export interface ListItemMetaProps {
  title?: ReactNode;
  description?: ReactNode;
  avatar?: ReactNode;
}

function ListItemMeta({ title, description, avatar }: ListItemMetaProps) {
  return (
    <Flex gap={12} align="flex-start">
      {avatar}
      <Flex vertical gap={4} style={{ minWidth: 0, flex: 1 }}>
        {title && <div>{title}</div>}
        {description && <div style={{ color: 'var(--color-text-3)' }}>{description}</div>}
      </Flex>
    </Flex>
  );
}

export interface ListItemProps {
  children?: ReactNode;
  actions?: ReactNode[];
  actionLayout?: 'horizontal' | 'vertical';
  extra?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

function ListItem({
  children,
  actions,
  actionLayout = 'horizontal',
  extra,
  style,
  className,
  onClick,
}: ListItemProps) {
  return (
    <div
      className={className}
      style={{
        padding: '12px 0',
        display: 'flex',
        flexDirection: actionLayout === 'vertical' ? 'column' : 'row',
        gap: 8,
        ...style,
      }}
      onClick={onClick}
    >
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      {extra}
      {actions && actions.length > 0 && (
        <Flex gap={8} wrap="wrap">
          {actions.map((action, index) => (
            <React.Fragment key={index}>{action}</React.Fragment>
          ))}
        </Flex>
      )}
    </div>
  );
}

ListItem.Meta = ListItemMeta;

export interface ListProps {
  bordered?: boolean;
  split?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  dataSource?: unknown[];
  render?: (item: unknown, index: number) => ReactNode;
  footer?: ReactNode;
  noDataElement?: ReactNode;
}

function List({
  bordered,
  split = true,
  className,
  style,
  children,
  dataSource,
  render,
  footer,
  noDataElement,
}: ListProps) {
  const content =
    dataSource && render
      ? dataSource.map((item, index) => (
          <React.Fragment key={index}>{render(item, index)}</React.Fragment>
        ))
      : children;

  const childArray = React.Children.toArray(content);
  const empty = childArray.length === 0;

  return (
    <div
      className={className}
      style={{
        border: bordered ? '1px solid var(--color-border-2, #e5e6eb)' : undefined,
        borderRadius: bordered ? 8 : undefined,
        ...style,
      }}
    >
      {empty ? (
        noDataElement
      ) : (
        childArray.map((child, index) => (
          <div
            key={index}
            style={
              split && index > 0
                ? { borderTop: '1px solid var(--color-border-2, #e5e6eb)' }
                : undefined
            }
          >
            {child}
          </div>
        ))
      )}
      {footer && (
        <div style={{ borderTop: '1px solid var(--color-border-2, #e5e6eb)' }}>{footer}</div>
      )}
    </div>
  );
}

List.Item = ListItem;

export { List };
