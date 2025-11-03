import { DiffResult, SyncAction } from './intermediate-state';

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

export interface ControllerSyncStatus {
  className: string;
  sourcePath: string;
  targetPath: string;
  needsSync: boolean;
  changeCount: number;
  lastChecked: string;
  error?: string;
  // 前端兼容字段
  filePath: string;
  changes: MethodChange[];
  summary: {
    totalMethods: number;
    changedMethods: number;
    addedMethods: number;
    signatureChanges: number;
    parameterChanges: number;
    decoratorChanges: number;
  };
}

export interface SyncOptions {
  /** 是否为干运行模式 */
  dryRun?: boolean;
  /** 是否显示详细信息 */
  verbose?: boolean;
  /** 是否强制同步 */
  force?: boolean;
}

export interface SyncResult {
  /** 是否成功 */
  success: boolean;
  /** 控制器名称 */
  controllerName: string;
  /** 差异结果 */
  diff: DiffResult;
  /** 同步操作 */
  actions: SyncAction[];
  /** 错误信息 */
  error?: string;
  /** 详细信息 */
  details?: string;
}
