import React, { useState, useEffect, useRef } from 'react';
import { GoalVo } from '@true-north/vo';
import {
  MindMap,
  createGoalConverter,
  exportUtils,
  MindMapData,
} from '@true-north/components-mind/src/index';
import { message } from '@sue/design-web-react';
import MindMapNode from './MindMapNode';
import MenuManager, { MenuManagerRef } from './NodeMenu/MenuManager';
import { openDrawer } from '@/layout/Drawer';
import GoalEditor from '@/pages/growth/components/GoalDetail/GoalEditor';
import { useGoalMindMapContext } from './context';
import {
  handleAddChild,
  handleAddSibling,
  handleCopyNode,
  handleDeleteNode,
  handleEditNode,
} from './helpers';

interface X6MindMapProps {
  goalTree: GoalVo[];
  onNodeClick?: (nodeId: string) => void;
  showToolbar?: boolean;
}

const X6MindMap: React.FC<X6MindMapProps> = ({
  goalTree,
  onNodeClick,
  showToolbar = true,
}) => {
  const { fetchGoalTree } = useGoalMindMapContext();
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const initializedRef = useRef<boolean>(false);
  const menuManagerRef = useRef<MenuManagerRef>(null);

  // 当goalTree变化时转换数据
  useEffect(() => {
    if (goalTree && goalTree.length > 0) {
      const converter = createGoalConverter();
      const data = converter.convert(goalTree);
      setMindMapData(data);
    } else {
      setMindMapData(null);
    }
  }, [goalTree]);

  // 防止缩放问题，只初始化一次尺寸
  useEffect(() => {
    if (!initializedRef.current && containerRef.current) {
      // 设置固定尺寸
      containerRef.current.style.width = '100%';
      containerRef.current.style.height = '100%';
      initializedRef.current = true;
    }
  }, []);

  // 保存图形实例的引用
  const handleGraphInstance = (graph: any) => {
    graphRef.current = graph;
  };

  // 处理全屏
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // 处理导出
  const handleExport = () => {
    if (graphRef.current) {
      exportUtils.exportToPNG(graphRef.current, 'goal-mind-map');
      message.success('已导出PNG图片');
    }
  };

  // 显示节点菜单
  const handleShowMenu = (
    nodeId: string,
    nodeType: string,
    position: { x: number; y: number },
  ) => {
    menuManagerRef.current?.showMenu(nodeId, nodeType, position);
  };

  // 菜单操作处理函数已移至 helpers.tsx

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      style={{ minHeight: '600px', minWidth: '300px', overflow: 'hidden' }}
    >
      {/* 思维导图内容 */}
      {mindMapData ? (
        <MindMap
          data={mindMapData}
          options={{
            editable: false,
            enableShortcuts: true,
            centerOnResize: true,
            hGap: 50,
            vGap: 25,
          }}
          showToolbar={showToolbar}
          onGraphReady={handleGraphInstance}
          MindMapNode={(props: any) => {
            return (
              <MindMapNode
                {...props}
                fetchGoalTree={fetchGoalTree}
                onShowMenu={handleShowMenu}
              />
            );
          }}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          暂无目标数据
        </div>
      )}

      {/* 节点菜单管理器 */}
      <MenuManager
        ref={menuManagerRef}
        onEdit={async (nodeId: string) => {
          await handleEditNode(nodeId);
          fetchGoalTree();
        }}
        onDelete={async (nodeId: string) => {
          await handleDeleteNode(nodeId);
          fetchGoalTree();
        }}
        onAddChild={async (nodeId: string) => {
          await handleAddChild(nodeId);
          fetchGoalTree();
        }}
        onAddSibling={async (nodeId: string) => {
          await handleAddSibling(nodeId);
          fetchGoalTree();
        }}
        onCopy={async (nodeId: string) => {
          await handleCopyNode(nodeId);
          fetchGoalTree();
        }}
      />
    </div>
  );
};

export default X6MindMap;
