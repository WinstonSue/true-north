/**
 * API 控制器差异比对引擎
 * 专门处理 Server Controller 到 API Controller 的差异比对
 */

import { DiffEngine } from '../core/diff-engine';
import { IntermediateState, DiffResult, ChangeRecord, MethodDefinition } from '../core/intermediate-state';
import { MethodInfo, MethodChange, detectChangeType } from '../core/diff-engine';
import { findAllControllerPairs } from './helpers';
import { TargetApiAdapter } from './target-adapter';
import { ControllerSyncStatus } from '../core/sync-engine';

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
   * API 控制器只比较方法，不比较构造函数和导入
   */
  compareIntermediateState(source: IntermediateState, target: IntermediateState): DiffResult {
    const changes: ChangeRecord[] = [];

    // 比较方法 - API 控制器主要关注方法的存在性
    const methodChanges = this.compareMethods(source.methods, target.methods);
    changes.push(...methodChanges);

    return {
      controllerName: source.metadata.className,
      changes,
      needsSync: changes.length > 0,
    };
  }

  /**
   * API 控制器特有的方法比较逻辑
   * 需要比较参数签名，确保 API 方法与 Server 方法参数一致
   */
  protected compareMethod(source: MethodDefinition, target: MethodDefinition): string[] {
    const changes: string[] = [];

    // 比较方法名
    if (source.name !== target.name) {
      changes.push(`方法名从 ${target.name} 改为 ${source.name}`);
    }

    // 比较参数数量和类型
    if (source.parameters.length !== target.parameters.length) {
      changes.push(`参数数量从 ${target.parameters.length} 改为 ${source.parameters.length}`);
    } else {
      // 比较每个参数
      for (let i = 0; i < source.parameters.length; i++) {
        const sourceParam = source.parameters[i];
        const targetParam = target.parameters[i];

        if (sourceParam.name !== targetParam.name) {
          changes.push(`参数 ${i + 1} 名称从 ${targetParam.name} 改为 ${sourceParam.name}`);
        }

        if (sourceParam.type !== targetParam.type) {
          changes.push(`参数 ${i + 1} 类型从 ${targetParam.type} 改为 ${sourceParam.type}`);
        }
      }
    }

    return changes;
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
          details: 'Method not found in target controller',
        });
      } else {
        // 方法存在，检查是否有变化
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
    }

    // 检查目标中多余的方法（在 API 中存在但在 Server 中不存在）
    for (const [methodName, targetMethod] of targetState.methods) {
      if (!sourceState.methods.has(methodName)) {
        changes.push({
          methodName,
          changeType: 'method_removed',
          sourceMethod: this.convertToMethodInfo(targetMethod),
          details: 'Method exists in target but not in source',
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
