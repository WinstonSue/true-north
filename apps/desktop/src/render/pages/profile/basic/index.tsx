import React, { useEffect, useState } from 'react';
import { Card, Space, Button, Table, Badge, Row, Col, Flex } from '@sue/design-web-react';

import axios from 'axios';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import ProfileItem from './item';
import styles from './style/index.module.less';
import './mock';

function BasicProfile() {
  const t = useLocale(locale);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ status: 1 });
  const [preLoading, setPreLoading] = useState(false);
  const [preData, setPreData] = useState({});
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  function fetchData() {
    setLoading(true);
    axios.
    get('/api/basicProfile').
    then((res) => {
      setData(res.data || {});
    }).
    finally(() => {
      setLoading(false);
    });
  }

  function fetchPreData() {
    setPreLoading(true);
    axios.
    get('/api/basicProfile').
    then((res) => {
      setPreData(res.data || {});
    }).
    finally(() => {
      setPreLoading(false);
    });
  }

  function fetchTableData() {
    setTableLoading(true);
    axios.
    get('/api/adjustment').
    then((res) => {
      setTableData(res.data);
    }).
    finally(() => {
      setTableLoading(false);
    });
  }
  useEffect(() => {
    fetchData();
    fetchPreData();
    fetchTableData();
  }, []);

  const steps = [
  { title: t['basicProfile.steps.commit'] },
  { title: t['basicProfile.steps.approval'] },
  { title: t['basicProfile.steps.finish'] }];

  const current = data.status;

  return (
    <div className={styles.container}>
      <Card>
        <Row justify="space-between" align="center">
          <Col span={16}>
            <h6 className="text-title-1 font-medium">
              {t['basicProfile.title.form']}
            </h6>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button>{t['basicProfile.cancel']}</Button>
              <Button type="primary">{t['basicProfile.goBack']}</Button>
            </Space>
          </Col>
        </Row>

        <Flex className={styles.steps} gap={8} wrap="wrap">
          {steps.map((step, index) => {
            const active = index === current;
            const done = index < current;
            return (
              <Flex key={index} vertical gap={4} style={{ minWidth: 120 }}>
                <Flex align="center" gap={8}>
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      background: active ?
                      'var(--color-primary-6, #165dff)' :
                      done ?
                      'var(--color-primary-3, #94bfff)' :
                      'var(--color-fill-3, #f2f3f5)',
                      color: active || done ? '#fff' : 'var(--color-text-2)'
                    }}>

                    {index + 1}
                  </span>
                  <span style={{ fontWeight: active ? 600 : 400 }}>
                    {step.title}
                  </span>
                </Flex>
              </Flex>);

          })}
        </Flex>
      </Card>

      <ProfileItem
        title={t['basicProfile.title.currentParams']}
        data={data}
        type="current"
        loading={loading} />

      <ProfileItem
        title={t['basicProfile.title.originParams']}
        data={preData}
        type="origin"
        loading={preLoading} />

      <Card>
        <h6 className="text-title-1 font-medium">
          {t['basicProfile.adjustment.record']}
        </h6>
        <Table
          loading={tableLoading}
          data={tableData}
          columns={[
          {
            dataIndex: 'contentId',
            title: t['basicProfile.adjustment.contentId']
          },
          {
            dataIndex: 'content',
            title: t['basicProfile.adjustment.content']
          },
          {
            dataIndex: 'status',
            title: t['basicProfile.adjustment.status'],
            render: (status) => {
              if (status) {
                return (
                  <Badge
                    status="success"
                    text={t['basicProfile.adjustment.success']} />);

              }

              return (
                <Badge
                  status="processing"
                  text={t['basicProfile.adjustment.waiting']} />);

            }
          },
          {
            dataIndex: 'updatedTime',
            title: t['basicProfile.adjustment.updatedTime']
          },
          {
            title: t['basicProfile.adjustment.operation'],
            headerCellStyle: { paddingLeft: '15px' },
            render() {
              return (
                <Button type="text">
                    {t['basicProfile.adjustment.operation.view']}
                  </Button>);

            }
          }]
          } />

      </Card>
    </div>);

}

export default BasicProfile;