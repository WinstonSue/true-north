import { DiffResult } from '../../../../types';

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

/**
 * 同步操作
 */
export interface SyncAction {
  /** 操作类型 */
  type: 'add_method' | 'remove_method' | 'update_method' | 'update_constructor' | 'update_imports';
  /** 目标方法名 */
  methodName?: string;
  /** 操作数据 */
  data: any;
  /** 操作描述 */
  description: string;
}
