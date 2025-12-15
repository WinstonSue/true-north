import React, { useEffect, useState } from 'react';
import { FlexibleContainer } from 'francis-component-react';
import { Modal, Message } from '@arco-design/web-react';
import {
  Empty,
  Spin,
  Button,
  Breadcrumb,
  Divider,
} from '@arco-design/web-react';
import { IconEdit, IconDelete, IconRight } from '@arco-design/web-react/icon';
import { GoalService } from '@true-north/web-service';
import { useGoalTreeViewContext } from './context';
import {
  GoalDetailProvider,
  GoalForm,
  GoalForeign,
} from '../../components/GoalDetail';
import GoalStatusTransition from './GoalStatusTransition';
import clsx from 'clsx';

const { Fixed, Shrink } = FlexibleContainer;

const GoalDetailPanel: React.FC = () => {
  const {
    selectedGoal,
    fetchGoalDetail,
    refreshData,
    selectedGoalId,
    setSelectedGoalId,
  } = useGoalTreeViewContext();

  // 编辑状态管理
  const [isEditing, setIsEditing] = useState(false);

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

  // 删除目标
  const handleDelete = () => {
    if (!selectedGoal) return;

    Modal.confirm({
      title: '确定删除吗？',
      content: '删除后将无法恢复，如果目标下有子目标，将一并删除，是否继续？',
      onOk: async () => {
        try {
          await GoalService.delete(selectedGoal.id);
          Message.success('删除成功');
          refreshData();
        } catch (error) {
          console.error('删除失败:', error);
          Message.error('删除失败');
        }
      },
    });
  };

  if (!selectedGoalId) {
    return (
      <div
        className={clsx('w-full h-full', 'flex items-center justify-center')}
      >
        <Empty description="请从左侧选择一个目标查看详情" />
      </div>
    );
  }

  if (!selectedGoal) {
    return (
      <div
        className={clsx('w-full h-full', 'flex items-center justify-center')}
      >
        <Spin size={40} />
      </div>
    );
  }

  return (
    <GoalDetailProvider
      size="small"
      goalId={selectedGoal.id}
      readonly={!isEditing}
      onClose={handleEditComplete}
      afterSubmit={handleEditComplete}
    >
      <FlexibleContainer>
        <Fixed
          direction="vertical"
          className={clsx('px-4 !h-14', 'border-b border-border-2', 'gap-2')}
        >
          <Shrink direction="vertical" className={clsx('items-center gap-2')}>
            {/* 面包屑导航 */}
            <Breadcrumb
              className="flex-1"
              separator={<IconRight className="text-xs text-gray-400" />}
            >
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
          </Shrink>
          <Fixed className={'flex items-center'}>
            <GoalStatusTransition
              goal={selectedGoal}
              onStatusChange={handleStatusChange}
              size="small"
            />
          </Fixed>
          <Fixed className={'flex items-center gap-2'}>
            {!isEditing ? (
              <Button
                icon={<IconEdit />}
                onClick={() => setIsEditing(true)}
              ></Button>
            ) : (
              <>
                <Button
                  icon={<IconEdit />}
                  onClick={async () => {
                    await handleEditComplete();
                    setIsEditing(false);
                  }}
                >
                  确认
                </Button>
                <Button
                  icon={<IconEdit />}
                  onClick={() => {
                    setIsEditing(false);
                  }}
                >
                  取消
                </Button>
              </>
            )}
            <Button
              icon={<IconDelete />}
              status="danger"
              onClick={handleDelete}
            ></Button>
          </Fixed>
        </Fixed>
        <Shrink className={clsx('flex flex-col gap-4 p-4 overflow-auto')}>
          <GoalForm />
          <Divider className="!m-0" />
          <GoalForeign
            goalId={selectedGoal.id}
            onChangeGoal={async (id) => {
              setSelectedGoalId(id);
            }}
          />
        </Shrink>
      </FlexibleContainer>
    </GoalDetailProvider>
  );
};

export default GoalDetailPanel;
