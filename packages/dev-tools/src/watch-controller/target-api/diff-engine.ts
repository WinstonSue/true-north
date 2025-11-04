/**
 * API 控制器差异比对引擎
 * 专门处理 Server Controller 到 API Controller 的差异比对
 */

import {
  IntermediateState,
  DiffResult,
  ChangeRecord,
  SyncAction,
  MethodDefinition,
  ParameterDefinition,
} from '../core/intermediate-state';

export class ControllerApiDiffEngine {
  /**
   * 比较 Server Controller 和 API Controller 的中间态，生成差异报告
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
   * 根据差异结果生成同步操作
   */
  generateSyncActions(diffResult: DiffResult, source: IntermediateState): SyncAction[] {
    const actions: SyncAction[] = [];

    for (const change of diffResult.changes) {
      switch (change.type) {
        case 'method_added':
          if (change.methodName) {
            const method = source.methods.get(change.methodName);
            if (method) {
              actions.push({
                type: 'add_method',
                methodName: change.methodName,
                data: method,
                description: `添加 API 方法 ${change.methodName}`,
              });
            }
          }
          break;

        case 'method_removed':
          actions.push({
            type: 'remove_method',
            methodName: change.methodName,
            data: null,
            description: `移除 API 方法 ${change.methodName}`,
          });
          break;

        case 'method_modified':
          if (change.methodName) {
            const method = source.methods.get(change.methodName);
            if (method) {
              actions.push({
                type: 'update_method',
                methodName: change.methodName,
                data: method,
                description: `更新 API 方法 ${change.methodName}`,
              });
            }
          }
          break;
      }
    }

    return actions;
  }

  /**
   * 比较方法集合
   * API 控制器的方法比较相对简单，主要关注方法的存在性
   */
  private compareMethods(
    sourceMethods: Map<string, MethodDefinition>,
    targetMethods: Map<string, MethodDefinition>
  ): ChangeRecord[] {
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

    // 检查修改的方法（API 控制器的方法实现相对标准化，变更较少）
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
              description: `API 方法 ${methodName} 需要更新: ${methodChanges.join(', ')}`,
              severity: 'low', // API 方法的变更通常影响较小
            },
          });
        }
      }
    }

    return changes;
  }

  /**
   * 比较单个方法
   * API 控制器的方法比较主要关注 HTTP 动词和路径
   */
  private compareMethod(source: MethodDefinition, target: MethodDefinition): string[] {
    const changes: string[] = [];

    // 比较 HTTP 动词
    if (source.verb !== target.verb) {
      changes.push(`HTTP动词从 ${target.verb} 改为 ${source.verb}`);
    }

    // 比较路径
    if (source.path !== target.path) {
      changes.push(`路径从 ${target.path} 改为 ${source.path}`);
    }

    // 比较参数（API 控制器的参数结构相对固定）
    const paramChanges = this.compareParameters(source.parameters, target.parameters);
    if (paramChanges.length > 0) {
      changes.push(`参数变更: ${paramChanges.join(', ')}`);
    }

    // 比较返回类型
    if (source.returnType !== target.returnType) {
      changes.push(`返回类型从 ${target.returnType} 改为 ${source.returnType}`);
    }

    // API 控制器的方法体是标准化的，通常不需要比较
    // 但可以检查是否符合预期的 API 调用模式
    if (!this.isCorrectApiCall(source, target)) {
      changes.push('方法体需要更新为标准 API 调用');
    }

    return changes;
  }

  /**
   * 检查 API 方法是否符合标准的 API 调用模式
   */
  private isCorrectApiCall(source: MethodDefinition, target: MethodDefinition): boolean {
    // API 控制器的方法体应该包含 request 调用
    const expectedPattern = /return\s+request\s*\(/;
    
    // 如果目标方法体包含 request 调用，认为是正确的
    if (target.bodyText && expectedPattern.test(target.bodyText)) {
      // 进一步检查 HTTP 方法是否匹配
      const httpMethod = source.verb.toLowerCase() === 'delete' ? 'remove' : source.verb.toLowerCase();
      const methodPattern = new RegExp(`method:\\s*["']${httpMethod}["']`);
      
      return methodPattern.test(target.bodyText);
    }

    return false;
  }

  /**
   * 比较参数列表
   * API 控制器的参数比较相对简单
   */
  private compareParameters(sourceParams: ParameterDefinition[], targetParams: ParameterDefinition[]): string[] {
    const changes: string[] = [];

    // 比较参数数量
    if (sourceParams.length !== targetParams.length) {
      changes.push(`参数数量从 ${targetParams.length} 改为 ${sourceParams.length}`);
    }

    // 比较每个参数的基本信息
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
   * 比较单个参数
   */
  private compareParameter(source: ParameterDefinition, target: ParameterDefinition): string[] {
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

    return changes;
  }

  /**
   * 深度比较两个对象
   */
  private deepEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;

    if (typeof a === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);

      if (keysA.length !== keysB.length) return false;

      for (const key of keysA) {
        if (!keysB.includes(key)) return false;
        if (!this.deepEqual(a[key], b[key])) return false;
      }

      return true;
    }

    return false;
  }

  /**
   * 比较两个数组
   */
  private arrayEqual(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, index) => this.deepEqual(val, b[index]));
  }
}
