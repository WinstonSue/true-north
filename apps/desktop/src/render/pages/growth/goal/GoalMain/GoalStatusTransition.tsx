import React, { useState } from 'react';
import { Select, Tag, message } from '@sue/design-web-react';
import { GoalStatus } from '@true-north/enum';
import { GoalService } from '@true-north/web-service';
import type { GoalVo } from '@true-north/vo';
import clsx from 'clsx';

interface GoalStatusTransitionProps {
  goal: GoalVo;
  onStatusChange?: (newStatus: GoalStatus) => void;
  disabled?: boolean;
}

// 状态配置映射
const STATUS_CONFIG = {
  [GoalStatus.TODO]: {
    label: '待开始',
    color: 'gray',
    nextStates: [GoalStatus.DOING, GoalStatus.ABANDONED],
  },
  [GoalStatus.DOING]: {
    label: '进行中',
    color: 'blue',
    nextStates: [GoalStatus.DONE, GoalStatus.TODO, GoalStatus.ABANDONED],
  },
  [GoalStatus.DONE]: {
    label: '已完成',
    color: 'green',
    nextStates: [GoalStatus.TODO, GoalStatus.DOING],
  },
  [GoalStatus.ABANDONED]: {
    label: '已放弃',
    color: 'red',
    nextStates: [GoalStatus.TODO],
  },
};

// 状态转换操作映射
const STATUS_ACTIONS = {
  [GoalStatus.TODO]: {
    label: '标记为待开始',
    action: 'restore', // 从其他状态恢复到TODO
  },
  [GoalStatus.DOING]: {
    label: '标记为进行中',
    action: 'update', // 通过update接口修改状态
  },
  [GoalStatus.DONE]: {
    label: '标记为已完成',
    action: 'update', // 使用update接口设置状态和完成时间
  },
  [GoalStatus.ABANDONED]: {
    label: '标记为已放弃',
    action: 'abandon',
  },
};

const GoalStatusTransition: React.FC<GoalStatusTransitionProps> = ({
  goal,
  onStatusChange,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);

  const currentStatus = goal.status;
  const currentConfig = STATUS_CONFIG[currentStatus];
  const availableStates = currentConfig.nextStates;

  // 处理状态转换
  const handleStatusChange = async (newStatus: GoalStatus) => {
    if (newStatus === currentStatus) return;

    setLoading(true);
    try {
      const actionConfig = STATUS_ACTIONS[newStatus];

      switch (actionConfig.action) {
        case 'abandon':
          await GoalService.abandon(goal.id, { silent: false });
          break;
        case 'restore':
          await GoalService.restore(goal.id, { silent: false });
          break;
        case 'update':
          // 通过update接口修改状态
          const updateData: any = { status: newStatus };

          // 根据新状态设置或清除相关时间戳
          if (newStatus === GoalStatus.DONE) {
            // 标记为完成，设置完成时间，清除放弃时间
            updateData.doneAt = new Date().toISOString();
            updateData.abandonedAt = null;
          } else if (newStatus === GoalStatus.DOING) {
            // 标记为进行中，清除完成时间和放弃时间
            updateData.doneAt = null;
            updateData.abandonedAt = null;
          } else if (newStatus === GoalStatus.TODO) {
            // 标记为待开始，清除完成时间和放弃时间
            updateData.doneAt = null;
            updateData.abandonedAt = null;
          }

          await GoalService.update(goal.id, updateData, { silent: false });
          break;
        default:
          throw new Error('未知的状态转换操作');
      }

      onStatusChange?.(newStatus);
    } catch (error) {
      console.error('状态转换失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      value={currentStatus}
      onChange={handleStatusChange}
      disabled={disabled || loading}
      loading={loading}
      placeholder="选择状态"
      className={clsx('w-24', disabled && 'opacity-50')}
      popupMatchSelectWidth={false}
      labelRender={() => (
        <Tag color={currentConfig.color}>{currentConfig.label}</Tag>
      )}
      options={availableStates.map((status) => {
        const config = STATUS_CONFIG[status];
        return {
          value: status,
          label: <Tag color={config.color}>{config.label}</Tag>,
        };
      })}
    />
  );
};

export default GoalStatusTransition;
