import React, { useState, useMemo, useCallback } from 'react';
import { Input, Select, DatePicker, Button, Tag, Space, Row, Col, DownOutlined, ReloadOutlined, SearchOutlined, UpOutlined } from '@sue/design-web-react';

import { IMPORTANCE_MAP, DIFFICULTY_MAP } from '../../constants';
import { GoalStatus, GoalType } from '@true-north/enum';
import { useGoalContext } from '../context';
import clsx from 'clsx';
import { debounce } from 'lodash-es';
import dayjs from 'dayjs';

const DatePickerRange = DatePicker.RangePicker;

const GoalFilters: React.FC = () => {
  const { searchValue, setSearchValue, filters, setFilters, clearFilters } =
    useGoalContext();
  const [collapsed, setCollapsed] = useState(true);
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  // 防抖搜索
  const debouncedSetSearchValue = useCallback(
    debounce((value: string) => {
      setSearchValue(value);
    }, 300),
    [setSearchValue],
  );

  // 获取状态标签文本
  const getStatusLabel = (status: GoalStatus) => {
    const statusMap = {
      [GoalStatus.TODO]: '待开始',
      [GoalStatus.DOING]: '进行中',
      [GoalStatus.DONE]: '已完成',
      [GoalStatus.ABANDONED]: '已放弃',
    };
    return statusMap[status] || status;
  };

  // 获取类型标签文本
  const getTypeLabel = (type: GoalType) => {
    const typeMap = {
      [GoalType.VISION]: '愿景',
      [GoalType.RESULT]: '成果',
    };
    return typeMap[type] || type;
  };

  // 计算有效的筛选标签
  const filterTags = useMemo(() => {
    const tags = [];

    if (filters.status && filters.status.length > 0) {
      filters.status.forEach((status, index) => {
        tags.push({
          key: `status-${status}`,
          label: getStatusLabel(status),
          onClose: () => {
            const newStatus = filters.status?.filter((s) => s !== status) || [];
            setFilters({
              ...filters,
              status: newStatus.length > 0 ? newStatus : undefined,
            });
          },
        });
      });
    }

    if (filters.type) {
      tags.push({
        key: 'type',
        label: getTypeLabel(filters.type),
        onClose: () => setFilters({ ...filters, type: undefined }),
      });
    }

    if (filters.importance) {
      const importanceConfig = IMPORTANCE_MAP.get(filters.importance);
      tags.push({
        key: 'importance',
        label: importanceConfig?.label || filters.importance,
        onClose: () => setFilters({ ...filters, importance: undefined }),
      });
    }

    if (filters.difficulty) {
      const difficultyConfig = DIFFICULTY_MAP.get(filters.difficulty);
      tags.push({
        key: 'difficulty',
        label: difficultyConfig?.label || filters.difficulty,
        onClose: () => setFilters({ ...filters, difficulty: undefined }),
      });
    }

    if (filters.dateRange && filters.dateRange.length === 2) {
      tags.push({
        key: 'dateRange',
        label: `${filters.dateRange[0]} ~ ${filters.dateRange[1]}`,
        onClose: () => setFilters({ ...filters, dateRange: undefined }),
      });
    }

    return tags;
  }, [filters, setFilters]);

  const handleReset = () => {
    clearFilters();
    setSearchValue('');
    setLocalSearchValue('');
  };

  return (
    <div className={clsx('w-full', 'space-y-3')}>
      {/* 搜索框和操作按钮 */}
      <div className="flex gap-2">
        <Input
          placeholder="搜索目标..."
          prefix={<SearchOutlined />}
          value={localSearchValue}
          onChange={(event) => {
            const value = event.target.value;
            setLocalSearchValue(value);
            debouncedSetSearchValue(value);
          }}
          allowClear
          className="flex-1"
        />
        <Button
          type="text"
          icon={collapsed ? <DownOutlined /> : <UpOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          size="small"
        />
      </div>

      {/* 收起状态下的筛选标签 */}
      {collapsed && filterTags.length > 0 && (
        <Space wrap>
          {filterTags.map((tag) => (
            <Tag
              key={tag.key}
              closable
              onClose={tag.onClose}
              color="blue"
              size="small"
            >
              {tag.label}
            </Tag>
          ))}
        </Space>
      )}

      {/* 筛选条件 */}
      {!collapsed && (
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Select
              placeholder="目标状态"
              allowClear
              size="small"
              mode="multiple"
              value={filters.status}
              onChange={(value) => {
                setFilters({ ...filters, status: value });
              }}
            >
              <Select.Option value={GoalStatus.TODO}>待开始</Select.Option>
              <Select.Option value={GoalStatus.DOING}>进行中</Select.Option>
              <Select.Option value={GoalStatus.DONE}>已完成</Select.Option>
              <Select.Option value={GoalStatus.ABANDONED}>已放弃</Select.Option>
            </Select>
          </Col>
          <Col span={12}>
            <Select
              placeholder="目标类型"
              allowClear
              size="small"
              value={filters.type}
              onChange={(value) => {
                setFilters({ ...filters, type: value });
              }}
            >
              <Select.Option value={GoalType.VISION}>愿景</Select.Option>
              <Select.Option value={GoalType.RESULT}>
                成果
              </Select.Option>
            </Select>
          </Col>
          <Col span={12}>
            <Select
              placeholder="重要程度"
              allowClear
              size="small"
              value={filters.importance}
              onChange={(value) => {
                setFilters({ ...filters, importance: value });
              }}
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
          <Col span={12}>
            <Select
              placeholder="完成难度"
              allowClear
              size="small"
              value={filters.difficulty}
              onChange={(value) => {
                setFilters({ ...filters, difficulty: value });
              }}
            >
              {[...Array.from(DIFFICULTY_MAP.entries())].map(
                ([key, { label }]) => (
                  <Select.Option key={key} value={key}>
                    {label}
                  </Select.Option>
                ),
              )}
            </Select>
          </Col>
          <Col span={24}>
            <DatePickerRange
              placeholder={['开始日期', '结束日期']}
              className="w-full"
              size="small"
              value={filters.dateRange?.map((date) => dayjs(date)) as any}
              onChange={(value) => {
                setFilters({
                  ...filters,
                  dateRange: value?.[0] && value?.[1]
                    ? [value[0].format('YYYY-MM-DD'), value[1].format('YYYY-MM-DD')]
                    : undefined,
                });
              }}
            />
          </Col>
        </Row>
      )}
      {/* 操作按钮 */}
      {!collapsed && (
        <div className="flex gap-2 justify-end">
          <Button size="small" icon={<ReloadOutlined />} onClick={handleReset}>
            重置
          </Button>
        </div>
      )}
    </div>
  );
};

export default GoalFilters;
