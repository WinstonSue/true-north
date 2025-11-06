/**
 * API 控制器差异比对引擎
 * 专门处理 Server Controller 到 API Controller 的差异比对
 */

import { DiffEngine } from '../core/diff-engine';
import { IntermediateState, MethodDefinition } from '../core/intermediate-state';
import { DiffResult } from '../core/diff-engine';
import { detectMethodChangeType } from '../core/diff-engine/helpers';
import { findAllControllerPairs } from './helpers';
import { TargetApiAdapter } from './target-adapter';
import { ControllerSyncStatus } from '../core/sync-engine';
import { MethodChange, MethodInfo } from '../../../types';

export class ControllerApiDiffEngine extends DiffEngine {
  targetAdapter: TargetApiAdapter;

  constructor() {
    super();
    this.targetAdapter = new TargetApiAdapter();
  }

  /**
   * 检查所有控制器的同步状态
   */
  async checkAllControllers(): Promise<ControllerSyncStatus[]> {
    const pairs = findAllControllerPairs();
    const results: ControllerSyncStatus[] = [];

    for (const pair of pairs) {
      try {
        const controllerDetails = await this.getControllerDetail(pair);

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
          methodChanges: controllerDetails.methodChanges,
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
          methodChanges: [],
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
   * API 控制器只比较方法，不比较构造函数和导入
   */
  compareIntermediateState(source: IntermediateState, target: IntermediateState): DiffResult {
    const methodChanges = this.generateMethodChanges(source, target);

    return {
      controllerName: source.metadata.className,
      changes: [],
      methodChanges,
      needsSync: methodChanges.length > 0,
    };
  }

  /**
   * 重写方法变更生成 - API 控制器专用
   * 检查方法存在性和参数变化
   */
  protected generateMethodChanges(sourceState: IntermediateState, targetState: IntermediateState): MethodChange[] {
    const changes: any[] = [];

    // 检查缺失的方法（在 Server 中存在但在 API 中不存在）
    for (const [methodName, sourceMethod] of sourceState.methods) {
      const targetMethod = targetState.methods.get(methodName);
      if (!targetMethod) {
        // 方法在目标中不存在
        changes.push({
          methodName,
          changeType: 'method_added',
          sourceMethod: this.convertToMethodInfo(sourceMethod),
          description: 'Method not found in target controller',
        });
      } else {
        // 方法存在，检查是否有变化
        const changeType = detectMethodChangeType(sourceMethod, targetMethod);
        if (changeType !== 'method_no_change') {
          changes.push({
            methodName,
            changeType,
            sourceMethod: this.convertToMethodInfo(sourceMethod),
            targetMethod: this.convertToMethodInfo(targetMethod),
            description: this.generateChangeDetails(sourceMethod, targetMethod, changeType),
          });
        }
      }
    }

    // 检查目标中多余的方法（在 API 中存在但在 Server 中不存在）
    for (const [methodName, targetMethod] of targetState.methods) {
      if (!sourceState.methods.has(methodName)) {
        changes.push({
          methodName,
          changeType: 'method_removed',
          sourceMethod: this.convertToMethodInfo(targetMethod),
          description: 'Method exists in target but not in source',
        });
      }
    }

    return changes;
  }

  /**
   * API 控制器特有的方法信息转换
   */
  protected convertToMethodInfo(method: MethodDefinition): MethodInfo {
    return {
      name: method.name,
      signature: `static async ${method.name}(${method.parameters
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
