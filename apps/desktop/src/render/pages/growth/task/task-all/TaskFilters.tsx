'use client';

import { Input, Select, Button, Space, DatePicker, Row, Col, SearchOutlined } from '@sue/design-web-react';

import { IMPORTANCE_MAP, URGENCY_MAP } from '../../constants';
import { TagSelector } from '@/components/TagSelector';
import { TaskPageFilterVo } from '@true-north/vo';
import { useTaskAllContext } from './context';
import { TableFilter } from '@/components/Layout/TableFilter';
import { TaskStatus } from '@true-north/enum';

const DatePickerRange = DatePicker.RangePicker;

export function TaskFilters() {
  const { getTaskPage, filters, setFilters, clearFilters } =
    useTaskAllContext();

  return (
    <TableFilter
      clearFilters={async () => {
        await clearFilters();
      }}
      search={async () => {
        await getTaskPage();
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="关键字"
            value={filters.keyword}
            onChange={(value) => {
              setFilters((prev: TaskPageFilterVo) => ({
                ...prev,
                keyword: value,
              }));
            }}
          />
        </Col>
        <Col span={12}>
          <DatePickerRange
            placeholder={['计划开始日期', '计划结束日期']}
            value={[filters.startDateStart, filters.startDateEnd]}
            className="w-full"
            onChange={(value) => {
              setFilters((prev: TaskPageFilterVo) => ({
                ...prev,
                startDateStart: value[0],
                startDateEnd: value[1],
              }));
            }}
          />
        </Col>
        <Col span={6}>
          <Select
            value={filters.importance}
            onChange={(value) => {
              setFilters((prev: TaskPageFilterVo) => ({
                ...prev,
                importance: value,
              }));
            }}
            allowClear
            placeholder="重要程度"
          >
            {[...Array.from(IMPORTANCE_MAP.entries())].map(
              ([key, { label }]) => (
                <Select.Option key={key} value={key}>
                  {label}
                </Select.Option>
              ),
            )}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            value={filters.urgency}
            onChange={(value) => {
              setFilters((prev: TaskPageFilterVo) => ({
                ...prev,
                urgency: value,
              }));
            }}
            allowClear
            placeholder="紧急程度"
          >
            {[...Array.from(URGENCY_MAP.entries())].map(([key, { label }]) => (
              <Select.Option key={key} value={key}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            value={filters.status}
            onChange={(value) => {
              setFilters((prev: TaskPageFilterVo) => ({
                ...prev,
                status: value,
              }));
            }}
            allowClear
            placeholder="任务状态"
          >
            <Select.Option value={TaskStatus.TODO}>未完成</Select.Option>
            <Select.Option value={TaskStatus.DONE}>已完成</Select.Option>
            <Select.Option value={TaskStatus.ABANDONED}>已放弃</Select.Option>
          </Select>
        </Col>
        <Col span={6}>
          <TagSelector
            multiple={true}
            value={filters.tags}
            onChange={(value) => {
              setFilters((prev: TaskPageFilterVo) => ({
                ...prev,
                tags: value,
              }));
            }}
          />
        </Col>
      </Row>
    </TableFilter>
  );
}
