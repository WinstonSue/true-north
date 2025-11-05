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
        
        // API 控制器忽略参数名差异
        // if (sourceParam.name !== targetParam.name) {
        //   changes.push(`参数 ${i + 1} 名称从 ${targetParam.name} 改为 ${sourceParam.name}`);
        // }
        
        if (sourceParam.type !== targetParam.type) {
          changes.push(`参数 ${i + 1} 类型从 ${targetParam.type} 改为 ${sourceParam.type}`);
        }
        
        // API 控制器忽略装饰器差异
        // if (sourceParam.decorator !== targetParam.decorator) {
        //   changes.push(`参数 ${sourceParam.name} 装饰器从 ${targetParam.decorator} 改为 ${sourceParam.decorator}`);
        // }
      }
    }

    // API 控制器忽略返回类型差异，因为 API 控制器是生成的代码
    // if (source.returnType !== target.returnType) {
    //   changes.push(`返回类型从 ${target.returnType} 改为 ${source.returnType}`);
    // }

    return changes;
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
