/**
 * Web Service 同步引擎
 * 专门处理 Server Controller 到 Web Service 的同步
 */

import { SyncEngine, DiffEngine, MethodInfo, MethodDefinition } from '../core';
import { ControllerWebServiceDiffEngine } from './diff-engine';
import { ControllerWebServiceCodeGenerator } from './code-generator';
import { CONTROLLER_SOURCE_PATH, CONTROLLER_WEB_SERVICE_TARGET_PATH } from '../../constants';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export class ControllerWebServiceSyncEngine extends SyncEngine {
  constructor() {
    super();
  }

  /**
   * 创建差异比对引擎
   */
  protected createDiffEngine(): DiffEngine {
    return new ControllerWebServiceDiffEngine();
  }

  /**
   * 创建代码生成器
   */
  protected createCodeGenerator(): ControllerWebServiceCodeGenerator {
    return new ControllerWebServiceCodeGenerator();
  }

  /**
   * Web Service 不需要目标适配器
   */
  protected getTargetAdapter(): null {
    return null;
  }

  /**
   * 解析 Web Service 目标代码为中间态
   */
  protected parseApiTargetToIntermediateState(code: string, filePath: string): any {
    const methods = new Map<string, MethodDefinition>();

    // 更精确的方法解析正则，包含参数
    const methodRegex = /static\s+async\s+(\w+)\s*\(([^)]*)\)\s*\{/g;
    let match;

    while ((match = methodRegex.exec(code)) !== null) {
      const methodName = match[1];
      const paramString = match[2].trim();
      
      // 解析参数
      const parameters: any[] = [];
      if (paramString) {
        // 简单的参数解析，支持基本的类型和默认值
        const paramParts = paramString.split(',').map(p => p.trim());
        for (const param of paramParts) {
          if (param) {
            // 匹配参数名和类型，如 "id: string" 或 "options: MethodOptions"
            const paramMatch = param.match(/(\w+)(?:\??):\s*([^=]+)(?:\s*=\s*.*)?/);
            if (paramMatch) {
              const paramName = paramMatch[1];
              const paramType = paramMatch[2].trim();
              parameters.push({
                name: paramName,
                type: paramType,
                decorator: '',
                decoratorArgs: [],
                optional: param.includes('?'),
              });
            }
          }
        }
      }
      
      // 提取方法体
      const methodStart = match.index;
      const methodBodyStart = code.indexOf('{', methodStart);
      let braceCount = 1;
      let i = methodBodyStart + 1;
      
      while (i < code.length && braceCount > 0) {
        if (code[i] === '{') braceCount++;
        else if (code[i] === '}') braceCount--;
        i++;
      }
      
      const methodBody = code.slice(methodBodyStart + 1, i - 1);

      methods.set(methodName, {
        name: methodName,
        verb: 'Get', // 默认值，实际不重要
        path: `/${methodName}`,
        parameters,
        returnType: 'any',
        bodyText: methodBody.trim(),
        bodyHash: '',
        decoratorOptions: {},
        sourceLocation: {
          startLine: 0,
          endLine: 0,
          startColumn: 0,
          endColumn: 0,
        },
      });
    }

    // 正确提取类名
    const className = this.extractServiceClassNameFromFilePath(filePath);

    return {
      metadata: {
        className,
        basePath: '',
        filePath,
        sourceType: 'target' as const,
      },
      methods,
      constructor: { parameters: [] },
      imports: [],
    };
  }

  /**
   * 从文件路径提取 Service 类名
   */
  private extractServiceClassNameFromFilePath(filePath: string): string {
    const fileName = filePath.split('/').pop() || '';
    const baseName = fileName.replace('.service.ts', '');
    return baseName.charAt(0).toUpperCase() + baseName.slice(1) + 'Service';
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

/**
 * 创建 Web Service 同步引擎实例
 */
export function createWebServiceSyncEngine(): ControllerWebServiceSyncEngine {
  return new ControllerWebServiceSyncEngine();
}
