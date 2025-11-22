/**
 * 差异比对工具函数
 */

import { FieldChange } from './diff-engine';

/**
 * 生成差异结果摘要
 */
export function generateDiffSummary(fieldChanges: FieldChange[]): {
  totalFields: number;
  addedFields: number;
  removedFields: number;
  modifiedFields: number;
  typeChanges: number;
} {
  return {
    totalFields: fieldChanges.length,
    addedFields: fieldChanges.filter((c) => c.changeType === 'field_added').length,
    removedFields: fieldChanges.filter((c) => c.changeType === 'field_removed').length,
    modifiedFields: fieldChanges.filter((c) => c.changeType === 'field_modified').length,
    typeChanges: fieldChanges.filter((c) => c.changeType === 'type_changed').length,
  };
}

/**
 * 检测字段变更类型
 */
export function detectFieldChangeType(
  sourceType: string,
  targetType: string
): 'type_changed' | 'field_modified' | 'no_change' {
  if (sourceType !== targetType) {
    return 'type_changed';
  }
  return 'no_change';
}
