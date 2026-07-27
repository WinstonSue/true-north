import { EnterOutlined } from '@ant-design/icons';
import React from 'react';
import { Space, StarOutlined } from '@sue/design-web-react';

import cs from 'clsx';
import styles from './style/index.module.less';

export interface Message {
  id?: string;
  username?: string;
  content?: string;
  time?: string;
  isCollect?: boolean;
}

export interface MessageItemProps {
  data: Message;
}

function MessageItem(props: MessageItemProps) {
  const { data = {} } = props;
  const classNames = cs(styles['message-item'], {
    [styles['message-item-collected']]: data.isCollect
  });
  return (
    <div className={classNames}>
      <Space size={4} direction="vertical" style={{ width: '100%' }}>
        <span style={{ color: "#ff7d00" }}>{data.username}</span>
        <span>{data.content}</span>
        <div className={styles['message-item-footer']}>
          <div className={styles['message-item-time']}>
            <span className="text-text-3">{data.time}</span>
          </div>
          <div className={styles['message-item-actions']}>
            <div className={styles['message-item-actions-item']}>
              <EnterOutlined />
            </div>
            <div
              className={cs(
                styles['message-item-actions-item'],
                styles['message-item-actions-collect']
              )}>

              <StarOutlined />
            </div>
          </div>
        </div>
      </Space>
    </div>);

}

export default MessageItem;