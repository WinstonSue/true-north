import React from 'react';
import { Avatar, Button, Space, Tag, Empty, Flex } from '@sue/design-web-react';

import useLocale from '../../utils/useLocale';
import styles from './style/index.module.less';

export interface MessageItemData {
  id: string;
  title: string;
  subTitle?: string;
  avatar?: string;
  content: string;
  time?: string;
  status: number;
  tag?: {
    text?: string;
    color?: string;
  };
}

export type MessageListType = MessageItemData[];

interface MessageListProps {
  data: MessageItemData[];
  unReadData: MessageItemData[];
  onItemClick?: (item: MessageItemData, index: number) => void;
  onAllBtnClick?: (
  unReadData: MessageItemData[],
  data: MessageItemData[])
  => void;
}

function MessageList(props: MessageListProps) {
  const t = useLocale();
  const { data, unReadData } = props;

  function onItemClick(item: MessageItemData, index: number) {
    if (item.status) return;
    props.onItemClick && props.onItemClick(item, index);
  }

  function onAllBtnClick() {
    props.onAllBtnClick && props.onAllBtnClick(unReadData, data);
  }

  return (
    <div>
      {data.length === 0 ?
      <Flex
        vertical
        align="center"
        justify="center"
        gap={16}
        className="p-6 text-center">

          <Empty description={null} />
          <div className="text-title-1 font-medium">404</div>
          <div className="text-text-3">{t['message.empty.tips']}</div>
        </Flex> :

      data.map((item, index) =>
      <div
        key={item.id}
        style={{
          padding: '12px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          opacity: item.status ? 0.5 : 1,
          borderTop:
          index > 0 ? '1px solid var(--color-border-2, #e5e6eb)' : undefined
        }}>

            <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            onItemClick(item, index);
          }}>

              <Flex gap={12} align="flex-start">
                {item.avatar &&
            <Avatar shape="circle" size={36}>
                    <img src={item.avatar} />
                  </Avatar>
            }
                <Flex vertical gap={4} style={{ minWidth: 0, flex: 1 }}>
                  <div className={styles['message-title']}>
                    <Space size={4}>
                      <span>{item.title}</span>
                      <span className="text-text-3">
                        {item.subTitle}
                      </span>
                    </Space>
                    {item.tag && item.tag.text ?
                <Tag color={item.tag.color}>{item.tag.text}</Tag> :
                null}
                  </div>
                  <div>
                    <p className="truncate" style={{ marginBottom: 0 }}>
                      {item.content}
                    </p>
                    <span className="text-text-3" style={{ fontSize: 12 }}>
                      {item.time}
                    </span>
                  </div>
                </Flex>
              </Flex>
            </div>
          </div>
      )
      }
      <div
        className={styles.footer}
        style={{ borderTop: '1px solid var(--color-border-2, #e5e6eb)' }}>

        <div className={styles['footer-item']}>
          <Button type="link" size="small" onClick={onAllBtnClick}>
            {t['message.allRead']}
          </Button>
        </div>
        <div className={styles['footer-item']}>
          <Button type="link" size="small">
            {t['message.seeMore']}
          </Button>
        </div>
      </div>
    </div>);

}

export default MessageList;