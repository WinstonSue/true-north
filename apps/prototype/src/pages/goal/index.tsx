import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Alert, Button, Card, Col, DatePicker, Flex, Input, Row, Select, Space, Statistic, Tabs, Tooltip } from '@sue/design-web-react';
import { ChevronRight, Plus, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { PriorityTag, StateTag } from '../../shared/components';
import { productRef } from '../../product-wiki';
import { goalTypes } from '../../shared/mock-data';
import type { DrawerState, Goal, GoalStatus, GoalType, Habit, Task } from '../../shared/types';
import { statusLabel } from '../../shared/utils';
import { GoalManagementHeader } from './GoalManagementHeader';
import styles from './index.module.css';

type Props = {
  goals: Goal[];
  tasks: Task[];
  habits: Habit[];
  selectedGoal: string;
  setSelectedGoal: (id: string) => void;
  setDrawer: (drawer: DrawerState) => void;
  onOpenAiDecomposition: () => void;
};
export function GoalsPage({
  goals,
  tasks,
  habits,
  selectedGoal,
  setSelectedGoal,
  setDrawer,
  onOpenAiDecomposition,
}: Props) {
  const [keyword, setKeyword] = useState('');
  const [statuses, setStatuses] = useState<GoalStatus[]>([]);
  const [types, setTypes] = useState<GoalType[]>([]);
  const [filterStart, setFilterStart] = useState<string>();
  const [filterEnd, setFilterEnd] = useState<string>();
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const current = goals.find((goal) => goal.id === selectedGoal) || goals[0];
  const children = goals.filter((goal) => goal.parentId === current.id);
  const relatedTasks = tasks.filter((task) => task.goalId === current.id);
  const relatedHabits = habits.filter((habit) => habit.goalIds.includes(current.id));
  const normalizedKeyword = keyword.trim().toLocaleLowerCase();
  const visibleGoalIds = useMemo(() => {
    const goalsById = new Map(goals.map((goal) => [goal.id, goal]));
    const ids = new Set<string>();
    goals
      .filter(
        (goal) =>
          (!normalizedKeyword || goal.title.toLocaleLowerCase().includes(normalizedKeyword)) &&
          (!statuses.length || statuses.includes(goal.status)) &&
          (!types.length || types.includes(goal.type)) &&
          (!filterStart || goal.end >= filterStart) &&
          (!filterEnd || goal.start <= filterEnd)
      )
      .forEach((goal) => {
        let item: Goal | undefined = goal;
        while (item) {
          ids.add(item.id);
          item = item.parentId ? goalsById.get(item.parentId) : undefined;
        }
      });
    return ids;
  }, [filterEnd, filterStart, goals, normalizedKeyword, statuses, types]);
  const hasFilters = Boolean(normalizedKeyword || statuses.length || types.length || filterStart || filterEnd);
  const clearFilters = () => {
    setKeyword('');
    setStatuses([]);
    setTypes([]);
    setFilterStart(undefined);
    setFilterEnd(undefined);
  };
  const renderTree = (parentId?: string, depth = 0): React.ReactNode =>
    goals
      .filter((goal) => goal.parentId === parentId && visibleGoalIds.has(goal.id))
      .map((goal) => (
        <div
          data-product-ref={productRef('growth.goal.view.tree')}
          key={goal.id}
          className={styles.treeItem}
          style={{ paddingLeft: depth * 16 }}
        >
          <Button
            type="text"
            className={selectedGoal === goal.id ? styles.treeActive : ''}
            onClick={() => setSelectedGoal(goal.id)}
            icon={<ChevronRight size={14} />}
          >
            <span className={styles.treeGoalLabel}>{goal.title}</span>
            <small className={styles.treeTimeRange} data-product-ref={productRef('growth.goal.rule.time-frame')}>
              {`${goal.start} 至 ${goal.end}`}
            </small>
          </Button>
          {renderTree(goal.id, depth + 1)}
        </div>
      ));
  return (
    <>
      <GoalManagementHeader />
      <Row gutter={[16, 16]} align="top">
        <Col xs={24} lg={8}>
          <div data-product-ref={productRef('growth.goal.view.tree')}>
            <Card
              title="目标树"
              extra={
                <Space size={0}>
                  {hasFilters && (
                    <Tooltip title="清空筛选">
                      <Button type="text" size="small" icon={<X size={15} />} aria-label="清空筛选" onClick={clearFilters} />
                    </Tooltip>
                  )}
                  <Tooltip title={filtersExpanded ? '收起筛选' : '展开筛选'}>
                    <Button
                      type={hasFilters ? 'primary' : 'text'}
                      size="small"
                      icon={<SlidersHorizontal size={15} />}
                      aria-label={filtersExpanded ? '收起筛选' : '展开筛选'}
                      aria-expanded={filtersExpanded}
                      onClick={() => setFiltersExpanded((value) => !value)}
                    />
                  </Tooltip>
                  <Tooltip title="新建目标">
                    <Button
                      type="text"
                      size="small"
                      icon={<Plus size={15} />}
                      aria-label="新建目标"
                      onClick={() => setDrawer({ kind: 'goal' })}
                    />
                  </Tooltip>
                </Space>
              }
            >
              <Flex vertical gap={12}>
                {filtersExpanded && (
                  <Flex vertical gap={8}>
                    <Input value={keyword} placeholder="搜索目标名称" allowClear onChange={(event) => setKeyword(event.target.value)} />
                    <Flex wrap gap={8}>
                      <Select
                        mode="multiple"
                        value={statuses}
                        placeholder="全部状态"
                        style={{ minWidth: 132 }}
                        options={['todo', 'doing', 'done', 'paused', 'archived'].map((value) => ({
                          value,
                          label: statusLabel(value),
                        }))}
                        onChange={(value) => setStatuses(value as GoalStatus[])}
                      />
                      <Select
                        mode="multiple"
                        value={types}
                        placeholder="全部类型"
                        style={{ minWidth: 132 }}
                        options={goalTypes}
                        onChange={(value) => setTypes(value as GoalType[])}
                      />
                      <DatePicker
                        allowClear
                        placeholder="开始日期"
                        value={filterStart ? dayjs(filterStart) : undefined}
                        onChange={(date) => setFilterStart(date?.format('YYYY-MM-DD'))}
                      />
                      <DatePicker
                        allowClear
                        placeholder="结束日期"
                        value={filterEnd ? dayjs(filterEnd) : undefined}
                        onChange={(date) => setFilterEnd(date?.format('YYYY-MM-DD'))}
                      />
                    </Flex>
                  </Flex>
                )}
                {visibleGoalIds.size ? renderTree() : <Alert type="info" showIcon title="没有匹配的目标" />}
              </Flex>
            </Card>
          </div>
        </Col>
        <Col xs={24} lg={16}>
          <div data-product-ref={productRef('growth.goal.view.detail')}>
            <Card
              title={current.title}
              extra={
                <div data-product-ref={productRef('growth.goal.interaction')}>
                  <Space>
                    <Button onClick={() => setDrawer({ kind: 'goal', id: current.id })}>编辑</Button>
                    <Button type="primary" icon={<Sparkles size={15} />} onClick={onOpenAiDecomposition}>
                      AI 拆解
                    </Button>
                  </Space>
                </div>
              }
            >
              <Flex vertical gap={16}>
                <Space>
                  <StateTag status={current.status} />
                  <PriorityTag importance={current.importance} />
                </Space>
                <small className={styles.timeRange} data-product-ref={productRef('growth.goal.rule.time-frame')}>
                  {`时间范围：${current.start} 至 ${current.end}`}
                </small>
                <p className={styles.goalDescription}>{current.description}</p>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic title="关联任务" value={relatedTasks.length} suffix="项" />
                  </Col>
                  <Col span={12}>
                    <Statistic title="关联习惯" value={relatedHabits.length} suffix="项" />
                  </Col>
                </Row>
                <div data-product-ref={productRef('growth.goal.view.detail')}>
                  <Tabs
                    items={[
                      {
                        key: 'children',
                        label: `子目标 ${children.length}`,
                        children: <RelationList items={children} empty="暂无子目标" />,
                      },
                      {
                        key: 'tasks',
                        label: `关联任务 ${relatedTasks.length}`,
                        children: <RelationList items={relatedTasks} empty="暂无关联任务" />,
                      },
                      {
                        key: 'habits',
                        label: `关联习惯 ${relatedHabits.length}`,
                        children: <RelationList items={relatedHabits} empty="暂无关联习惯" />,
                      },
                      {
                        key: 'history',
                        label: '历史记录',
                        children: (
                          <div className={styles.history}>
                            {current.history.map((item) => (
                              <p key={item}>{item}</p>
                            ))}
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>
              </Flex>
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
}
function RelationList({
  items,
  empty,
}: {
  items: Array<{ id: string; title: string; status?: string }>;
  empty: string;
}) {
  return items.length ? (
    <div className={styles.relationList}>
      {items.map((item) => (
        <Flex justify="space-between" align="center" key={item.id}>
          <b>{item.title}</b>
          {item.status && <StateTag status={item.status} />}
        </Flex>
      ))}
    </div>
  ) : (
    <Alert type="info" showIcon title={empty} />
  );
}
