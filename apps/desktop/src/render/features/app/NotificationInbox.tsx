import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Flex, Popover, Spin } from '@sue/design-web-react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { HOST_NOTIFICATION_INVALIDATE_EVENT, useHostActions, useRendererPlatform } from '@true-north/plugin-sdk/renderer';
import { navigatePluginResource } from '@/plugin/PluginViewFrame';
import useLocale from '@/utils/useLocale';
import styles from './NotificationInbox.module.less';

type NotificationItem = {
  id: string;
  title: string;
  body?: string;
  href?: string;
  uri?: string;
  hostAction?: string;
  readAt?: string | null;
  createdAt: string;
};

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
}

function InboxContent({
  items,
  loading,
  onOpen,
  onMarkAll,
  onIgnore,
}: {
  items: NotificationItem[];
  loading: boolean;
  onOpen: (item: NotificationItem) => void;
  onMarkAll: () => void;
  onIgnore: (item: NotificationItem) => void;
}) {
  const t = useLocale();
  const unread = items.filter((item) => !item.readAt).length;

  return (
    <ProductSurface id={productRef('notification.view.inbox')}>
      <div className={styles.box}>
        <Spin spinning={loading} style={{ display: 'block' }}>
          <Flex vertical className={styles.list} gap={12}>
            <Flex align="center" justify="space-between" gap={8}>
              <strong className={styles.heading}>{t['notification.title']}</strong>
              {unread ? (
                <Button size="small" type="link" onClick={onMarkAll}>
                  {t['notification.markAll']}
                </Button>
              ) : null}
            </Flex>
            {!items.length && !loading ? <p className={styles.empty}>{t['notification.empty']}</p> : null}
            {items.map((item) => (
              <div key={item.id} className={item.readAt ? styles.item : `${styles.item} ${styles.unread}`}>
                <button type="button" className={styles.itemMain} onClick={() => onOpen(item)}>
                  <span className={styles.itemTitle}>{item.title}</span>
                  {item.body ? <span className={styles.itemBody}>{item.body}</span> : null}
                  <span className={styles.itemTime}>{formatTime(item.createdAt)}</span>
                </button>
                <Button
                  size="small"
                  type="link"
                  className={styles.ignore}
                  onClick={(event) => {
                    event.stopPropagation();
                    onIgnore(item);
                  }}
                >
                  {t['notification.ignore']}
                </Button>
              </div>
            ))}
          </Flex>
        </Spin>
      </div>
    </ProductSurface>
  );
}

export function NotificationInbox({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const platform = useRendererPlatform();
  const hostActions = useHostActions();
  const navigate = useNavigate();

  const load = useCallback(
    async (showLoading = false) => {
      if (showLoading) setLoading(true);
      try {
        const result = (await platform.ipc.get('/notifications/list')) as {
          list?: NotificationItem[];
          unreadCount?: number;
        };
        setItems(result?.list || []);
        setUnreadCount(result?.unreadCount || 0);
      } catch (error) {
        console.error(error);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [platform.ipc],
  );

  useEffect(() => {
    void load();
    const api = typeof window !== 'undefined' ? window.electronAPI : undefined;
    if (!api?.on) return;
    const handler = () => {
      void load();
    };
    api.on(HOST_NOTIFICATION_INVALIDATE_EVENT, handler);
    const timer = window.setInterval(() => void load(), 30_000);
    return () => {
      api.removeListener?.(HOST_NOTIFICATION_INVALIDATE_EVENT, handler);
      window.clearInterval(timer);
    };
  }, [load]);

  const openItem = async (item: NotificationItem) => {
    if (!item.readAt) await platform.ipc.put(`/notifications/${item.id}/read`);
    if (item.hostAction) await hostActions.invoke(item.hostAction);
    else if (item.href) navigate(item.href);
    else navigatePluginResource(navigate, platform, item.uri);
    await load();
  };

  const markAll = async () => {
    await platform.ipc.put('/notifications/read-all', {});
    await load();
  };

  const ignoreItem = async (item: NotificationItem) => {
    await platform.ipc.put(`/notifications/${item.id}/ignore`, {});
    await load();
  };

  return (
    <Popover
      trigger="click"
      content={
        <InboxContent
          items={items}
          loading={loading}
          onOpen={(item) => void openItem(item)}
          onMarkAll={() => void markAll()}
          onIgnore={(item) => void ignoreItem(item)}
        />
      }
      placement="rightTop"
      destroyOnHidden={false}
      onOpenChange={(open) => {
        if (open) void load(true);
      }}
    >
      <Badge count={unreadCount} dot={false}>
        {children}
      </Badge>
    </Popover>
  );
}
