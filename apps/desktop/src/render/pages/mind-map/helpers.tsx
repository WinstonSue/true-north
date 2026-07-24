import { Message } from '@arco-design/web-react';
import { openDrawer } from '@/layout/Drawer';
import GoalEditor from '@/pages/growth/components/GoalDetail/GoalEditor';
import GoalCreator from '@/pages/growth/components/GoalDetail/GoalCreator';
import { Modal } from '@arco-design/web-react';
import { GoalService } from '@true-north/web-service';

export const handleAddChild = (nodeId: string) => {
  return new Promise((resolve) => {
    openDrawer({
      title: '新增子目标',
      width: 800,
      content: (props) => {
        return (
          <GoalCreator
            initialFormData={{
              parentId: nodeId, // 设置父级目标为当前节点
            }}
            onClose={props.onClose}
            afterSubmit={async () => {
              resolve(true);
            }}
          />
        );
      },
    });
  });
};

export const handleAddSibling = async (nodeId: string) => {
  return new Promise(async (resolve) => {
    try {
      // 获取当前节点信息，以获取其父级ID
      const currentGoal = await GoalService.find(nodeId);
      const parentId = currentGoal.parentId;

      openDrawer({
        title: '新增同级目标',
        width: 800,
        content: (props) => {
          return (
            <GoalCreator
              initialFormData={{
                parentId: parentId, // 设置父级目标为当前节点的父级
              }}
              onClose={props.onClose}
              afterSubmit={async () => {
                resolve(true);
              }}
            />
          );
        },
      });
    } catch (error) {
      console.error('获取目标信息失败:', error);
      Message.error('获取目标信息失败');
      resolve(false);
    }
  });
};

export const handleCopyNode = async (nodeId: string) => {
  return new Promise(async (resolve) => {
    try {
      // 获取当前节点信息
      const currentGoal = await GoalService.find(nodeId);

      openDrawer({
        title: '复制目标',
        width: 800,
        content: (props) => {
          return (
            <GoalCreator
              initialFormData={{
                name: `${currentGoal.name} - 副本`,
                description: currentGoal.description,
                type: currentGoal.type,
                importance: currentGoal.importance,
                difficulty: currentGoal.difficulty,
                parentId: currentGoal.parentId, // 保持相同的父级
                planTimeRange: [undefined, undefined], // 重置时间范围
              }}
              onClose={props.onClose}
              afterSubmit={async () => {
                resolve(true);
              }}
            />
          );
        },
      });
    } catch (error) {
      console.error('获取目标信息失败:', error);
      Message.error('获取目标信息失败');
      resolve(false);
    }
  });
};

export const handleDeleteNode = (nodeId: string) => {
  return new Promise((resolve) => {
    Modal.confirm({
      title: '确定删除吗？',
      content: '删除后将无法恢复,如果目标下有子目标,将一并删除,是否继续?',
      onOk: async () => {
        await GoalService.delete(nodeId);
        resolve(true);
      },
    });
  });
};

export const handleEditNode = (nodeId: string) => {
  return new Promise((resolve) => {
    openDrawer({
      title: '编辑目标',
      width: 800,
      content: (props) => {
        return (
          <GoalEditor
            goalId={nodeId}
            onClose={props.onClose}
            afterSubmit={async () => {
              resolve(true);
            }}
          />
        );
      },
    });
  });
};
