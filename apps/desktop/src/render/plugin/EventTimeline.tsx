import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, DatePicker, Flex, Input, Select } from '@sue/design-web-react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { EmptyState, FilterBar } from '@true-north/plugin-ui';
import { useRendererPlatform } from '@true-north/plugin-sdk/renderer';
import { navigatePluginResource } from './PluginViewFrame';
import dayjs from 'dayjs';
import useLocale from '@/utils/useLocale';
import styles from './EventTimeline.module.less';

type EventRow = {
  id: string;
  type: string;
  sourceUri?: string;
  occurredAt: string;
  display?: Record<string, unknown>;
  pluginId?: string;
};

export function EventTimeline({ embedded = false }: { embedded?: boolean }) {
  const t = useLocale();
  const navigate = useNavigate();
  const platform = useRendererPlatform();
  const [list, setList] = useState<EventRow[]>([]);
  const [keyword, setKeyword] = useState('');
  const [pluginId, setPluginId] = useState<string>();
  const [date, setDate] = useState<string>(() => dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    void platform.ipc
      .get('/workflow/events', {
        keyword: keyword || undefined,
        pluginId: pluginId || undefined,
        from: date ? dayjs(date).startOf('day').toISOString() : undefined,
        to: date ? dayjs(date).endOf('day').toISOString() : undefined,
      })
      .then((result: { list?: EventRow[] }) => setList(result?.list || []));
  }, [keyword, pluginId, date, platform.ipc]);

  const filters = (
    <>
      <Input
        allowClear
        style={{ width: 220 }}
        placeholder={t['plugins.hub.searchEvents']}
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />
      <DatePicker
        allowClear
        value={date ? dayjs(date) : undefined}
        onChange={(value) => setDate(value ? value.format('YYYY-MM-DD') : undefined)}
      />
      <Select
        allowClear
        placeholder={t['plugins.hub.filterType']}
        style={{ width: 140 }}
        value={pluginId}
        onChange={setPluginId}
        options={platform.plugins.map((plugin) => ({
          label: t[plugin.nameKey] || plugin.pluginId,
          value: plugin.pluginId,
        }))}
      />
    </>
  );

  const listBody = (
    <Flex vertical gap={12}>
      {list.map((item) => (
        <Flex key={item.id} vertical className={styles.card} gap={8}>
          <strong>{String(item.display?.title || item.type)}</strong>
          <span className={styles.time}>{dayjs(item.occurredAt).format('YYYY-MM-DD HH:mm')}</span>
          {item.sourceUri ? (
            <Button size="small" onClick={() => navigatePluginResource(navigate, platform, item.sourceUri)}>
              {item.sourceUri}
            </Button>
          ) : null}
        </Flex>
      ))}
      {!list.length ? <EmptyState description={t['plugins.hub.emptyEvents']} /> : null}
    </Flex>
  );

  return (
    <ProductSurface id={productRef('workflow.view.events')}>
      {embedded ? (
        <Flex vertical container="full" className={styles.page}>
          <FilterBar>{filters}</FilterBar>
          <Flex vertical container="fill" className={styles.body}>
            {listBody}
          </Flex>
        </Flex>
      ) : (
        <Flex vertical className={styles.section} gap={16}>
          <h2 className={styles.heading}>{t['plugins.hub.recent']}</h2>
          <Flex wrap gap={8} align="center">
            {filters}
          </Flex>
          {listBody}
        </Flex>
      )}
    </ProductSurface>
  );
}

export default EventTimeline;
