import { useCallback, useEffect } from 'react';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button, Flex } from '@sue/design-web-react';
import type { WorkflowDefinitionGraph } from '@true-north/plugin-contract';
import { patchGraph, useDefinitionDraft } from './draft';
import styles from './style.module.less';

function toFlow(graph: WorkflowDefinitionGraph): { nodes: Node[]; edges: Edge[] } {
  const start: Node = {
    id: 'start',
    position: graph.layout?.positions?.start || { x: 40, y: 160 },
    data: { label: `开始 · ${graph.start.eventContributionId || '未选事件'}` },
    type: 'input',
  };
  const nodes = [
    start,
    ...graph.nodes.map((node, index) => ({
      id: node.key,
      position: graph.layout?.positions?.[node.key] || { x: 280 + (index % 3) * 220, y: 80 + Math.floor(index / 3) * 120 },
      data: { label: `${node.kind} · ${node.contributionId}` },
    })),
  ];
  const edges = graph.edges.map((edge) => ({
    id: edge.key,
    source: edge.from,
    target: edge.to,
  }));
  return { nodes, edges };
}

export function CanvasEditor() {
  const { draft, setDraft, catalog } = useDefinitionDraft();
  const mapped = toFlow(draft.graph);
  const [nodes, setNodes, onNodesChange] = useNodesState(mapped.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(mapped.edges);

  useEffect(() => {
    const next = toFlow(draft.graph);
    setNodes(next.nodes);
    setEdges(next.edges);
  }, [draft.graph, setEdges, setNodes]);

  const persistPositions = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      const moved = changes.filter((change) => change.type === 'position' && change.position);
      if (!moved.length) return;
      patchGraph(setDraft, (graph) => {
        const positions = { ...(graph.layout?.positions || {}) };
        for (const change of moved) {
          if (change.type === 'position' && change.position) positions[change.id] = change.position;
        }
        return { ...graph, layout: { positions } };
      });
    },
    [onNodesChange, setDraft],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((current) => addEdge(connection, current));
      if (!connection.source || !connection.target) return;
      patchGraph(setDraft, (graph) => ({
        ...graph,
        edges: [
          ...graph.edges,
          {
            key: `e-${connection.source}-${connection.target}-${graph.edges.length + 1}`,
            from: connection.source,
            to: connection.target,
          },
        ],
      }));
    },
    [setDraft, setEdges],
  );

  function addFromCatalog(kind: 'workspace' | 'command', contributionId: string) {
    const key = `n${draft.graph.nodes.length + 1}`;
    patchGraph(setDraft, (graph) => ({
      ...graph,
      nodes: [...graph.nodes, { key, kind, contributionId }],
      edges:
        graph.nodes.length === 0
          ? [...graph.edges, { key: `e-start-${key}`, from: 'start', to: key }]
          : graph.edges,
    }));
  }

  return (
    <Flex container="fill" gap={12} className={styles.canvasRow}>
      <Flex vertical container="fixed" gap={8} className={styles.palette}>
        <strong>原语</strong>
        {catalog.workspaces.map((item) => (
          <Button key={item.contributionId} size="small" onClick={() => addFromCatalog('workspace', item.contributionId)}>
            工作台 · {item.contributionId}
          </Button>
        ))}
        {catalog.commands.map((item) => (
          <Button key={item.contributionId} size="small" onClick={() => addFromCatalog('command', item.contributionId)}>
            命令 · {item.contributionId}
          </Button>
        ))}
      </Flex>
      <Flex container="fill" className={styles.canvas}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={persistPositions}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </Flex>
    </Flex>
  );
}
