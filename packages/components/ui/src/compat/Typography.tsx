import React from 'react';
import clsx from 'clsx';

type EllipsisConfig = boolean | { rows?: number };

type TypographyProps = React.HTMLAttributes<HTMLElement> & {
  className?: string;
  style?: React.CSSProperties;
  heading?: 1 | 2 | 3 | 4 | 5 | 6;
  ellipsis?: EllipsisConfig;
  /** Arco Typography type */
  type?: 'secondary' | 'primary' | 'success' | 'warning' | 'error';
};

function getEllipsisStyle(ellipsis?: EllipsisConfig): React.CSSProperties | undefined {
  if (!ellipsis) return undefined;
  const rows = typeof ellipsis === 'object' ? ellipsis.rows ?? 1 : 1;
  if (rows <= 1) {
    return {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    };
  }
  return {
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: rows,
  };
}

function Title({ heading = 1, className, style, children, ellipsis, ...rest }: TypographyProps) {
  const Tag = (`h${heading}` as unknown) as keyof JSX.IntrinsicElements;
  return (
    <Tag
      className={clsx('tn-typography-title', className)}
      style={{ ...getEllipsisStyle(ellipsis), ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function typeColor(type?: TypographyProps['type']): string | undefined {
  if (type === 'secondary') return 'var(--color-text-3, rgba(0,0,0,0.45))';
  if (type === 'primary') return 'var(--color-primary-6, #165dff)';
  if (type === 'success') return '#00b42a';
  if (type === 'warning') return '#ff7d00';
  if (type === 'error') return '#f53f3f';
  return undefined;
}

function Text({ className, style, children, ellipsis, type, ...rest }: TypographyProps) {
  return (
    <span
      className={clsx('tn-typography-text', className)}
      style={{ color: typeColor(type), ...getEllipsisStyle(ellipsis), ...style }}
      {...rest}
    >
      {children}
    </span>
  );
}

function Paragraph({ className, style, children, ellipsis, type, ...rest }: TypographyProps) {
  return (
    <p
      className={clsx('tn-typography-paragraph', className)}
      style={{ color: typeColor(type), ...getEllipsisStyle(ellipsis), ...style }}
      {...rest}
    >
      {children}
    </p>
  );
}

function Link({
  className,
  style,
  children,
  href,
  ellipsis,
  ...rest
}: TypographyProps & { href?: string }) {
  return (
    <a
      className={clsx('tn-typography-link', className)}
      style={{
        color: 'var(--color-primary-6, #165dff)',
        ...getEllipsisStyle(ellipsis),
        ...style,
      }}
      href={href}
      {...rest}
    >
      {children}
    </a>
  );
}

function Ellipsis({
  className,
  style,
  children,
  rows = 1,
  ...rest
}: TypographyProps & { rows?: number }) {
  return (
    <span
      className={clsx('tn-typography-ellipsis', className)}
      style={{
        ...getEllipsisStyle({ rows }),
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}

const Typography = {
  Title,
  Text,
  Paragraph,
  Ellipsis,
  Link,
};

export { Typography, Link };
