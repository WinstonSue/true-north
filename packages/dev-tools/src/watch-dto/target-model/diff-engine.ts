/**
 * Model DTO/VO Diff Engine
 * 专门处理 Model DTO 到 VO 的差异比对
 */

import { DiffEngine, DiffResult } from '../core/diff-engine';
import { BaseParser } from '../core/intermediate-state';
import { TargetModelParser } from './target-parser';

export class ModelDiffEngine extends DiffEngine {
  targetAdapter?: TargetModelParser;

  constructor(sourcePath: string, targetPath?: string) {
    super(sourcePath);
    if (targetPath) {
      this.targetAdapter = new TargetModelParser(targetPath);
    }
  }

  /**
   * 创建源解析器
   */
  protected createSourceParser(sourcePath: string): BaseParser {
    return new TargetModelParser(sourcePath);
  }

  /**
   * 比较中间态
   */
  compareIntermediateState(): DiffResult {
    const sourceState = this.sourceAdapter.intermediateState;

    // 如果没有目标文件，所有字段都是新增的
    if (!this.targetAdapter) {
      const fieldChanges = Array.from(sourceState.fields.values()).map((field) => ({
        fieldName: field.name,
        changeType: 'field_added' as const,
        sourceField: this.convertToFieldInfo(field),
        description: `New field ${field.name}`,
      }));

      return {
        className: sourceState.metadata.className,
        fieldChanges,
        needsSync: true,
      };
    }

    const targetState = this.targetAdapter.intermediateState;
    const fieldChanges = this.generateFieldChanges(sourceState, targetState);

    return {
      className: sourceState.metadata.className,
      fieldChanges,
      needsSync: fieldChanges.length > 0,
    };
  }
}
