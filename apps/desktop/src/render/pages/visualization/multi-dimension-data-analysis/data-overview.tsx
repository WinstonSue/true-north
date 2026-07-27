// 数据总览
import React, { useEffect, useState, useMemo } from 'react';
import {
  Card,
  Statistic,
  Skeleton,
  Row,
  Col,
  UserOutlined,
  EditOutlined,
  HeartOutlined,
  LikeOutlined,
} from '@sue/design-web-react';
import axios from 'axios';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/data-overview.module.less';
import MultiAreaLine from '@/components/Chart/multi-area-line';

export default () => {
  const t = useLocale(locale);
  const [overview, setOverview] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const { data } = await axios.
    get('/api/multi-dimension/overview').
    finally(() => setLoading(false));

    const { overviewData, chartData } = data;
    setLineData(chartData);
    setOverview(overviewData);
  };

  useEffect(() => {
    getData();
  }, []);

  const formatedData = useMemo(() => {
    return [
    {
      title: t['multiDAnalysis.dataOverview.contentProduction'],
      icon: <EditOutlined />,
      value: overview[0],
      background: 'rgb(var(--orange-2))',
      color: 'rgb(var(--orange-6))'
    },
    {
      title: t['multiDAnalysis.dataOverview.contentClicks'],
      icon: <LikeOutlined />,
      value: overview[1],
      background: 'rgb(var(--cyan-2))',
      color: 'rgb(var(--cyan-6))'
    },
    {
      title: t['multiDAnalysis.dataOverview.contextExposure'],
      value: overview[2],
      icon: <HeartOutlined />,
      background: 'rgb(var(--arcoblue-1))',
      color: 'rgb(var(--arcoblue-6))'
    },
    {
      title: t['multiDAnalysis.dataOverview.activeUsers'],
      value: overview[3],
      icon: <UserOutlined />,
      background: 'rgb(var(--purple-1))',
      color: 'rgb(var(--purple-6))'
    }];

  }, [t, overview]);

  return (
    <Row justify="space-between">
      {formatedData.map((item, index) =>
      <Col span={24 / formatedData.length} key={`${index}`}>
          <Card className={styles.card} title={null}>
            <h6 className="text-title-1 font-medium">{item.title}</h6>
            <div className={styles.content}>
              <div
              style={{ backgroundColor: item.background, color: item.color }}
              className={styles['content-icon']}>

                {item.icon}
              </div>
              {loading ?
            <Skeleton
              animation
              text={{ rows: 1, className: styles['skeleton'] }}
              style={{ width: '120px' }} /> :

            <Statistic value={item.value} groupSeparator />
            }
            </div>
          </Card>
        </Col>
      )}
      <Col span={24}>
        <MultiAreaLine data={lineData} loading={loading} />
      </Col>
    </Row>);

};