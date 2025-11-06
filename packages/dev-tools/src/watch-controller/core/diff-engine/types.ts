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

/**
 * 差异比对结果
 */
export interface DiffResult {
  /** 控制器名称 */
  controllerName: string;
  /** 变更类型 */
  changes: ChangeRecord[];
  /** 是否需要同步 */
  needsSync: boolean;
}

export interface ChangeRecord {
  /** 变更类型 */
  type: 'method_added' | 'method_removed' | 'method_modified' | 'constructor_changed' | 'imports_changed';
  /** 方法名（如果适用） */
  methodName?: string;
  /** 变更详情 */
  details: ChangeDetails;
}

export interface ChangeDetails {
  /** 旧值 */
  oldValue?: any;
  /** 新值 */
  newValue?: any;
  /** 变更描述 */
  description: string;
  /** 变更级别 */
  severity: 'low' | 'medium' | 'high';
}
