/**
 * API 控制器差异比对引擎
 * 专门处理 Server Controller 到 API Controller 的差异比对
 */

import { DiffEngine } from '../core';
import { IntermediateState, DiffResult, ChangeRecord, MethodDefinition } from '../core/intermediate-state';

export class ControllerApiDiffEngine extends DiffEngine {
  /**
   * API 控制器只比较方法，不比较构造函数和导入
   */
  compare(source: IntermediateState, target: IntermediateState): DiffResult {
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
   * API 控制器是生成的代码，只需要确保方法存在即可，不比较详细信息
   */
  protected compareMethod(_source: MethodDefinition, _target: MethodDefinition): string[] {
    // API 控制器的方法比较简化：
    // 如果方法存在，就认为是同步的，因为 API 控制器是自动生成的代码
    // 不需要比较参数、装饰器、返回类型等详细信息
    return [];
  }

  /**
   * 重写方法比较，使用 API 特有的描述
   */
  protected compareMethods(sourceMethods: Map<string, MethodDefinition>, targetMethods: Map<string, MethodDefinition>): ChangeRecord[] {
    const changes: ChangeRecord[] = [];

    // 检查新增的方法（在 Server 中存在但在 API 中不存在）
    for (const [methodName, sourceMethod] of sourceMethods) {
      if (!targetMethods.has(methodName)) {
        changes.push({
          type: 'method_added',
          methodName,
          details: {
            newValue: sourceMethod,
            description: `API 方法 ${methodName} 需要添加`,
            severity: 'medium',
          },
        });
      }
    }

    // 检查删除的方法（在 API 中存在但在 Server 中不存在）
    for (const [methodName, targetMethod] of targetMethods) {
      if (!sourceMethods.has(methodName)) {
        changes.push({
          type: 'method_removed',
          methodName,
          details: {
            oldValue: targetMethod,
            description: `API 方法 ${methodName} 需要移除`,
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
              description: `API 方法 ${methodName} 已修改: ${methodChanges.join(', ')}`,
              severity: 'high',
            },
          });
        }
      }
    }

    return changes;
  }
}
