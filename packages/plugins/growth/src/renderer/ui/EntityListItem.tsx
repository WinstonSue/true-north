import type { ReactNode } from 'react';
import styles from './EntityListItem.module.less';

export function EntityListItem(props: {
  leading?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  trailing?: ReactNode;
  muted?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className={`${styles.item}${props.muted ? ` ${styles.muted}` : ''}`}>
      {props.leading ? <div className={styles.leading}>{props.leading}</div> : null}
      <button type="button" className={styles.body} onClick={props.onClick}>
        <div className={styles.title}>{props.title}</div>
        {props.meta ? <div className={styles.meta}>{props.meta}</div> : null}
      </button>
      {props.trailing ? <div className={styles.trailing}>{props.trailing}</div> : null}
    </div>
  );
}
