/**
 * Web Service 差异比对引擎
 * 专门处理 Server Controller 到 Web Service 的差异比对
 */

import { MethodDefinition } from '../core/intermediate-state';
import { CONTROLLER_SOURCE_PATH, CONTROLLER_WEB_SERVICE_TARGET_PATH } from '../../constants';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { DiffEngine } from '../core/diff-engine';
import { ControllerSyncStatus } from '../core/sync-engine';
import { TargetWebServiceAdapter } from './target-adapter';
import { MethodInfo } from '../../../types';

export class ControllerWebServiceDiffEngine extends DiffEngine {
  constructor() {
    super();
    this.targetAdapter = new TargetWebServiceAdapter();
  }

  /**
   * 检查所有控制器的同步状态
   */
  async checkAllControllers(): Promise<ControllerSyncStatus[]> {
    const pairs = this.findAllControllerPairs();
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
   * 重写比较方法，只比较方法，不比较构造函数和导入
   * 使用 Web Service 专用的方法比较逻辑
   */
  compareIntermediateState(sourceState: any, targetState: any) {
    const result = {
      controllerName: sourceState.metadata?.className || 'Unknown',
      needsSync: false,
      changes: [] as any[],
      methodChanges: [] as any[],
    };

    // 只比较方法，使用 Web Service 专用逻辑
    const methodChanges = this.generateMethodChanges(sourceState, targetState);
    result.changes = methodChanges;
    result.needsSync = methodChanges.length > 0;

    return result;
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
   * 查找所有控制器对
   */
  protected findAllControllerPairs(): Array<{ sourcePath: string; targetPath: string; className: string }> {
    const pairs: Array<{ sourcePath: string; targetPath: string; className: string }> = [];

    try {
      // 递归查找所有 .controller.ts 文件
      const findControllerFiles = (dir: string, basePath: string): string[] => {
        const files: string[] = [];
        const items = readdirSync(dir);

        for (const item of items) {
          const fullPath = join(dir, item);
          const stat = statSync(fullPath);

          if (stat.isDirectory()) {
            files.push(...findControllerFiles(fullPath, basePath));
          } else if (item.endsWith('.controller.ts')) {
            const relativePath = fullPath.replace(basePath, '').replace(/^\//, '');
            files.push(relativePath);
          }
        }

        return files;
      };

      const sourceFiles = findControllerFiles(CONTROLLER_SOURCE_PATH, CONTROLLER_SOURCE_PATH);

      for (const sourceFile of sourceFiles) {
        const sourcePath = join(CONTROLLER_SOURCE_PATH, sourceFile);

        // 转换路径：growth/todo/todo.controller.ts -> growth/todo.service.ts
        const pathParts = sourceFile.split('/');
        if (pathParts.length >= 2) {
          const module = pathParts[0]; // growth
          const fileName = pathParts[pathParts.length - 1];
          const serviceName = fileName.replace('.controller.ts', '.service.ts');
          const targetPath = join(CONTROLLER_WEB_SERVICE_TARGET_PATH, module, serviceName);

          const className = this.extractServiceClassNameFromPath(sourceFile);

          pairs.push({
            sourcePath,
            targetPath,
            className,
          });
        }
      }
    } catch (error) {
      console.error('查找控制器文件时出错:', error);
    }

    return pairs;
  }

  /**
   * 从文件路径提取 Service 类名
   */
  private extractServiceClassNameFromPath(relativePath: string): string {
    const fileName = relativePath.split('/').pop() || '';
    const baseName = fileName.replace('.controller.ts', '');
    return (
      baseName
        .split(/[-_]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('') + 'Service'
    );
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
