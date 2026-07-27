import React from 'react';
import { Empty, Flex } from '@sue/design-web-react';
import MessageItem, { Message } from './item';
import styles from './style/index.module.less';

interface MessageListProps {
  data: Message[];
}

function MessageList(props: MessageListProps) {
  const { data = [] } = props;
  return (
    <div className={styles['message-list']}>
      {data.map((item) => (
        <MessageItem key={item.id} data={item} />
      ))}
      {!data.length && (
        <Flex
          vertical
          align="center"
          justify="center"
          gap={16}
          className="p-6 text-center"
        >
          <Empty description={null} />
          <div className="text-title-1 font-medium">404</div>
        </Flex>
      )}
    </div>
  );
}

export default MessageList;
