/**
 * 差异比对引擎基类
 * 提供通用的差异比对逻辑，子类可以重写特定的比较方法
 */

import { IntermediateState } from '../intermediate-state/types';
import { SourceIntermediateParser } from '../intermediate-state';
import { readFileSync } from 'fs';
import { MethodChange, DiffResult, CommonChange } from '../../../../types';

export abstract class DiffEngine {
  sourceAdapter: SourceIntermediateParser;
  diffResult?: DiffResult;

  constructor(filePath: string) {
    this.sourceAdapter = new SourceIntermediateParser(filePath);
  }

  /**
   * 生成方法变更 - 抽象方法，子类必须实现
   */
  protected abstract generateMethodChanges(
    sourceState: IntermediateState,
    targetState: IntermediateState
  ): MethodChange[];

  /**
   * 比较两个中间态，生成差异报告，子类必须实现
   */
  abstract compareIntermediateState(): DiffResult;

  /**
   * 比较构造函数 - 子类可以重写
   */
  protected compareConstructor(source: any, target: any): CommonChange | null {
    // 简化比较，主要检查参数数量和类型
    const sourceParamCount = source.parameters?.length || 0;
    const targetParamCount = target.parameters?.length || 0;

    if (sourceParamCount !== targetParamCount) {
      return {
        changeType: 'constructor_changed',
        oldValue: target,
        newValue: source,
        description: `构造函数参数数量从 ${targetParamCount} 改为 ${sourceParamCount}`,
      };
    }

    // 检查服务实例化代码
    if (source.serviceInstantiation !== target.serviceInstantiation) {
      return {
        changeType: 'constructor_changed',
        oldValue: target,
        newValue: source,
        description: '构造函数服务实例化代码已修改',
      };
    }

    return null;
  }

  /**
   * 比较导入声明 - 子类可以重写
   */
  protected compareImports(source: any[], target: any[]): CommonChange | null {
    // 简化比较，检查导入数量
    if (source.length !== target.length) {
      return {
        changeType: 'imports_changed',
        oldValue: target,
        newValue: source,
        description: `导入声明数量从 ${target.length} 改为 ${source.length}`,
      };
    }

    // TODO: 更详细的导入比较
    return null;
  }

  getSourceIntermediateState(sourcePath: string): IntermediateState {
    const sourceCode = readFileSync(sourcePath, 'utf-8');
    return this.sourceAdapter.parseToIntermediateState(sourceCode, sourcePath);
  }
}
