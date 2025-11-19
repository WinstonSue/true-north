/**
 * Filter DTO/VO Diff Engine
 */

import { DiffEngine, DiffResult } from '../core/diff-engine';
import { BaseParser } from '../core/intermediate-state';
import { TargetFilterParser } from './target-parser';

export class FilterDiffEngine extends DiffEngine {
  targetAdapter?: TargetFilterParser;

  constructor(sourcePath: string, targetPath?: string) {
    super(sourcePath);
    if (targetPath) {
      this.targetAdapter = new TargetFilterParser(targetPath);
    }
  }

  protected createSourceParser(sourcePath: string): BaseParser {
    return new TargetFilterParser(sourcePath);
  }

  compareIntermediateState(): DiffResult {
    const sourceState = this.sourceAdapter.intermediateState;
    
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
