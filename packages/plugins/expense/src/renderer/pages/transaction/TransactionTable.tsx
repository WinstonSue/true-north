import type { TableColumnProps } from '@sue/design-web-react';
'use client';

import { Table, Tag } from '@sue/design-web-react';
import { usePluginRuntime } from '@true-north/plugin-sdk/renderer';
import { useExpenses } from '../context';
import { DEFAULT_CATEGORIES } from '../constants';
import type { TransactionVo } from '@true-north/vo';

export default function TransactionTable() {
  const { locale } = usePluginRuntime();
  const { transactionList } = useExpenses();

  const columns: TableColumnProps<TransactionVo>[] = [
    {
      title: locale.t('expense.column.date'),
      dataIndex: 'transactionDateTime',
      render: (date: string) => date,
    },
    {
      title: locale.t('expense.column.type'),
      dataIndex: 'type',
      render: (type: 'income' | 'expense') => (
        <Tag color={type === 'income' ? 'success' : 'error'}>
          {locale.t(`expense.type.${type}`)}
        </Tag>
      ),
    },
    {
      title: locale.t('expense.column.amount'),
      dataIndex: 'amount',
      render: (amount: number, record: TransactionVo) => (
        <span
          style={{
            color: record.type === 'income' ? 'var(--sue-color-success)' : 'var(--sue-color-error)',
          }}
        >
          {record.type === 'income' ? '+' : '-'}${amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: locale.t('expense.column.category'),
      dataIndex: 'category',
      render: (category: string) =>
        DEFAULT_CATEGORIES[category]?.name || category,
    },
    {
      title: locale.t('expense.column.description'),
      dataIndex: 'description',
    },
    {
      title: locale.t('expense.column.tags'),
      dataIndex: 'tags',
      render: (tags: string[]) => (
        <div className="flex flex-wrap gap-1">
          {(tags || []).map((tag, index) => (
            <Tag key={index} variant="outlined">
              {tag}
            </Tag>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Table
      className="w-full"
      columns={columns}
      dataSource={transactionList}
      rowKey="id"
      pagination={false}
      locale={{ emptyText: locale.t('expense.transaction.empty') }}
    />
  );
}
