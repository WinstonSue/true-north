import React, { useState, useEffect, useCallback } from 'react';
import { Card, Radio, Table, CaretDownOutlined, CaretUpOutlined } from '@sue/design-web-react';

import axios from 'axios';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/popular-contents.module.less';
function PopularContent() {
  const t = useLocale(locale);
  const [type, setType] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const fetchData = useCallback(() => {
    setLoading(true);
    axios.
    get(
      `/api/workplace/popular-contents?page=${page}&pageSize=5&category=${type}`
    ).
    then((res) => {
      setData(res.data.list);
      setTotal(res.data.total);
    }).
    finally(() => {
      setLoading(false);
    });
  }, [page, type]);
  useEffect(() => {
    fetchData();
  }, [page, fetchData]);
  const columns = [
  {
    title: t['workplace.column.rank'],
    dataIndex: 'rank',
    width: 65
  },
  {
    title: t['workplace.column.title'],
    dataIndex: 'title',
    render: (x) =>
    <p className="truncate" style={{ margin: 0 }}>
          {x}
        </p>

  },
  {
    title: t['workplace.column.pv'],
    dataIndex: 'pv',
    width: 100,
    render: (text) => {
      return `${text / 1000}k`;
    }
  },
  {
    title: t['workplace.column.increase'],
    dataIndex: 'increase',
    sorter: (a, b) => a.increase - b.increase,
    width: 110,
    render: (text) => {
      return (
        <span>
            {`${(text * 100).toFixed(2)}%`}
            <span className={styles['symbol']}>
              {text < 0 ?
            <CaretUpOutlined style={{ color: 'rgb(var(--green-6))' }} /> :

            <CaretDownOutlined style={{ color: 'rgb(var(--red-6))' }} />
            }
            </span>
          </span>);

    }
  }];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h6 className="text-title-1 font-medium">
          {t['workplace.popularContents']}
        </h6>
        <a style={{ color: "var(--color-primary-6)" }}>{t['workplace.seeMore']}</a>
      </div>
      <Radio.Group
        type="button"
        value={type}
        onChange={setType}
        options={[
        { label: t['workplace.text'], value: 0 },
        { label: t['workplace.image'], value: 1 },
        { label: t['workplace.video'], value: 2 }]
        }
        style={{ marginBottom: 16 }} />

      <Table
        rowKey="rank"
        columns={columns}
        data={data}
        loading={loading}
        tableLayoutFixed
        onChange={(pagination) => {
          setPage(pagination.current);
        }}
        pagination={{ total, current: page, pageSize: 5, simple: true }} />

    </Card>);

}
export default PopularContent;