import React, { useState } from 'react';
import { Button, Tag, Dropdown, Menu, Message } from '@arco-design/web-react';
import { IconDown, IconCheck, IconClose, IconRefresh } from '@arco-design/web-react/icon';
import { GoalStatus } from '@true-north/enum';
import { GoalService } from '@true-north/web-service';
import type { GoalVo } from '@true-north/vo';
import clsx from 'clsx';

interface GoalStatusTransitionProps {
  goal: GoalVo;
  onStatusChange?: (newStatus: GoalStatus) => void;
  size?: 'mini' | 'small' | 'default' | 'large';
  disabled?: boolean;
}

// 状态配置映射
const STATUS_CONFIG = {
  [GoalStatus.TODO]: {
    label: '待开始',
    color: 'gray',
    icon: <IconClose />,
    nextStates: [GoalStatus.DOING, GoalStatus.ABANDONED],
  },
  [GoalStatus.DOING]: {
    label: '进行中',
    color: 'blue',
    icon: <IconRefresh />,
    nextStates: [GoalStatus.DONE, GoalStatus.TODO, GoalStatus.ABANDONED],
  },
  [GoalStatus.DONE]: {
    label: '已完成',
    color: 'green',
    icon: <IconCheck />,
    nextStates: [GoalStatus.TODO, GoalStatus.DOING],
  },
  [GoalStatus.ABANDONED]: {
    label: '已放弃',
    color: 'red',
    icon: <IconClose />,
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
  size = 'small',
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

  // 构建下拉菜单
  const dropdownMenu = (
    <Menu>
      {availableStates.map((status) => {
        const config = STATUS_CONFIG[status];
        const actionConfig = STATUS_ACTIONS[status];
        return (
          <Menu.Item
            key={status}
            onClick={() => handleStatusChange(status)}
          >
            <div className="flex items-center gap-2">
              {config.icon}
              <Tag color={config.color} size="small">
                {config.label}
              </Tag>
              <span className="text-xs text-gray-500 ml-auto">
                {actionConfig.label}
              </span>
            </div>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <Dropdown
      droplist={dropdownMenu}
      position="bottom"
      disabled={disabled || loading || availableStates.length === 0}
    >
      <Button
        size={size}
        loading={loading}
        disabled={disabled}
        className={clsx(
          'flex items-center gap-1',
          'border-0 shadow-none',
          'hover:bg-gray-100'
        )}
      >
        <div className="flex items-center gap-1">
          {currentConfig.icon}
          <Tag color={currentConfig.color} size="small">
            {currentConfig.label}
          </Tag>
          {availableStates.length > 0 && <IconDown className="text-xs" />}
        </div>
      </Button>
    </Dropdown>
  );
};

export default GoalStatusTransition;
