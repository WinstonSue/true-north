import React, { CSSProperties, ReactNode } from 'react';

import cs from 'clsx';
import styles from './style/index.module.less';

interface PanelProps {
  className?: string;
  style?: CSSProperties;
  title?: ReactNode;
  children?: ReactNode;
}

function Panel(props: PanelProps) {
  const { className, style, title, children } = props;
  return (
    <div className={cs(styles.panel, className)} style={style}>
      <h1 className="text-title-1 font-medium">{title}</h1>
      {children}
    </div>);

}

export default Panel;