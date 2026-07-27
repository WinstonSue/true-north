import React, { useEffect, useState } from 'react';
import { Space, Select, Input, Button, Spin, DownloadOutlined, SmileFilled } from '@sue/design-web-react';

import axios from 'axios';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import MessageList from './message-list';
import styles from './style/index.module.less';

export default function ChatPanel() {
  const t = useLocale(locale);
  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(false);

  function fetchMessageList() {
    setLoading(true);
    axios.
    get('/api/chatList').
    then((res) => {
      setMessageList(res.data || []);
    }).
    finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchMessageList();
  }, []);

  return (
    <div className={styles['chat-panel']}>
      <div className={styles['chat-panel-header']}>
        <h6 className="text-title-1 font-medium"
        style={{ marginTop: 0, marginBottom: 16 }}>

          {t['monitor.title.chatPanel']}
        </h6>
        <Space size={8}>
          <Select style={{ width: 80 }} defaultValue="all">
            <Select.Option value="all">
              {t['monitor.chat.options.all']}
            </Select.Option>
          </Select>
          <Input.Search
            placeholder={t['monitor.chat.placeholder.searchCategory']} />

          <Button type="text" iconOnly>
            <DownloadOutlined />
          </Button>
        </Space>
      </div>
      <div className={styles['chat-panel-content']}>
        <Spin spinning={loading} style={{ width: '100%' }}>
          <MessageList data={messageList} />
        </Spin>
      </div>
      <div className={styles['chat-panel-footer']}>
        <Space size={8}>
          <Input suffix={<SmileFilled />} />
          <Button type="primary">{t['monitor.chat.update']}</Button>
        </Space>
      </div>
    </div>);

}