import { TreeSelect } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { GoalService } from '@true-north/web-service';
import type { GoalVo } from '@true-north/vo';
import { GoalStatus } from '@true-north/enum';

interface GoalTreeSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  /** 需要排除的目标ID（例如当前编辑的目标本身） */
  excludeId?: string;
}

interface TreeNode {
  key: string;
  title: string;
  value: string;
  children?: TreeNode[];
  disabled?: boolean;
}

export default function GoalTreeSelector(props: GoalTreeSelectorProps) {
  const {
    value,
    onChange,
    placeholder = '请选择父级目标',
    allowClear = true,
    disabled = false,
    excludeId,
  } = props;

  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  useEffect(() => {
    fetchGoalTree();
  }, [excludeId]);

  const fetchGoalTree = async () => {
    setLoading(true);
    try {
      const data = await GoalService.getTree({
        status: GoalStatus.TODO, // 只显示进行中的目标
      });
      
      if (data) {
        const tree = convertToTreeNodes(data, excludeId);
        setTreeData(tree);
      }
    } catch (error) {
      console.error('获取目标树失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 将 GoalVo 转换为 TreeSelect 所需的 TreeNode 格式
  const convertToTreeNodes = (goals: GoalVo[], excludeId?: string): TreeNode[] => {
    return goals
      .filter((goal) => goal.id !== excludeId) // 过滤掉当前编辑的目标
      .map((goal) => {
        const node: TreeNode = {
          key: goal.id,
          title: goal.name,
          value: goal.id,
          // 如果当前目标就是要排除的ID，或者其子孙中包含要排除的ID，则禁用
          disabled: excludeId ? isDescendantOf(goal, excludeId) : false,
        };

        // 递归处理子目标
        if (goal.children && goal.children.length > 0) {
          node.children = convertToTreeNodes(goal.children, excludeId);
        }

        return node;
      });
  };

  // 检查目标是否是指定ID的子孙节点（防止循环引用）
  const isDescendantOf = (goal: GoalVo, targetId: string): boolean => {
    if (goal.id === targetId) return true;
    
    if (goal.children && goal.children.length > 0) {
      return goal.children.some((child) => isDescendantOf(child, targetId));
    }
    
    return false;
  };

  return (
    <TreeSelect
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      treeData={treeData}
      loading={loading}
      allowClear={allowClear}
      disabled={disabled}
      showSearch
      filterTreeNode={(inputValue, treeNode) => {
        return treeNode.title?.toLowerCase().includes(inputValue.toLowerCase()) || false;
      }}
      treeProps={{
        virtualListProps: {
          height: 200,
        },
      }}
    />
  );
}
