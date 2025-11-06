// 新架构的类型定义
export type MethodChangeType =
  | 'signature_changed'
  | 'parameters_changed'
  | 'decorators_changed'
  | 'body_changed'
  | 'no_change'
  | 'method_added'
  | 'method_removed';

export interface MethodInfo {
  name: string;
  signature: string;
  returnType: string;
  parameters: Array<{
    name: string;
    type: string;
    decorator?: string;
    decoratorArgs?: string;
  }>;
  decorators: Array<{
    name: string;
    args: string;
  }>;
  body: string;
}

export interface MethodChange {
  methodName: string;
  changeType: MethodChangeType;
  sourceMethod: MethodInfo;
  targetMethod?: MethodInfo;
  details: string;
}

export interface MethodDetailsResult {
  className: string;
  sourcePath: string;
  targetPath: string;
  needsSync: boolean;
  methodChanges: MethodChange[];
  summary: {
    totalMethods: number;
    changedMethods: number;
    addedMethods: number;
    removedMethods: number;
  };
  error?: string;
}
