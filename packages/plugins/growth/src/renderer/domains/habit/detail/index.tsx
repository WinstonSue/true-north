import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Flex,
  Space,
  Tag,
  Progress,
  Descriptions,
  message,
  Modal,
  Badge,
} from '@sue/design-web-react';
import { Check, Pause, Pencil, Play, Trash2, X } from 'lucide-react';
import { HabitService, TodoController, GoalController } from '../../../../client';
import { HabitVo } from '@true-north/vo';
import { HABIT_STATUS_OPTIONS } from '../constants';
import { useHabitContext } from '../context';
import { HabitStatus, TodoRelatedType } from '@true-north/enum';
import { DIFFICULTY_MAP } from '../../../shared/constants';
import { CreateHabit } from '../components/CreateHabit';
import { emitHabitChanged } from '../../../shared/events';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { EmptyState, LoadingState, PageHeader, Surface } from '@true-north/plugin-ui';
import { DetailTabs, drawerShellStyles } from '../../../ui';
import { openGrowthDrawer } from '../../../runtime/drawer';
import styles from './style.module.less';

export const HabitDetailPage: React.FC<{ id?: string }> = ({ id }) => {
  const { refreshHabits, openList } = useHabitContext();

  const [activeTab, setActiveTab] = useState('info');
  const [habit, setHabit] = useState<HabitVo | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // 获取习惯详情
  const fetchHabitDetail = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await HabitService.find(id);
      setHabit(response);
    } catch (error) {
      console.error('获取习惯详情失败:', error);
      message.error('获取习惯详情失败');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHabitDetail();
  }, [fetchHabitDetail]);

  // 处理习惯操作
  const handleHabitAction = useCallback(
    async (action: string) => {
      if (!habit) return;

      try {
        setActionLoading(true);

        switch (action) {
          case 'complete':
            if (!habit.cycleTodoId) throw new Error('当前没有可结算的习惯待办');
            await TodoController.done(TodoRelatedType.HABIT, habit.cycleTodoId);
            message.success('本次打卡已完成');
            break;
          case 'pause':
            await HabitService.pause(habit.id);
            message.success('习惯已暂停');
            break;
          case 'resume':
            await HabitService.activate(habit.id);
            message.success('习惯已开始');
            break;
          case 'abandon':
            await HabitService.abandon(habit.id);
            message.success('习惯已放弃');
            break;
          default:
            return;
        }

        fetchHabitDetail();
        refreshHabits();
        emitHabitChanged();
      } catch (error) {
        console.error(`${action}习惯失败:`, error);
        message.error(`${action}习惯失败`);
      } finally {
        setActionLoading(false);
      }
    },
    [habit, fetchHabitDetail, refreshHabits]
  );

  // 处理删除习惯
  const handleDelete = useCallback(() => {
    if (!habit) return;

    Modal.confirm({
      title: '确认删除习惯',
      content: '删除后无法恢复，确定要删除这个习惯吗？',
      onOk: async () => {
        try {
          await HabitService.delete(habit.id);
          message.success('习惯已删除');
          openList();
          refreshHabits();
          emitHabitChanged();
        } catch (error) {
          console.error('删除习惯失败:', error);
          message.error('删除习惯失败');
        }
      }
    });
  }, [habit, openList, refreshHabits]);

  const handleEdit = useCallback(async () => {
    if (!habit) return;
    try {
      const response = await GoalController.findByFilter({});
      const instance = openGrowthDrawer({
        title: '编辑习惯',
        size: 800,
        styles: drawerShellStyles,
        content: (
          <CreateHabit
            habit={habit}
            goals={response.list}
            onSuccess={async () => {
              await fetchHabitDetail();
              refreshHabits();
              instance.destroy();
            }}
            onCancel={() => instance.destroy()}
          />
        ),
      });
    } catch (error) {
      console.error('获取目标列表失败:', error);
      message.error('无法打开习惯编辑');
    }
  }, [fetchHabitDetail, habit, refreshHabits]);

  // 获取状态配置
  const statusConfig = habit ?
  HABIT_STATUS_OPTIONS.find((option) => option.value === habit.status) :
  null;
  const difficultyConfig = habit ? DIFFICULTY_MAP.get(habit.difficulty) : null;

  // 计算完成率
  const completionRate =
  habit?.completedCount && habit?.currentStreak ?
  Math.round(
    habit.completedCount / (
    habit.currentStreak + habit.completedCount) *
    100
  ) :
  0;

  if (loading) {
    return <LoadingState />;
  }

  if (!habit) {
    return <EmptyState description="习惯不存在或已被删除" />;
  }

  return (
    <ProductSurface id={productRef('growth.habit.view.detail')}>
      <Flex vertical container="full" className={styles.page}>
        <PageHeader
          title={
            <Flex align="center" gap={8}>
              <span>{habit.name}</span>
              <Badge status={statusConfig?.color as any} text={statusConfig?.label} />
            </Flex>
          }
          onBack={() => openList()}
          extra={
            <Space>
              {habit.status === HabitStatus.ACTIVE && (
                <>
                  <Button
                    type="primary"
                    icon={<Check size={16} />}
                    loading={actionLoading}
                    onClick={() => handleHabitAction('complete')}
                  >
                    完成
                  </Button>
                  <Button
                    icon={<Pause size={16} />}
                    loading={actionLoading}
                    onClick={() => handleHabitAction('pause')}
                  >
                    暂停
                  </Button>
                </>
              )}
              {(habit.status === HabitStatus.ABANDONED || habit.status === HabitStatus.PAUSED) && (
                <Button
                  type="primary"
                  icon={<Play size={16} />}
                  loading={actionLoading}
                  onClick={() => handleHabitAction('resume')}
                >
                  恢复
                </Button>
              )}
              {(habit.status === HabitStatus.ACTIVE || habit.status === HabitStatus.PAUSED) && (
                <Button
                  icon={<X size={16} />}
                  loading={actionLoading}
                  onClick={() => handleHabitAction('abandon')}
                >
                  放弃
                </Button>
              )}
              <Button icon={<Pencil size={16} />} onClick={handleEdit}>
                编辑
              </Button>
              <Button type="primary" danger icon={<Trash2 size={16} />} onClick={handleDelete}>
                删除
              </Button>
            </Space>
          }
        />
        <Flex container="fill" className={styles.body}>
          <DetailTabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'info',
                label: '基本信息',
                children: (
                  <Flex gap={24} className={styles.detail}>
                    <div className={styles.main}>
                      <Descriptions
                        column={2}
                        items={[
                          { key: 'name', label: '习惯名称', children: habit.name },
                          {
                            key: 'status',
                            label: '状态',
                            children: (
                              <Badge status={statusConfig?.color as any} text={statusConfig?.label} />
                            ),
                          },
                          {
                            key: 'importance',
                            label: '重要程度',
                            children: habit.importance ? `${habit.importance}/5` : '-',
                          },
                          {
                            key: 'difficulty',
                            label: '难度等级',
                            children: difficultyConfig ? (
                              <Tag color={difficultyConfig.color}>{difficultyConfig.label}</Tag>
                            ) : (
                              '-'
                            ),
                          },
                          {
                            key: 'repeatStartDate',
                            label: '开始时间',
                            children: habit.repeatStartDate
                              ? new Date(habit.repeatStartDate).toLocaleDateString()
                              : '-',
                          },
                          {
                            key: 'repeatEndDate',
                            label: '目标时间',
                            children: habit.repeatEndDate
                              ? new Date(habit.repeatEndDate).toLocaleDateString()
                              : '长期习惯',
                          },
                          {
                            key: 'createdAt',
                            label: '创建时间',
                            children: new Date(habit.createdAt).toLocaleString(),
                          },
                          {
                            key: 'updatedAt',
                            label: '更新时间',
                            children: new Date(habit.updatedAt).toLocaleString(),
                          },
                        ]}
                      />
                      {habit.description ? <p className={styles.description}>{habit.description}</p> : null}
                      {habit.tags?.length ? (
                        <Flex gap={8} wrap className={styles.tags}>
                          {habit.tags.map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </Flex>
                      ) : null}
                    </div>
                    <Surface className={styles.stats}>
                      <div className={styles.statHead}>
                        <span>完成率</span>
                        <strong>{completionRate}%</strong>
                      </div>
                      <Progress percent={completionRate} />
                      <div className={styles.metrics}>
                        <div>
                          <strong>{habit.currentStreak || 0}</strong>
                          <span>当前连续天数</span>
                        </div>
                        <div>
                          <strong>{habit.longestStreak || 0}</strong>
                          <span>最长连续天数</span>
                        </div>
                        <div>
                          <strong>{habit.completedCount || 0}</strong>
                          <span>总完成次数</span>
                        </div>
                        <div>
                          <strong>{habit.goals?.length || 0}</strong>
                          <span>关联目标数</span>
                        </div>
                      </div>
                    </Surface>
                  </Flex>
                ),
              },
              {
                key: 'goals',
                label: '关联目标',
                children:
                  habit.goals && habit.goals.length > 0 ? (
                    <Flex vertical gap={12}>
                      {habit.goals.map((goal) => (
                        <Surface key={goal.id} padded className={styles.goalRow}>
                          <div>
                            <div className={styles.goalName}>{goal.name}</div>
                            {goal.description ? (
                              <p className={styles.goalDescription}>{goal.description}</p>
                            ) : null}
                          </div>
                          <Progress percent={(goal as any).progress || 0} size="small" style={{ width: 100 }} />
                        </Surface>
                      ))}
                    </Flex>
                  ) : (
                    <EmptyState description="暂无关联目标" />
                  ),
              },
            ]}
          />
        </Flex>
      </Flex>
    </ProductSurface>
  );
};

export default HabitDetailPage;
