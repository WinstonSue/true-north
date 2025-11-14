/**
 * Web Service 差异比对引擎
 * 专门处理 Server Controller 到 Web Service 的差异比对
 */

import { MethodDefinition } from '../core/intermediate-state/types';
import { DiffEngine, generateDiffResultSummary } from '../core/diff-engine';
import { TargetWebServiceParser } from './target-parser';
import { MethodInfo, ControllerSyncStatus } from '../../../types';

export class ControllerWebServiceDiffEngine extends DiffEngine {
  targetAdapter: TargetWebServiceParser;

  constructor(sourcePath: string, targetPath: string) {
    super(sourcePath);
    this.targetAdapter = new TargetWebServiceParser(targetPath);
  }

  /**
   * 重写比较方法，只比较方法，不比较构造函数和导入
   * 使用 Web Service 专用的方法比较逻辑
   */
  compareIntermediateState() {
    const sourceState = this.sourceAdapter.intermediateState;
    const targetState = this.targetAdapter.intermediateState;

    const result = {
      className: sourceState.metadata?.className || 'Unknown',
      needsSync: false,
      changes: [] as any[],
      methodChanges: [] as any[],
    };

    // 只比较方法，使用 Web Service 专用逻辑
    const methodChanges = this.generateMethodChanges(sourceState, targetState);
    result.changes = methodChanges;
    result.needsSync = methodChanges.length > 0;

    this.diffResult = result;
    return result;
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
   * 重写方法变更生成 - Web Service 专用
   * 使用简化的比较逻辑，不比较装饰器
   */
  protected generateMethodChanges(sourceState: any, targetState: any): any[] {
    const changes: any[] = [];

    // 检查源码中的每个方法
    for (const [methodName, sourceMethod] of sourceState.methods) {
      const targetMethod = targetState.methods.get(methodName);
      if (!targetMethod) {
        // 方法在目标中不存在
        changes.push({
          methodName,
          changeType: 'method_added',
          sourceMethod: this.convertToMethodInfo(sourceMethod),
          description: 'Method not found in target Web Service',
        });
      } else {
        // 方法存在，只检查方法名是否匹配（极简检查）
        if (sourceMethod.name !== targetMethod.name) {
          changes.push({
            methodName,
            changeType: 'method_modified',
            sourceMethod: this.convertToMethodInfo(sourceMethod),
            targetMethod: this.convertToMethodInfo(targetMethod),
            description: `Method name changed from ${targetMethod.name} to ${sourceMethod.name}`,
          });
        }
        // 跳过所有其他检查（参数、装饰器、返回类型等）
      }
    }

    // 检查目标中多余的方法
    for (const [methodName, targetMethod] of targetState.methods) {
      if (!sourceState.methods.has(methodName)) {
        changes.push({
          methodName,
          changeType: 'method_removed',
          targetMethod: this.convertToMethodInfo(targetMethod),
          description: 'Method exists in target but not in source',
        });
      }
    }

    return changes;
  }

  /**
   * Web Service 特有的方法信息转换
   */
  protected convertToMethodInfo(method: MethodDefinition): MethodInfo {
    return {
      name: method.name,
      signature: `static async ${method.name}(${method.parameters
        .map((p) => {
          if (p.decorator === 'Param') {
            return `${p.name}: string`;
          } else if (p.decorator === 'Body') {
            const voType = this.convertDtoTypeToVoType(p.type);
            return `${p.name}: ${voType}`;
          } else if (p.decorator === 'Query') {
            const voType = this.convertDtoTypeToVoType(p.type);
            return `${p.name}${p.optional ? '?' : ''}: ${voType}`;
          }
          return `${p.name}: ${p.type}`;
        })
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

  /**
   * 转换 DTO 类型为 VO 类型
   */
  private convertDtoTypeToVoType(dtoType: string): string {
    // 移除泛型参数
    const baseType = dtoType.replace(/<.*>/, '');

    // 转换常见的 DTO 类型
    if (baseType.includes('FilterDto')) {
      return baseType.replace('FilterDto', 'FilterVo');
    } else if (baseType.includes('PageFilterDto')) {
      return baseType.replace('PageFilterDto', 'PageFilterVo');
    } else if (baseType.includes('CreateDto')) {
      return baseType.replace('CreateDto', 'CreateVo');
    } else if (baseType.includes('UpdateDto')) {
      return baseType.replace('UpdateDto', 'UpdateVo');
    } else if (baseType.includes('Dto')) {
      return baseType.replace('Dto', 'Vo');
    }

    return dtoType;
  }
}
