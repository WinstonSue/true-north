/**
 * 差异比对引擎基类
 * 提供通用的差异比对逻辑，子类可以重写特定的比较方法
 */

import { IntermediateState, MethodDefinition } from '../intermediate-state';
import { DiffResult, ChangeRecord } from './types';
import { SourceAdapter, TargetAdapter } from '../adapters';
import { readFileSync } from 'fs';
import { MethodChange, MethodChangeType, MethodDetailsResult } from '../../../../types';

export abstract class DiffEngine {
  sourceAdapter: SourceAdapter;
  targetAdapter!: TargetAdapter;

  constructor() {
    this.sourceAdapter = new SourceAdapter();
  }

  /**
   * 获取控制器的详细信息
   */
  async getControllerDetail(pair: {
    sourcePath: string;
    targetPath: string;
    className: string;
  }): Promise<MethodDetailsResult> {
    try {
      const sourceState = this.getSourceIntermediateState(pair.sourcePath);
      const targetState = this.getTargetIntermediateState(pair.targetPath);
      console.log('============================');

      const diff = this.compareIntermediateState(sourceState, targetState);
      const methodChanges = this.generateMethodChanges(sourceState, targetState);

      return {
        className: pair.className,
        sourcePath: pair.sourcePath,
        targetPath: pair.targetPath,
        needsSync: diff.needsSync,
        methodChanges,
        summary: this.generateSummary(methodChanges, sourceState.methods.size),
      };
    } catch (error) {
      return {
        className: pair.className,
        sourcePath: pair.sourcePath,
        targetPath: pair.targetPath,
        needsSync: false,
        methodChanges: [],
        summary: { totalMethods: 0, changedMethods: 0, addedMethods: 0, removedMethods: 0 },
        error: error instanceof Error ? error.message : String(error),
      };
    }
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
  abstract compareIntermediateState(source: IntermediateState, target: IntermediateState): DiffResult;

  /**
   * 比较构造函数 - 子类可以重写
   */
  protected compareConstructor(source: any, target: any): ChangeRecord | null {
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
  protected compareImports(source: any[], target: any[]): ChangeRecord | null {
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

  /**
   * 生成详细统计摘要 - 通用实现
   */
  generateDetailedSummary(methodChanges: MethodChange[]) {
    const signatureChanges = methodChanges.filter((c) => c.changeType === 'method_signature_changed').length;
    const parameterChanges = methodChanges.filter((c) => c.changeType === 'method_parameters_changed').length;
    const decoratorChanges = methodChanges.filter((c) => c.changeType === 'method_decorators_changed').length;

    return {
      totalMethods: methodChanges.length,
      changedMethods: methodChanges.filter((c) => c.changeType !== 'method_added' && c.changeType !== 'method_removed')
        .length,
      addedMethods: methodChanges.filter((c) => c.changeType === 'method_added').length,
      signatureChanges,
      parameterChanges,
      decoratorChanges,
    };
  }

  /**
   * 生成统计摘要 - 通用实现
   */
  generateSummary(
    methodChanges: MethodChange[],
    totalMethods: number
  ): { totalMethods: number; changedMethods: number; addedMethods: number; removedMethods: number } {
    const addedMethods = methodChanges.filter((c) => c.changeType === 'method_added').length;
    const removedMethods = methodChanges.filter((c) => c.changeType === 'method_removed').length;
    const changedMethods = methodChanges.filter(
      (c) => c.changeType !== 'method_added' && c.changeType !== 'method_removed'
    ).length;

    return {
      totalMethods,
      changedMethods,
      addedMethods,
      removedMethods,
    };
  }

  /**
   * 生成变更详情 - 通用实现
   */
  generateChangeDetails(
    sourceMethod: MethodDefinition,
    targetMethod: MethodDefinition,
    changeType: MethodChangeType
  ): string {
    switch (changeType) {
      case 'method_decorators_changed':
        return `Decorators changed: ${targetMethod.verb}('${targetMethod.path}') -> ${sourceMethod.verb}('${sourceMethod.path}')`;
      case 'method_parameters_changed':
        return `Parameters changed: ${targetMethod.parameters.length} -> ${sourceMethod.parameters.length} parameters`;
      case 'method_signature_changed':
        return `Return type changed: ${targetMethod.returnType} -> ${sourceMethod.returnType}`;
      default:
        return 'Method changed';
    }
  }

  getSourceIntermediateState(sourcePath: string): IntermediateState {
    const sourceCode = readFileSync(sourcePath, 'utf-8');
    return this.sourceAdapter.parseToIntermediateState(sourceCode, sourcePath);
  }

  getTargetIntermediateState(targetPath: string): IntermediateState {
    const targetCode = readFileSync(targetPath, 'utf-8');
    return this.targetAdapter.parseToIntermediateState(targetCode, targetPath);
  }
}
