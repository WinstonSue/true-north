import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';
import {
  emptyWorkflowGraph,
  type WorkflowDefinitionGraph,
} from '@true-north/plugin-contract';

export type WorkflowCatalog = {
  events: Array<{ contributionId: string; pluginId: string; localId: string }>;
  commands: Array<{ contributionId: string; pluginId: string; localId: string; compensate?: string }>;
  workspaces: Array<{ contributionId: string; pluginId: string; localId: string }>;
  templates: Array<{ contributionId: string; nameKey: string; descriptionKey?: string; graph: WorkflowDefinitionGraph }>;
};

export type DefinitionDraft = {
  id?: string;
  title: string;
  description?: string;
  graph: WorkflowDefinitionGraph;
  status?: string;
  currentVersion?: number;
};

export const emptyDraft = (): DefinitionDraft => ({
  title: '未命名流程',
  graph: emptyWorkflowGraph(),
});

const DefinitionDraftContext = createContext<{
  draft: DefinitionDraft;
  setDraft: Dispatch<SetStateAction<DefinitionDraft>>;
  catalog: WorkflowCatalog;
} | null>(null);

export const DefinitionDraftProvider = DefinitionDraftContext.Provider;

export function useDefinitionDraft() {
  const value = useContext(DefinitionDraftContext);
  if (!value) throw new Error('DefinitionDraftProvider missing');
  return value;
}

export function patchGraph(
  setDraft: Dispatch<SetStateAction<DefinitionDraft>>,
  patch: (graph: WorkflowDefinitionGraph) => WorkflowDefinitionGraph,
) {
  setDraft((current) => ({ ...current, graph: patch(current.graph) }));
}
