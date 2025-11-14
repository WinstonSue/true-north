/**
 * Desktop 控制器差异比对引擎
 * 专门处理 Server Controller 到 Desktop Controller 的差异比对
 */

import { MethodDefinition } from '../core/intermediate-state/types';
import { DiffEngine, generateDiffResultSummary } from '../core/diff-engine';
import { IntermediateState } from '../core/intermediate-state/types';
import { TargetProxyParser } from './target-parser';
import { MethodChange, MethodInfo, ControllerSyncStatus, DiffResult } from '../../../types';

export class ControllerProxyDiffEngine extends DiffEngine {
  targetAdapter: TargetProxyParser;

  constructor(sourcePath: string, targetPath: string) {
    super(sourcePath);
    this.targetAdapter = new TargetProxyParser(targetPath);
  }

  getSummary(pair: { className: string; sourcePath: string; targetPath: string }): ControllerSyncStatus {
    try {
      // 生成详细的统计信息
      const summary = generateDiffResultSummary(this.diffResult!.methodChanges);

      return {
        className: pair.className,
        sourcePath: pair.sourcePath,
        targetPath: pair.targetPath,
        needsSync: this.diffResult!.methodChanges.length + this.diffResult!.changes.length > 0,
        changeCount: this.diffResult!.methodChanges.length + this.diffResult!.changes.length,
        changes: this.diffResult!.changes,
        methodChanges: this.diffResult!.methodChanges,
        summary,
        lastChecked: new Date().toISOString(),
        error: undefined,
      };
    } catch (error) {
      return {
        className: pair.className,
        sourcePath: pair.sourcePath,
        targetPath: pair.targetPath,
        needsSync: false,
        changeCount: 0,
        changes: [],
        methodChanges: [],
        summary: {
          totalMethods: 0,
          changedMethods: 0,
          addedMethods: 0,
          removedMethods: 0,
          returnTypeChanges: 0,
          parameterChanges: 0,
          decoratorChanges: 0,
        },
        lastChecked: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * 比较两个中间态，生成差异报告
   */
  compareIntermediateState(): DiffResult {
    const sourceState = this.sourceAdapter.intermediateState;
    const targetState = this.targetAdapter.intermediateState;

    // Proxy 控制器不需要同步构造函数和 import，只同步方法
    // 因为 Proxy 控制器有自己固定的结构

    // 比较方法
    const methodChanges = this.generateMethodChanges(sourceState, targetState);

    return {
      className: sourceState.metadata.className,
      changes: [], // 不同步构造函数和 import
      methodChanges,
      needsSync: methodChanges.length > 0,
    };
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
          description: 'Method not found in target controller',
        });
        continue;
      }

      // 对于 Proxy 控制器，检查方法体是否是正确的转发代码
      const expectedProxyBody = `return this.controller.${methodName}(${targetMethod.parameters.map(p => p.name).join(', ')});`;
      const targetBodyText = targetMethod.bodyText?.trim() || '';
      
      // 只有当目标方法体不是期望的转发代码时才需要更新
      if (targetBodyText !== expectedProxyBody) {
        changes.push({
          methodName,
          changeType: 'method_body_changed',
          sourceMethod: this.convertToMethodInfo(sourceMethod),
          targetMethod: this.convertToMethodInfo(targetMethod),
          description: `Proxy method body needs to be updated. Expected: "${expectedProxyBody}", Got: "${targetBodyText}"`,
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
          description: 'Method exists in target but not in source',
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
