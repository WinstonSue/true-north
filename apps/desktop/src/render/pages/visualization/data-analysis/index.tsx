import React, { useEffect, useMemo, useState } from 'react';
import { Card, Table, Space, Row, Col } from '@sue/design-web-react';

import useLocale from '@/utils/useLocale';
import axios from 'axios';
import locale from './locale';
import PublicOpinion from './public-opinion';
import MultiInterval from '@/components/Chart/multi-stack-interval';
import PeriodLine from '@/components/Chart/period-legend-line';
import './mock';

function DataAnalysis() {
  const t = useLocale(locale);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);

  const getChartData = async () => {
    setLoading(true);
    const { data } = await axios.
    get('/api/data-analysis/content-publishing').
    finally(() => setLoading(false));
    setChartData(data);
  };

  const getTableData = async () => {
    setTableLoading(true);
    const { data } = await axios.
    get('/api/data-analysis/author-list').
    finally(() => setTableLoading(false));
    setTableData(data.list);
  };

  useEffect(() => {
    getChartData();
    getTableData();
  }, []);

  const columns = useMemo(() => {
    return [
    {
      title: t['dataAnalysis.authorTable.rank'],
      dataIndex: 'id'
    },
    {
      title: t['dataAnalysis.authorTable.author'],
      dataIndex: 'author'
    },
    {
      title: t['dataAnalysis.authorTable.content'],
      dataIndex: 'contentCount',
      sorter: (a, b) => a.contentCount - b.contentCount,
      render(x) {
        return Number(x).toLocaleString();
      }
    },
    {
      title: t['dataAnalysis.authorTable.click'],
      dataIndex: 'clickCount',
      sorter: (a, b) => a.clickCount - b.clickCount,
      render(x) {
        return Number(x).toLocaleString();
      }
    }];

  }, [t]);

  return (
    <Space size={16} direction="vertical" style={{ width: '100%' }}>
      <Card>
        <h6 className="text-title-1 font-medium">
          {t['dataAnalysis.title.publicOpinion']}
        </h6>
        <PublicOpinion />
      </Card>
      <Row gutter={16}>
        <Col span={14}>
          <Card>
            <h6 className="text-title-1 font-medium">
              {t['dataAnalysis.title.publishingRate']}
            </h6>
            <MultiInterval data={chartData} loading={loading} />
          </Card>
        </Col>
        <Col span={10}>
          <Card>
            <h6 className="text-title-1 font-medium">
              {t['dataAnalysis.title.authorsList']}
            </h6>
            <div style={{ height: '370px' }}>
              <Table
                rowKey="id"
                loading={tableLoading}
                pagination={false}
                data={tableData}
                columns={columns} />

            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Card>
            <h6 className="text-title-1 font-medium">
              {t['dataAnalysis.title.publishingTiming']}
            </h6>
            <PeriodLine data={chartData} loading={loading} />
          </Card>
        </Col>
      </Row>
    </Space>);

}
export default DataAnalysis;