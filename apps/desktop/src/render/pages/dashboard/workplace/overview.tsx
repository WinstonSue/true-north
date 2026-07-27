import React, { useState, useEffect, ReactNode } from 'react';
import { Card, Divider, Skeleton, Row, Col, CaretUpOutlined } from '@sue/design-web-react';

import { useSelector } from 'react-redux';

import OverviewAreaLine from '@/components/Chart/overview-area-line';
import axios from 'axios';
import locale from './locale';
import useLocale from '@/utils/useLocale';
import styles from './style/overview.module.less';
import IconCalendar from './assets/calendar.svg';
import IconComments from './assets/comments.svg';
import IconContent from './assets/content.svg';
import IconIncrease from './assets/increase.svg';
type StatisticItemType = {
  icon?: ReactNode;
  title?: ReactNode;
  count?: ReactNode;
  loading?: boolean;
  unit?: ReactNode;
};
function StatisticItem(props: StatisticItemType) {
  const { icon, title, count, loading, unit } = props;
  return (
    <div className={styles.item}>
      <div className={styles.icon}>{icon}</div>
      <div>
        <Skeleton loading={loading} text={{ rows: 2, width: 60 }} animation>
          <div className={styles.title}>{title}</div>
          <div className={styles.count}>
            {count}
            <span className={styles.unit}>{unit}</span>
          </div>
        </Skeleton>
      </div>
    </div>);

}
type DataType = {
  allContents?: string;
  liveContents?: string;
  increaseComments?: string;
  growthRate?: string;
  chartData?: {count?: number;date?: string;}[];
  down?: boolean;
};
function Overview() {
  const [data, setData] = useState<DataType>({});
  const [loading, setLoading] = useState(true);
  const t = useLocale(locale);
  const userInfo = useSelector((state: any) => state.userInfo || {});
  const fetchData = () => {
    setLoading(true);
    axios.
    get('/api/workplace/overview-content').
    then((res) => {
      setData(res.data);
    }).
    finally(() => {
      setLoading(false);
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Card>
      <h5 className="text-title-1 font-medium">
        {t['workplace.welcomeBack']}
        {userInfo.name}
      </h5>
      <Divider />
      <Row>
        <Col flex={1}>
          <StatisticItem
            icon={<IconCalendar />}
            title={t['workplace.totalOnlyData']}
            count={data.allContents}
            loading={loading}
            unit={t['workplace.pecs']} />

        </Col>
        <Divider type="vertical" className={styles.divider} />
        <Col flex={1}>
          <StatisticItem
            icon={<IconContent />}
            title={t['workplace.contentInMarket']}
            count={data.liveContents}
            loading={loading}
            unit={t['workplace.pecs']} />

        </Col>
        <Divider type="vertical" className={styles.divider} />
        <Col flex={1}>
          <StatisticItem
            icon={<IconComments />}
            title={t['workplace.comments']}
            count={data.increaseComments}
            loading={loading}
            unit={t['workplace.pecs']} />

        </Col>
        <Divider type="vertical" className={styles.divider} />
        <Col flex={1}>
          <StatisticItem
            icon={<IconIncrease />}
            title={t['workplace.growth']}
            count={
            <span>
                {data.growthRate}{' '}
                <CaretUpOutlined
                style={{ fontSize: 18, color: 'rgb(var(--green-6))' }} />

              </span>
            }
            loading={loading} />

        </Col>
      </Row>
      <Divider />
      <div>
        <div className={styles.ctw}>
          <p
            className={styles['chart-title']}
            style={{ marginBottom: 0 }}>

            {t['workplace.contentData']}
            <span className={styles['chart-sub-title']}>
              ({t['workplace.1year']})
            </span>
          </p>
          <a style={{ color: "var(--color-primary-6)" }}>{t['workplace.seeMore']}</a>
        </div>
        <OverviewAreaLine data={data.chartData} loading={loading} />
      </div>
    </Card>);

}
export default Overview;