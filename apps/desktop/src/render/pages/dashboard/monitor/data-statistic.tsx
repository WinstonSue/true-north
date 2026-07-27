import { Button, Card, Radio, Tabs } from '@sue/design-web-react';
import React from 'react';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import DataStatisticList from './data-statistic-list';
import styles from './style/index.module.less';

export default function DataStatistic() {
  const t = useLocale(locale);
  return (
    <Card>
      <Tabs
        defaultActiveKey="liveMethod"
        items={[
          {
            key: 'liveMethod',
            label: t['monitor.tab.title.liveMethod'],
          },
          {
            key: 'onlineUsers',
            label: t['monitor.tab.title.onlineUsers'],
          },
        ]}
      />
      <div className={styles['data-statistic-content']}>
        <Radio.Group defaultValue="3" optionType="button">
          <Radio value="1">{t['monitor.liveMethod.normal']}</Radio>
          <Radio value="2">{t['monitor.liveMethod.flowControl']}</Radio>
          <Radio value="3">{t['monitor.liveMethod.video']}</Radio>
          <Radio value="4">{t['monitor.liveMethod.web']}</Radio>
        </Radio.Group>

        <div className={styles['data-statistic-list-wrapper']}>
          <div className={styles['data-statistic-list-header']}>
            <Button type="link">{t['monitor.editCarousel']}</Button>
            <Button disabled>{t['monitor.startCarousel']}</Button>
          </div>
          <div className={styles['data-statistic-list-content']}>
            <DataStatisticList />
          </div>
        </div>
      </div>
    </Card>
  );
}
