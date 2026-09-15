import type { AiEntitySource, WorkbenchViewOpenInput, WorkbenchViewTarget } from '@true-north/plugin-sdk';

export type AiEntityRecord = {
  type: string;
  id: string;
  label: string;
};

export type { AiEntitySource, WorkbenchViewTarget };

export function pluginViewInputFromEntity(
  sources: Pick<AiEntitySource, 'type' | 'workbenchViewId'>[],
  type: string,
  id: string,
): WorkbenchViewOpenInput | null {
  const source = sources.find((item) => item.type === type);
  if (!source?.workbenchViewId) return null;
  return {
    viewId: source.workbenchViewId,
    target: { type, id },
  };
}
