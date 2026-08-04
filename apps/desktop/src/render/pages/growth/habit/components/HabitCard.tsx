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
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from '@sue/design-web-react';
import { HabitWithoutRelationsVo } from '@true-north/vo';
import { HabitStatus } from '@true-north/enum';
import { HABIT_STATUS_OPTIONS, HABIT_DIFFICULTY_OPTIONS } from '../constants';
import styles from './HabitCard.module.less';

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

    if (onComplete) {
      menuItems.push(
        <Menu.Item key="complete" onClick={onComplete}>
          <CheckOutlined /> 标记完成
        </Menu.Item>
      );
    }

    if (onResume) {
      menuItems.push(
        <Menu.Item key="resume" onClick={onResume}>
          恢复习惯
        </Menu.Item>
      );
    }

    if (onPause) {
      menuItems.push(
        <Menu.Item key="pause" onClick={onPause}>
          暂停习惯
        </Menu.Item>
      );
    }

    if (onAbandon) menuItems.push(<Menu.Item key="abandon" onClick={onAbandon}>放弃习惯</Menu.Item>);

    if (onEdit) menuItems.push(
      <Menu.Item key="edit" onClick={onEdit}>
        <EditOutlined /> 编辑习惯
      </Menu.Item>);
    if (onDelete) menuItems.push(
      <Menu.Item key="delete" onClick={onDelete} className={styles.dangerAction}>
        <DeleteOutlined /> 删除习惯
      </Menu.Item>
    );

    return <Menu>{menuItems}</Menu>;
  };

  return (
    <Card
      className={styles.card}
      hoverable
      actions={[
      <Dropdown
        key="more"
        popupRender={() => renderActionMenu()}
        placement="bottomRight">

          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>]
      }>

      {/* 卡片头部 */}
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <span className={styles.title}>
            {habit.name}
          </span>
          {habit.description &&
          <p
            className={styles.description}>

              {habit.description}
            </p>
          }
        </div>
        <Badge
          status={statusConfig?.color as any}
          text={statusConfig?.label}
          className={styles.status} />

      </div>

      {/* 标签和难度 */}
      <div className={styles.tags}>
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
      <div className={styles.body}>
        {/* 完成率 */}
        <div>
          <div className={styles.progressHeader}>
            <span>完成率</span>
            <strong>{completionRate}%</strong>
          </div>
          <Progress percent={completionRate}  />
        </div>

        {/* 统计信息 */}
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <div className={styles.metricPrimary}>
              {habit.currentStreak || 0}
            </div>
            <div>当前连续</div>
          </div>
          <div className={styles.metric}>
            <div className={styles.metricSuccess}>
              {habit.longestStreak || 0}
            </div>
            <div>最长连续</div>
          </div>
        </div>

        {/* 时间信息 */}
        <div className={styles.dates}>
          {habit.repeatStartDate &&
          <div>开始时间: {new Date(habit.repeatStartDate).toLocaleDateString()}</div>
          }
          {habit.repeatEndDate &&
          <div>目标时间: {new Date(habit.repeatEndDate).toLocaleDateString()}</div>
          }
        </div>
      </div>

      {/* 快捷操作按钮 */}
      {onComplete &&
      <div className={styles.footer}>
          <Space className={styles.footerActions}>
            <Button
            type="primary"
            size="small"
            icon={<CheckOutlined />}
            onClick={onComplete}
            className={styles.completeButton}>

              完成
            </Button>
          </Space>
        </div>
      }

      {onResume &&
      <div className={styles.footer}>
          <Button
          type="primary"
          size="small"
          onClick={onResume}
          className={styles.fullButton}>

            恢复习惯
          </Button>
        </div>
      }
    </Card>);

};

export default HabitCard;
