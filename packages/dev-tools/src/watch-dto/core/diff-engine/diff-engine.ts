/**
 * DTO/VO 差异比对引擎基类
 */

import { IntermediateState, FieldDefinition } from '../intermediate-state/types';
import { BaseParser } from '../intermediate-state/base-parser';

export interface FieldChange {
  fieldName: string;
  changeType: 'field_added' | 'field_removed' | 'field_modified' | 'type_changed';
  sourceField?: FieldInfo;
  targetField?: FieldInfo;
  description: string;
}

export interface FieldInfo {
  name: string;
  type: string;
  optional: boolean;
}

export interface DiffResult {
  className: string;
  fieldChanges: FieldChange[];
  needsSync: boolean;
}

/**
 * 差异比对引擎基类
 */
export abstract class DiffEngine {
  protected sourceAdapter: BaseParser;
  protected diffResult?: DiffResult;

  constructor(sourcePath: string) {
    // 子类需要实现具体的 parser
    this.sourceAdapter = this.createSourceParser(sourcePath);
  }

  /**
   * 创建源解析器 - 子类实现
   */
  protected abstract createSourceParser(sourcePath: string): BaseParser;

  /**
   * 比较中间态
   */
  abstract compareIntermediateState(): DiffResult;

  /**
   * 生成字段变更列表
   */
  protected generateFieldChanges(sourceState: IntermediateState, targetState: IntermediateState): FieldChange[] {
    const changes: FieldChange[] = [];

    // 检查源中存在但目标中不存在的字段
    for (const [fieldName, sourceField] of sourceState.fields) {
      const targetField = targetState.fields.get(fieldName);
      if (!targetField) {
        changes.push({
          fieldName,
          changeType: 'field_added',
          sourceField: this.convertToFieldInfo(sourceField),
          description: `Field ${fieldName} not found in target`,
        });
      } else if (sourceField.type !== targetField.type) {
        changes.push({
          fieldName,
          changeType: 'type_changed',
          sourceField: this.convertToFieldInfo(sourceField),
          targetField: this.convertToFieldInfo(targetField),
          description: `Field ${fieldName} type changed from ${targetField.type} to ${sourceField.type}`,
        });
      }
    }

    // 检查目标中存在但源中不存在的字段
    for (const [fieldName, targetField] of targetState.fields) {
      if (!sourceState.fields.has(fieldName)) {
        changes.push({
          fieldName,
          changeType: 'field_removed',
          targetField: this.convertToFieldInfo(targetField),
          description: `Field ${fieldName} exists in target but not in source`,
        });
      }
    }

    return changes;
  }

  /**
   * 转换字段定义为字段信息
   */
  protected convertToFieldInfo(field: FieldDefinition): FieldInfo {
    return {
      name: field.name,
      type: field.type,
      optional: field.optional,
    };
  }
}
