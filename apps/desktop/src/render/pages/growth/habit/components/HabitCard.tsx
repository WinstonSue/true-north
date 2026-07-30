import React from 'react';
import {
  Card,
  Tag,
  Button,
  Space,
  Progress,
  Dropdown,
  Menu,
  Badge,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from '@sue/design-web-react';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { HabitWithoutRelationsVo } from '@true-north/vo';
import { HabitStatus } from '@true-north/enum';
import { HABIT_STATUS_OPTIONS, HABIT_DIFFICULTY_OPTIONS } from '../constants';

interface HabitCardProps {
  habit: HabitWithoutRelationsVo;
  onComplete?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onAbandon?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onComplete,
  onPause,
  onResume,
  onAbandon,
  onDelete,
  onEdit
}) => {
  // 获取状态配置
  const statusConfig = HABIT_STATUS_OPTIONS.find(
    (option) => option.value === habit.status
  );
  const difficultyConfig = HABIT_DIFFICULTY_OPTIONS.find(
    (option) => option.value === habit.difficulty
  );

  // 计算完成率
  const completionRate =
  habit.completedCount && habit.currentStreak ?
  Math.round(
    habit.completedCount / (
    habit.currentStreak + habit.completedCount) *
    100
  ) :
  0;

  // 渲染操作菜单
  const renderActionMenu = () => {
    const menuItems = [];

    if (habit.status === HabitStatus.DOING) {
      menuItems.push(
        <Menu.Item key="complete" onClick={onComplete}>
          <CheckOutlined /> 标记完成
        </Menu.Item>,
        <Menu.Item key="pause" onClick={onPause}>
          <PauseOutlined /> 暂停习惯
        </Menu.Item>
      );
    }

    if (habit.status === HabitStatus.ABANDONED) {
      menuItems.push(
        <Menu.Item key="resume" onClick={onResume}>
          <CaretRightOutlined /> 恢复习惯
        </Menu.Item>
      );
    }

    if (
    habit.status === HabitStatus.DOING ||
    habit.status === HabitStatus.ABANDONED)
    {
      menuItems.push(
        <Menu.Item key="abandon" onClick={onAbandon}>
          <CloseOutlined /> 放弃习惯
        </Menu.Item>
      );
    }

    menuItems.push(
      <Menu.Item key="edit" onClick={onEdit}>
        <EditOutlined /> 编辑习惯
      </Menu.Item>,
      <Menu.Item key="delete" onClick={onDelete} className="text-red-500">
        <DeleteOutlined /> 删除习惯
      </Menu.Item>
    );

    return <Menu>{menuItems}</Menu>;
  };

  return (
    <Card
      className="habit-card h-full"
      hoverable
      actions={[
      <Dropdown
        key="more"
        dropdownRender={() => renderActionMenu()}
        placement="bottomRight">

          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>]
      }>

      {/* 卡片头部 */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <span className="font-medium text-base line-clamp-2">
            {habit.name}
          </span>
          {habit.description &&
          <p
            className="text-sm text-gray-500 mt-1 line-clamp-2"
            style={{ marginBottom: 0 }}>

              {habit.description}
            </p>
          }
        </div>
        <Badge
          status={statusConfig?.color as any}
          text={statusConfig?.label}
          className="ml-2" />

      </div>

      {/* 标签和难度 */}
      <div className="flex flex-wrap gap-1 mb-3">
        {difficultyConfig &&
        <Tag color={difficultyConfig.color} >
            {difficultyConfig.label}
          </Tag>
        }
        {habit.importance &&
        <Tag color="blue" >
            重要度: {habit.importance}
          </Tag>
        }
        {habit.tags?.slice(0, 2).map((tag, index) =>
        <Tag key={index} >
            {tag}
          </Tag>
        )}
        {habit.tags && habit.tags.length > 2 &&
        <Tag >+{habit.tags.length - 2}</Tag>
        }
      </div>

      {/* 进度信息 */}
      <div className="space-y-2">
        {/* 完成率 */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">完成率</span>
            <span className="text-sm font-medium">{completionRate}%</span>
          </div>
          <Progress percent={completionRate}  />
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-gray-50 rounded p-2">
            <div className="text-lg font-bold text-blue-600">
              {habit.currentStreak || 0}
            </div>
            <div className="text-xs text-gray-500">当前连续</div>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <div className="text-lg font-bold text-green-600">
              {habit.longestStreak || 0}
            </div>
            <div className="text-xs text-gray-500">最长连续</div>
          </div>
        </div>

        {/* 时间信息 */}
        <div className="text-xs text-gray-500 space-y-1">
          {habit.repeatStartDate &&
          <div>开始时间: {new Date(habit.repeatStartDate).toLocaleDateString()}</div>
          }
          {habit.repeatEndDate &&
          <div>目标时间: {new Date(habit.repeatEndDate).toLocaleDateString()}</div>
          }
        </div>
      </div>

      {/* 快捷操作按钮 */}
      {habit.status === HabitStatus.DOING &&
      <div className="mt-3 pt-3 border-t border-gray-100">
          <Space className="w-full">
            <Button
            type="primary"
            size="small"
            icon={<CheckOutlined />}
            onClick={onComplete}
            className="flex-1">

              完成
            </Button>
            <Button  icon={<PauseOutlined />} onClick={onPause}>
              暂停
            </Button>
          </Space>
        </div>
      }

      {habit.status === HabitStatus.ABANDONED &&
      <div className="mt-3 pt-3 border-t border-gray-100">
          <Button
          type="primary"
          size="small"
          icon={<CaretRightOutlined />}
          onClick={onResume}
          className="w-full">

            恢复习惯
          </Button>
        </div>
      }
    </Card>);

};

export default HabitCard;