/**
 * 差异比对引擎基类
 * 提供通用的差异比对逻辑，子类可以重写特定的比较方法
 */

import { IntermediateState, MethodDefinition, ParameterDefinition } from '../intermediate-state';
import { MethodChange, MethodChangeType, MethodDetailsResult, DiffResult, ChangeRecord } from './types';
import { SourceAdapter } from '../adapters';
import { TargetAdapter } from '../adapters';
import { readFileSync } from 'fs';
import { isEqual } from 'lodash-es';

export abstract class DiffEngine {
  sourceAdapter: SourceAdapter;
  targetAdapter!: TargetAdapter;

  constructor() {
    this.sourceAdapter = new SourceAdapter();
  }

  async getMethodDetails(
    pairs: Array<{ sourcePath: string; targetPath: string; className: string }>
  ): Promise<MethodDetailsResult[]> {
    const results: MethodDetailsResult[] = [];

    for (const pair of pairs) {
      try {
        const sourceState = this.getSourceIntermediateState(pair.sourcePath);
        const targetState = this.getTargetIntermediateState(pair.targetPath);

        const diff = this.compareIntermediateState(sourceState, targetState);
        const methodChanges = this.generateMethodChanges(sourceState, targetState);

        results.push({
          className: pair.className,
          sourcePath: pair.sourcePath,
          targetPath: pair.targetPath,
          needsSync: diff.needsSync,
          methodChanges,
          summary: this.generateSummary(methodChanges, sourceState.methods.size),
        });
      } catch (error) {
        results.push({
          className: pair.className,
          sourcePath: pair.sourcePath,
          targetPath: pair.targetPath,
          needsSync: false,
          methodChanges: [],
          summary: { totalMethods: 0, changedMethods: 0, addedMethods: 0, removedMethods: 0 },
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return results;
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
   * 比较单个方法 - 抽象方法，子类必须实现
   */
  protected abstract compareMethod(source: MethodDefinition, target: MethodDefinition): string[];

  /**
   * 比较方法集合 - 子类可以重写
   */
  protected compareMethods(
    sourceMethods: Map<string, MethodDefinition>,
    targetMethods: Map<string, MethodDefinition>
  ): ChangeRecord[] {
    const changes: ChangeRecord[] = [];

    // 检查新增的方法
    for (const [methodName, sourceMethod] of sourceMethods) {
      if (!targetMethods.has(methodName)) {
        changes.push({
          type: 'method_added',
          methodName,
          details: {
            newValue: sourceMethod,
            description: `方法 ${methodName} 在目标中不存在`,
            severity: 'medium',
          },
        });
      }
    }

    // 检查删除的方法
    for (const [methodName, targetMethod] of targetMethods) {
      if (!sourceMethods.has(methodName)) {
        changes.push({
          type: 'method_removed',
          methodName,
          details: {
            oldValue: targetMethod,
            description: `方法 ${methodName} 在源中不存在`,
            severity: 'medium',
          },
        });
      }
    }

    // 检查修改的方法
    for (const [methodName, sourceMethod] of sourceMethods) {
      const targetMethod = targetMethods.get(methodName);
      if (targetMethod) {
        const methodChanges = this.compareMethod(sourceMethod, targetMethod);
        if (methodChanges.length > 0) {
          changes.push({
            type: 'method_modified',
            methodName,
            details: {
              oldValue: targetMethod,
              newValue: sourceMethod,
              description: `方法 ${methodName} 已修改: ${methodChanges.join(', ')}`,
              severity: 'high',
            },
          });
        }
      }
    }

    return changes;
  }
  /**
   * 比较参数列表 - 通用实现
   */
  protected compareParameters(sourceParams: ParameterDefinition[], targetParams: ParameterDefinition[]): string[] {
    const changes: string[] = [];

    // 比较参数数量
    if (sourceParams.length !== targetParams.length) {
      changes.push(`参数数量从 ${targetParams.length} 改为 ${sourceParams.length}`);
    }

    // 比较每个参数
    const maxLength = Math.max(sourceParams.length, targetParams.length);
    for (let i = 0; i < maxLength; i++) {
      const sourceParam = sourceParams[i];
      const targetParam = targetParams[i];

      if (!sourceParam && targetParam) {
        changes.push(`删除参数 ${targetParam.name}`);
      } else if (sourceParam && !targetParam) {
        changes.push(`添加参数 ${sourceParam.name}`);
      } else if (sourceParam && targetParam) {
        const paramChanges = this.compareParameter(sourceParam, targetParam);
        if (paramChanges.length > 0) {
          changes.push(`参数 ${sourceParam.name}: ${paramChanges.join(', ')}`);
        }
      }
    }

    return changes;
  }

  /**
   * 比较单个参数 - 通用实现
   */
  protected compareParameter(source: ParameterDefinition, target: ParameterDefinition): string[] {
    const changes: string[] = [];

    if (source.name !== target.name) {
      changes.push(`名称从 ${target.name} 改为 ${source.name}`);
    }

    if (source.type !== target.type) {
      changes.push(`类型从 ${target.type} 改为 ${source.type}`);
    }

    if (source.decorator !== target.decorator) {
      changes.push(`装饰器从 @${target.decorator} 改为 @${source.decorator}`);
    }

    if (source.optional !== target.optional) {
      changes.push(`可选性从 ${target.optional} 改为 ${source.optional}`);
    }

    if (!isEqual(source.decoratorArgs || [], target.decoratorArgs || [])) {
      changes.push('装饰器参数已修改');
    }

    return changes;
  }

  /**
   * 比较构造函数 - 子类可以重写
   */
  protected compareConstructor(source: any, target: any): ChangeRecord | null {
    // 简化比较，主要检查参数数量和类型
    const sourceParamCount = source.parameters?.length || 0;
    const targetParamCount = target.parameters?.length || 0;

    if (sourceParamCount !== targetParamCount) {
      return {
        type: 'constructor_changed',
        details: {
          oldValue: target,
          newValue: source,
          description: `构造函数参数数量从 ${targetParamCount} 改为 ${sourceParamCount}`,
          severity: 'high',
        },
      };
    }

    // 检查服务实例化代码
    if (source.serviceInstantiation !== target.serviceInstantiation) {
      return {
        type: 'constructor_changed',
        details: {
          oldValue: target,
          newValue: source,
          description: '构造函数服务实例化代码已修改',
          severity: 'medium',
        },
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
        type: 'imports_changed',
        details: {
          oldValue: target,
          newValue: source,
          description: `导入声明数量从 ${target.length} 改为 ${source.length}`,
          severity: 'low',
        },
      };
    }

    // TODO: 更详细的导入比较
    return null;
  }

  /**
   * 生成详细统计摘要 - 通用实现
   */
  generateDetailedSummary(methodChanges: MethodChange[]) {
    const signatureChanges = methodChanges.filter((c) => c.changeType === 'signature_changed').length;
    const parameterChanges = methodChanges.filter((c) => c.changeType === 'parameters_changed').length;
    const decoratorChanges = methodChanges.filter((c) => c.changeType === 'decorators_changed').length;

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
      case 'decorators_changed':
        return `Decorators changed: ${targetMethod.verb}('${targetMethod.path}') -> ${sourceMethod.verb}('${sourceMethod.path}')`;
      case 'parameters_changed':
        return `Parameters changed: ${targetMethod.parameters.length} -> ${sourceMethod.parameters.length} parameters`;
      case 'signature_changed':
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
