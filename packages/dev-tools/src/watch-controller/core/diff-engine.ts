/**
 * 差异比对引擎基类
 * 提供通用的差异比对逻辑，子类可以重写特定的比较方法
 */

import {
  IntermediateState,
  DiffResult,
  ChangeRecord,
  SyncAction,
  MethodDefinition,
  ParameterDefinition,
} from './intermediate-state';

export abstract class DiffEngine {
  /**
   * 比较两个中间态，生成差异报告
   */
  compare(source: IntermediateState, target: IntermediateState): DiffResult {
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
                description: `添加方法 ${change.methodName}`,
              });
            }
          }
          break;

        case 'method_removed':
          actions.push({
            type: 'remove_method',
            methodName: change.methodName,
            data: null,
            description: `移除方法 ${change.methodName}`,
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
                description: `更新方法 ${change.methodName}`,
              });
            }
          }
          break;

        case 'constructor_changed':
          actions.push({
            type: 'update_constructor',
            data: source.constructor,
            description: '更新构造函数',
          });
          break;

        case 'imports_changed':
          actions.push({
            type: 'update_imports',
            data: source.imports,
            description: '更新导入声明',
          });
          break;
      }
    }

    return actions;
  }

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
   * 比较单个方法 - 抽象方法，子类必须实现
   */
  protected abstract compareMethod(source: MethodDefinition, target: MethodDefinition): string[];

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

    if (!this.arrayEqual(source.decoratorArgs || [], target.decoratorArgs || [])) {
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
   * 深度比较两个对象 - 工具方法
   */
  protected deepEqual(a: any, b: any): boolean {
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
   * 比较两个数组 - 工具方法
   */
  protected arrayEqual(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, index) => this.deepEqual(val, b[index]));
  }
}
