/**
 * Web Service 差异比对引擎
 * 专门处理 Server Controller 到 Web Service 的差异比对
 */

import { DiffEngine } from '../core';
import { MethodDefinition } from '../core/intermediate-state';

export class ControllerWebServiceDiffEngine extends DiffEngine {
  /**
   * Web Service 特有的方法比较逻辑
   */
  protected compareMethod(source: MethodDefinition, target: MethodDefinition): string[] {
    const changes: string[] = [];

    // 比较方法名
    if (source.name !== target.name) {
      changes.push(`方法名从 ${target.name} 改为 ${source.name}`);
    }

    // 比较参数
    const paramChanges = this.compareParameters(source.parameters, target.parameters);
    if (paramChanges.length > 0) {
      changes.push(`参数变更: ${paramChanges.join(', ')}`);
    }

    // 比较返回类型（转换为 VO 类型后比较）
    const sourceReturnType = this.convertReturnTypeToVo(source.returnType);
    const targetReturnType = this.convertReturnTypeToVo(target.returnType);
    if (sourceReturnType !== targetReturnType) {
      changes.push(`返回类型从 ${targetReturnType} 改为 ${sourceReturnType}`);
    }

    // 检查方法体是否包含正确的 Controller 调用
    if (!this.isCorrectControllerCall(source, target)) {
      changes.push('方法体需要更新为正确的 Controller 调用');
    }

    // 检查错误处理
    if (!this.hasCorrectErrorHandling(target)) {
      changes.push('缺少正确的错误处理逻辑');
    }

    return changes;
  }

  /**
   * 转换返回类型为 VO 类型
   */
  private convertReturnTypeToVo(returnType: string): string {
    // 移除 Promise 包装
    const baseType = returnType.replace(/Promise<(.*)>/, '$1');
    
    // 如果已经是 VO 类型，直接返回
    if (baseType.includes('VO.') || baseType.includes('Vo')) {
      return baseType;
    }
    
    // 转换基本类型
    if (baseType === 'boolean' || baseType === 'string' || baseType === 'number') {
      return baseType;
    }
    
    return baseType;
  }

  /**
   * 检查 Target 方法是否已经是正确的 Controller 调用
   */
  private isCorrectControllerCall(source: MethodDefinition, target: MethodDefinition): boolean {
    // 检查方法体是否包含 Controller 调用
    const controllerCallPattern = /Controller\.\w+\(/;
    
    if (!controllerCallPattern.test(target.bodyText)) {
      return false;
    }

    // 检查是否包含正确的方法名调用
    const expectedCall = `Controller.${source.name}(`;
    if (!target.bodyText.includes(expectedCall)) {
      return false;
    }

    return true;
  }

  /**
   * 检查是否有正确的错误处理
   */
  private hasCorrectErrorHandling(target: MethodDefinition): boolean {
    // 检查是否包含 try-catch 结构
    const hasTryCatch = target.bodyText.includes('try {') && target.bodyText.includes('} catch');
    
    // 检查是否包含 Message.error 调用
    const hasErrorMessage = target.bodyText.includes('Message.error(error)');
    
    return hasTryCatch && hasErrorMessage;
  }

  /**
   * 重写比较方法，只比较方法，不比较构造函数和导入
   */
  compare(sourceState: any, targetState: any) {
    const result = super.compare(sourceState, targetState);
    
    // Web Service 不需要比较构造函数和导入
    result.changes = result.changes.filter(change => 
      change.type !== 'constructor_changed' && change.type !== 'imports_changed'
    );
    
    // 重新计算是否需要同步
    result.needsSync = result.changes.length > 0;
    
    return result;
  }

  /**
   * 重写方法比较，使用 Web Service 特有的错误描述
   */
  protected compareMethods(sourceMethods: Map<string, MethodDefinition>, targetMethods: Map<string, MethodDefinition>) {
    const changes: any[] = [];

    // 检查源码中的每个方法
    for (const [methodName, sourceMethod] of sourceMethods) {
      const targetMethod = targetMethods.get(methodName);

      if (!targetMethod) {
        changes.push({
          type: 'method_added' as const,
          methodName,
          details: {
            description: `Web Service 方法 ${methodName} 需要添加`,
            severity: 'high' as const,
            newValue: sourceMethod,
          },
        });
        continue;
      }

      const methodChanges = this.compareMethod(sourceMethod, targetMethod);
      if (methodChanges.length > 0) {
        changes.push({
          type: 'method_modified' as const,
          methodName,
          details: {
            description: `Web Service 方法 ${methodName} 需要更新: ${methodChanges.join(', ')}`,
            severity: 'medium' as const,
            oldValue: targetMethod,
            newValue: sourceMethod,
          },
        });
      }
    }

    // 检查目标中多余的方法
    for (const [methodName, targetMethod] of targetMethods) {
      if (!sourceMethods.has(methodName)) {
        changes.push({
          type: 'method_removed' as const,
          methodName,
          details: {
            description: `Web Service 方法 ${methodName} 应该移除`,
            severity: 'low' as const,
            oldValue: targetMethod,
          },
        });
      }
    }

    return changes;
  }
}
