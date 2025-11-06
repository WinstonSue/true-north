import { MethodChange } from '../../../../types';
/**
 * 差异比对结果
 */
export interface DiffResult {
  /** 控制器名称 */
  controllerName: string;

  /** 变更类型 */
  changes: ChangeRecord[];

  /** 方法变更 */
  methodChanges: MethodChange[];

  /** 是否需要同步 */
  needsSync: boolean;
}

export interface ChangeRecord {
  /** 变更类型 */
  changeType: 'constructor_changed' | 'imports_changed';

  /** 旧值 */
  oldValue?: any;
  /** 新值 */
  newValue?: any;
  /** 变更描述 */
  description: string;
}

export interface ChangeDetails {}
