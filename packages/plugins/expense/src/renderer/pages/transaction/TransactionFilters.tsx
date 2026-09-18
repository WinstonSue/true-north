'use client';

import { Flex, Select, DatePicker } from '@sue/design-web-react';
import { Calendar } from 'lucide-react';
import { usePluginRuntime } from '@true-north/plugin-sdk/renderer';
import { useExpenses } from '../context';
import { PERIODS } from '../constants';
import { TagSelector } from '@true-north/plugin-ui';
import dayjs, { Dayjs } from 'dayjs';

export function TransactionFilters() {
  const { locale } = usePluginRuntime();
  const { filters, setFilters } = useExpenses();

  return (
    <Flex wrap gap={12} align="center">
      <Select
        style={{ width: 160 }}
        value={filters.period}
        onChange={(value) => setFilters({ ...filters, period: value })}
        placeholder={locale.t('expense.filter.period')}
        options={Object.entries(PERIODS).map(([key, label]) => ({ value: key, label }))}
      />
      <Select
        style={{ width: 160 }}
        value={filters.type}
        allowClear
        onChange={(value) => setFilters({ ...filters, type: value })}
        placeholder={locale.t('expense.filter.type')}
        options={[
          { value: 'income', label: locale.t('expense.type.income') },
          { value: 'expense', label: locale.t('expense.type.expense') },
        ]}
      />
      <DatePicker
        style={{ width: 200 }}
        value={filters.dateRange.from ? dayjs(filters.dateRange.from) : undefined}
        onChange={(date: Dayjs) => {
          if (!date) return;
          const next = date.toDate();
          setFilters({
            ...filters,
            dateRange: {
              from: next,
              to: new Date(next.getFullYear(), next.getMonth() + 1, 0),
            },
          });
        }}
        placeholder={locale.t('expense.filter.date')}
        prefix={<Calendar size={16} />}
      />
      <TagSelector
        multiple={true}
        value={filters.tags}
        onChange={(tags) => setFilters({ ...filters, tags })}
      />
    </Flex>
  );
}
