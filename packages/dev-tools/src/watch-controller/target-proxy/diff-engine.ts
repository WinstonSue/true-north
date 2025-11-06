/**
 * Desktop 控制器差异比对引擎
 * 专门处理 Server Controller 到 Desktop Controller 的差异比对
 */

import { MethodDefinition } from '../core/intermediate-state';
import { DiffEngine, MethodChange, MethodInfo, detectChangeType, DiffResult, ChangeRecord } from '../core/diff-engine';
import { findAllControllerPairs } from './helpers';
import { IntermediateState } from '../core/intermediate-state';
import { ControllerSyncStatus } from '../core/sync-engine';
import { TargetProxyAdapter } from './target-adapter';
import { isEqual } from 'lodash-es';

export class ControllerProxyDiffEngine extends DiffEngine {
  targetAdapter: TargetProxyAdapter;
  constructor() {
    super();
    this.targetAdapter = new TargetProxyAdapter();
  }

  /**
   * 检查所有控制器的同步状态
   */
  async checkAllControllers(): Promise<ControllerSyncStatus[]> {
    const pairs = findAllControllerPairs();
    const results: ControllerSyncStatus[] = [];

    for (const pair of pairs) {
      try {
        const methodDetails = await this.getMethodDetails([pair]);
        const controllerDetails = methodDetails[0];

        // 生成详细的统计信息
        const summary = this.generateDetailedSummary(controllerDetails.methodChanges);

        results.push({
          className: pair.className,
          sourcePath: pair.sourcePath,
          targetPath: pair.targetPath,
          filePath: pair.targetPath, // 前端兼容字段
          needsSync: controllerDetails.methodChanges.length > 0,
          changeCount: controllerDetails.methodChanges.length,
          changes: controllerDetails.methodChanges,
          summary,
          lastChecked: new Date().toISOString(),
          error: undefined,
        });
      } catch (error) {
        results.push({
          className: pair.className,
          sourcePath: pair.sourcePath,
          targetPath: pair.targetPath,
          filePath: pair.targetPath,
          needsSync: false,
          changeCount: 0,
          changes: [],
          summary: {
            totalMethods: 0,
            changedMethods: 0,
            addedMethods: 0,
            signatureChanges: 0,
            parameterChanges: 0,
            decoratorChanges: 0,
          },
          lastChecked: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return results;
  }

  /**
   * 比较两个中间态，生成差异报告
   */
  compareIntermediateState(source: IntermediateState, target: IntermediateState): DiffResult {
    const changes: ChangeRecord[] = [];

    // 比较方法
    const methodChanges = this.compareMethods(source.methods, target.methods);
    changes.push(...methodChanges);

    // 比较构造函数（子类可以选择是否比较）
    const constructorChanges = this.compareConstructor(source.constructor, target.constructor);
    if (constructorChanges) {
      changes.push(constructorChanges);
    }

    // 比较导入（子类可以选择是否比较）
    const importChanges = this.compareImports(source.imports, target.imports);
    if (importChanges) {
      changes.push(importChanges);
    }

    return {
      controllerName: source.metadata.className,
      changes,
      needsSync: changes.length > 0,
    };
  }

  /**
   * Desktop 控制器特有的方法比较逻辑
   */
  protected compareMethod(source: MethodDefinition, target: MethodDefinition): string[] {
    const changes: string[] = [];

    // 比较 HTTP 动词
    if (source.verb !== target.verb) {
      changes.push(`HTTP动词从 ${target.verb} 改为 ${source.verb}`);
    }

    // 比较路径
    if (source.path !== target.path) {
      changes.push(`路径从 ${target.path} 改为 ${source.path}`);
    }

    // 比较参数
    const paramChanges = this.compareParameters(source.parameters, target.parameters);
    if (paramChanges.length > 0) {
      changes.push(`参数变更: ${paramChanges.join(', ')}`);
    }

    // 比较返回类型
    if (source.returnType !== target.returnType) {
      changes.push(`返回类型从 ${target.returnType} 改为 ${source.returnType}`);
    }

    // 智能比较方法体：检查 Target 是否已经是正确的代理调用
    if (!this.isCorrectProxyCall(source, target)) {
      changes.push('方法体需要更新为代理调用');
    }

    // 比较装饰器选项
    if (!isEqual(source.decoratorOptions, target.decoratorOptions)) {
      changes.push('装饰器选项已修改');
    }

    return changes;
  }

  /**
   * 检查 Target 方法是否已经是正确的代理调用
   */
  private isCorrectProxyCall(source: MethodDefinition, target: MethodDefinition): boolean {
    // 检查 Target 方法体是否包含正确的代理调用模式
    const expectedCall = `return this.controller.${source.name}(`;

    // 如果 Target 方法体包含期望的代理调用，认为是正确的
    if (target.bodyText.includes(expectedCall)) {
      // 进一步检查参数是否匹配
      const sourceParamNames = source.parameters.map((p) => p.name);
      const expectedParams = sourceParamNames.join(', ');
      const fullExpectedCall = `return this.controller.${source.name}(${expectedParams});`;

      return target.bodyText.includes(fullExpectedCall);
    }

    return false;
  }

  generateMethodChanges(sourceState: IntermediateState, targetState: IntermediateState): MethodChange[] {
    const changes: MethodChange[] = [];

    // 检查源码中的每个方法
    for (const [methodName, sourceMethod] of sourceState.methods) {
      const targetMethod = targetState.methods.get(methodName);

      if (!targetMethod) {
        // 方法在目标中不存在
        changes.push({
          methodName,
          changeType: 'method_added',
          sourceMethod: this.convertToMethodInfo(sourceMethod),
          details: 'Method not found in target controller',
        });
        continue;
      }

      // 比较方法差异
      const changeType = detectChangeType(sourceMethod, targetMethod);
      if (changeType !== 'no_change') {
        changes.push({
          methodName,
          changeType,
          sourceMethod: this.convertToMethodInfo(sourceMethod),
          targetMethod: this.convertToMethodInfo(targetMethod),
          details: this.generateChangeDetails(sourceMethod, targetMethod, changeType),
        });
      }
    }

    // 检查目标中多余的方法
    for (const [methodName, targetMethod] of targetState.methods) {
      if (!sourceState.methods.has(methodName)) {
        changes.push({
          methodName,
          changeType: 'method_removed',
          sourceMethod: this.convertToMethodInfo(targetMethod), // 使用目标方法作为源
          details: 'Method exists in target but not in source',
        });
      }
    }

    return changes;
  }
  /**
   * Desktop 控制器特有的方法信息转换
   */
  protected convertToMethodInfo(method: MethodDefinition): MethodInfo {
    return {
      name: method.name,
      signature: `async ${method.name}(${method.parameters
        .map(
          (p) =>
            `${p.decorator ? `@${p.decorator}${p.decoratorArgs?.length ? `(${p.decoratorArgs.join(', ')})` : '()'} ` : ''}${p.name}${p.optional ? '?' : ''}: ${p.type}`
        )
        .join(', ')})`,
      returnType: method.returnType,
      parameters: method.parameters.map((p) => ({
        name: p.name,
        type: p.type,
        decorator: p.decorator,
        decoratorArgs: p.decoratorArgs?.join(', '),
      })),
      decorators: [
        {
          name: method.verb,
          args: method.path,
        },
      ],
      body: method.bodyText,
    };
  }
}
