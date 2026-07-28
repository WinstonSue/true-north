import React, { useEffect, useState } from 'react';
import { Modal, message, Tag, Dropdown, Menu, Button, Breadcrumb, Flex, CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined, RightOutlined } from '@sue/design-web-react';

import { GoalService } from '@true-north/web-service';
import { useGoalContext } from '../context';
import { GoalStatus } from '@true-north/enum';
import clsx from 'clsx';

// 状态配置映射
const STATUS_CONFIG = {
  [GoalStatus.TODO]: {
    label: '待开始',
    color: 'gray',
  },
  [GoalStatus.DOING]: {
    label: '进行中',
    color: 'blue',
  },
  [GoalStatus.DONE]: {
    label: '已完成',
    color: 'green',
  },
  [GoalStatus.ABANDONED]: {
    label: '已放弃',
    color: 'red',
  },
};

const GoalMainHeader: React.FC = () => {
  const {
    selectedGoal,
    fetchGoalDetail,
    refreshData,
    selectedGoalId,
    setSelectedGoalId,
    isEditing,
    setIsEditing,
  } = useGoalContext();

  // 构建面包屑路径
  const buildBreadcrumbPath = () => {
    if (!selectedGoal) return [];

    const path = [];
    let current = selectedGoal;

    // 从当前目标向上追溯到根目标
    while (current) {
      path.unshift({
        id: current.id,
        name: current.name,
        goal: current,
      });
      current = current.parent;
    }

    return path;
  };

  const breadcrumbPath = buildBreadcrumbPath();

  // 当选中的目标ID变化时，获取详情
  useEffect(() => {
    if (selectedGoalId) {
      fetchGoalDetail(selectedGoalId);
      setIsEditing(false); // 切换目标时退出编辑模式
    }
  }, [selectedGoalId]);

  // 编辑完成后的回调
  const handleEditComplete = async () => {
    setIsEditing(false);
    await refreshData();
  };

  // 状态变更后的回调
  const handleStatusChange = async () => {
    await refreshData();
  };

  // 标记完成
  const handleComplete = async () => {
    if (!selectedGoal) return;

    try {
      await GoalService.update(selectedGoal.id, {
        status: GoalStatus.DONE,
        doneAt: new Date().toISOString(),
        abandonedAt: null,
      });
      message.success('目标已标记为完成');
      await refreshData();
    } catch (error) {
      console.error('标记完成失败:', error);
      message.error('标记完成失败');
    }
  };

  // 放弃目标
  const handleAbandon = () => {
    if (!selectedGoal) return;

    Modal.confirm({
      title: '确定放弃目标吗？',
      content: '放弃后可以重新激活，是否继续？',
      onOk: async () => {
        try {
          await GoalService.abandon(selectedGoal.id);
          message.success('目标已放弃');
          await refreshData();
        } catch (error) {
          console.error('放弃失败:', error);
          message.error('放弃失败');
        }
      },
    });
  };

  // 删除目标
  const handleDelete = () => {
    if (!selectedGoal) return;

    Modal.confirm({
      title: '确定删除吗？',
      content: '删除后将无法恢复，如果目标下有子目标，将一并删除，是否继续？',
      onOk: async () => {
        try {
          await GoalService.delete(selectedGoal.id);
          message.success('删除成功');
          await refreshData();
        } catch (error) {
          console.error('删除失败:', error);
          message.error('删除失败');
        }
      },
    });
  };

  // 渲染操作菜单
  const renderActionMenu = () => (
    <Menu>
      <Menu.Item key="edit" onClick={() => setIsEditing(true)}>
        <EditOutlined /> 编辑
      </Menu.Item>
      <Menu.Item key="abandon" onClick={handleAbandon}>
        <CloseOutlined /> 放弃
      </Menu.Item>
      <Menu.Item key="delete" onClick={handleDelete} className="text-red-500">
        <DeleteOutlined /> 删除
      </Menu.Item>
    </Menu>
  );

  return (
    <Flex
      container="fixed"
      className={clsx(
        'w-full px-4 !h-14',
        'border-b border-border-2',
        'justify-between',
      )}
    >
      {/* 左侧：面包屑导航 */}
      <Flex container="fill" className={clsx('flex items-center')}>
        <Breadcrumb separator={<RightOutlined className="text-xs text-gray-400" />}>
          {breadcrumbPath.map((item, index) => (
            <Breadcrumb.Item
              key={item.id}
              className={clsx(
                'cursor-pointer transition-colors',
                index === breadcrumbPath.length - 1
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-600 hover:text-blue-600',
              )}
              onClick={() => {
                if (index < breadcrumbPath.length - 1) {
                  setSelectedGoalId(item.id);
                }
              }}
            >
              {item.name}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>

        {selectedGoal && (
          <Tag color={STATUS_CONFIG[selectedGoal.status]?.color}>
            {STATUS_CONFIG[selectedGoal.status]?.label}
          </Tag>
        )}
      </Flex>

      {/* 右侧：状态 Tag + 操作区 */}
      <Flex
        container="fixed"
        className={clsx('h-full', 'flex items-center gap-2')}
      >
        {/* 主要按钮：已完成 */}
        {selectedGoal && selectedGoal.status !== GoalStatus.DONE && (
          <Button
            type="outline"
            size="default"
            status="success"
            icon={<CheckOutlined />}
            onClick={handleComplete}
          >
            已完成
          </Button>
        )}

        <Dropdown
          dropdownRender={() => renderActionMenu()}
          placement="bottomRight"
        >
          <Button icon={<EllipsisOutlined />} />
        </Dropdown>
      </Flex>
    </Flex>
  );
};

export default GoalMainHeader;
