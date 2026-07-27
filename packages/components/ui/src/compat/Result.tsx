import React, { ReactNode } from 'react';
import { Empty, Flex } from '@sue/design-web-react';

export interface ResultProps {
  status?: 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500' | null;
  title?: ReactNode;
  subTitle?: ReactNode;
  extra?: ReactNode;
  icon?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const statusTitle: Record<string, string> = {
  success: 'Success',
  error: 'Error',
  info: 'Info',
  warning: 'Warning',
  '404': '404',
  '403': '403',
  '500': '500',
};

function Result({ status, title, subTitle, extra, icon, className, style }: ResultProps) {
  const displayTitle = title ?? (status ? statusTitle[status] : undefined);

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap={16}
      className={className}
      style={{ padding: 24, textAlign: 'center', ...style }}
    >
      {icon ?? <Empty description={null} />}
      {displayTitle && <div style={{ fontSize: 20, fontWeight: 600 }}>{displayTitle}</div>}
      {subTitle && <div style={{ color: 'var(--color-text-3, rgba(0,0,0,0.45))' }}>{subTitle}</div>}
      {extra}
    </Flex>
  );
}

export { Result };
