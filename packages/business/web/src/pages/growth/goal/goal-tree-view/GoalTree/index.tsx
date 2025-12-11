import React, { useEffect, useState } from 'react';
import {
  Tree,
  Input,
  Button,
  Dropdown,
  Menu,
  Spin,
  Empty,
} from '@arco-design/web-react';
import {
  IconSearch,
  IconPlus,
  IconMore,
  IconEdit,
  IconDelete,
  IconCopy,
} from '@arco-design/web-react/icon';
import { GoalVo } from '@true-north/vo';
import { useGoalTreeViewContext } from '../context';
import { useGoalDetail } from '../../../components/GoalDetail';
import { GoalService } from '@true-north/web-service';
import { Modal, Message } from '@arco-design/web-react';
import styles from './style.module.less';
import clsx from 'clsx';
import { FlexibleContainer } from 'francis-component-react';

const { Fixed, Shrink } = FlexibleContainer;

interface TreeNodeData {
  key: string;
  title: React.ReactNode;
  children?: TreeNodeData[];
  goalData: GoalVo;
  goalName: string; // 用于搜索的纯文本标题
}

const GoalTreePanel: React.FC = ({}) => {
  const {
    loading,
    goalTree,
    fetchGoalTree,
    refreshData,
    selectedGoalId,
    setSelectedGoalId,
  } = useGoalTreeViewContext();
  const { openCreateDrawer, openEditDrawer } = useGoalDetail();
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);

  // 初始化数据
  useEffect(() => {
    fetchGoalTree();
  }, []);

  // 渲染节点操作菜单
  const renderNodeMenu = (goal: GoalVo) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(goal)}>
        <IconEdit /> 编辑
      </Menu.Item>
      <Menu.Item key="addChild" onClick={() => handleAddChild(goal)}>
        <IconPlus /> 添加子目标
      </Menu.Item>
      <Menu.Item key="addSibling" onClick={() => handleAddSibling(goal)}>
        <IconPlus /> 添加同级目标
      </Menu.Item>
      <Menu.Item key="copy" onClick={() => handleCopy(goal)}>
        <IconCopy /> 复制
      </Menu.Item>
      <Menu.Item
        key="divider"
        disabled
        style={{
          height: '1px',
          padding: 0,
          margin: '4px 0',
          backgroundColor: '#e5e6eb',
        }}
      />
      <Menu.Item key="delete" onClick={() => handleDelete(goal)}>
        <IconDelete /> 删除
      </Menu.Item>
    </Menu>
  );

  // 转换目标数据为树形结构
  const convertToTreeData = (goals: GoalVo[]): TreeNodeData[] => {
    return goals.map((goal) => ({
      key: goal.id,
      title: (
        <div className={clsx(styles['tree-node'])}>
          <span>{goal.name}</span>
          <Dropdown
            droplist={renderNodeMenu(goal)}
            trigger="click"
            position="br"
          >
            <Button
              type="text"
              size="mini"
              icon={<IconMore />}
              className={styles['node-action']}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        </div>
      ),
      goalData: goal,
      goalName: goal.name,
      children: goal.children ? convertToTreeData(goal.children) : undefined,
    }));
  };

  // 过滤树节点
  const filterTreeData = (
    data: TreeNodeData[],
    keyword: string,
  ): TreeNodeData[] => {
    if (!keyword) return data;

    return data.reduce<TreeNodeData[]>((acc, node) => {
      const matchesSearch = node.goalName
        .toLowerCase()
        .includes(keyword.toLowerCase());
      const filteredChildren = node.children
        ? filterTreeData(node.children, keyword)
        : [];

      if (matchesSearch || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children:
            filteredChildren.length > 0 ? filteredChildren : node.children,
        });
      }

      return acc;
    }, []);
  };

  // 更新树形数据
  useEffect(() => {
    const converted = convertToTreeData(goalTree);
    const filtered = filterTreeData(converted, searchValue);
    setTreeData(filtered);

    // 搜索时自动展开所有节点
    if (searchValue) {
      const getAllKeys = (data: TreeNodeData[]): string[] => {
        const keys: string[] = [];
        data.forEach((node) => {
          keys.push(node.key);
          if (node.children) {
            keys.push(...getAllKeys(node.children));
          }
        });
        return keys;
      };
      setExpandedKeys(getAllKeys(filtered));
    }
  }, [goalTree, searchValue]);

  // 处理节点选择
  const handleSelect = (selectedKeys: string[]) => {
    const goalId = selectedKeys[0] || null;
    setSelectedGoalId(goalId);
  };

  // 处理节点展开
  const handleExpand = (expandedKeys: string[]) => {
    setExpandedKeys(expandedKeys);
  };

  // 创建子目标
  const handleAddChild = (parentGoal: GoalVo) => {
    openCreateDrawer({
      title: '新增子目标',
      contentProps: {
        initialFormData: {
          parentId: parentGoal.id,
        },
        afterSubmit: refreshData,
      },
    });
  };

  // 创建同级目标
  const handleAddSibling = async (currentGoal: GoalVo) => {
    openCreateDrawer({
      title: '新增同级目标',
      contentProps: {
        initialFormData: {
          parentId: currentGoal.parentId,
        },
        afterSubmit: refreshData,
      },
    });
  };

  // 编辑目标
  const handleEdit = (goal: GoalVo) => {
    openEditDrawer({
      title: '编辑目标',
      contentProps: {
        goalId: goal.id,
        afterSubmit: refreshData,
      },
    });
  };

  // 复制目标
  const handleCopy = async (goal: GoalVo) => {
    openCreateDrawer({
      title: '复制目标',
      contentProps: {
        initialFormData: {
          name: `${goal.name} - 副本`,
          description: goal.description,
          type: goal.type,
          importance: goal.importance,
          difficulty: goal.difficulty,
          parentId: goal.parentId,
          planTimeRange: [undefined, undefined],
        },
        afterSubmit: refreshData,
      },
    });
  };

  // 删除目标
  const handleDelete = (goal: GoalVo) => {
    Modal.confirm({
      title: '确定删除吗？',
      content: '删除后将无法恢复，如果目标下有子目标，将一并删除，是否继续？',
      onOk: async () => {
        try {
          await GoalService.delete(goal.id);
          Message.success('删除成功');
          refreshData();
          // 如果删除的是当前选中的目标，清空选择
          if (selectedGoalId === goal.id) {
            setSelectedGoalId(null);
          }
        } catch (error) {
          console.error('删除失败:', error);
          Message.error('删除失败');
        }
      },
    });
  };

  // 获取所有节点的 key
  const getAllKeys = (data: TreeNodeData[]): string[] => {
    const keys: string[] = [];
    data.forEach((node) => {
      keys.push(node.key);
      if (node.children) {
        keys.push(...getAllKeys(node.children));
      }
    });
    return keys;
  };

  return (
    <FlexibleContainer className={clsx()}>
      {/* 头部工具栏 */}
      <Fixed
        className={clsx(
          'p-4',
          'flex flex-col gap-3',
          'border-b border-border-2',
        )}
      >
        <div className={clsx('w-full')}>
          <Input
            placeholder="搜索目标..."
            prefix={<IconSearch />}
            value={searchValue}
            onChange={setSearchValue}
            allowClear
          />
        </div>
        <Button
          type="primary"
          icon={<IconPlus />}
          onClick={() =>
            openCreateDrawer({
              title: '新建目标',
              contentProps: {
                afterSubmit: refreshData,
              },
            })
          }
        >
          新建
        </Button>
      </Fixed>

      <Shrink className={clsx('p-4', 'overflow-y-auto')}>
        <Spin loading={loading} className={clsx('w-full')}>
          {treeData.length > 0 ? (
            <Tree
              treeData={treeData}
              selectedKeys={selectedGoalId ? [selectedGoalId] : []}
              expandedKeys={expandedKeys}
              onSelect={handleSelect}
              onExpand={handleExpand}
              showLine
              blockNode
              className={clsx('w-full')}
            />
          ) : (
            <Empty description="暂无目标数据" />
          )}
        </Spin>
      </Shrink>
    </FlexibleContainer>
  );
};

export default GoalTreePanel;
