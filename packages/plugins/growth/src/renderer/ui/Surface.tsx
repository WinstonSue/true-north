import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Surface.module.less';

export function Surface(props: HTMLAttributes<HTMLDivElement> & { children: ReactNode; padded?: boolean }) {
  const { padded, className, children, ...rest } = props;
  return (
    <div
      className={`${styles.surface}${padded ? ` ${styles.padded}` : ''}${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {children}
    </div>
  );
}
