/**
 * API 控制器同步引擎
 * 专门处理 Server Controller 到 API Controller 的同步
 */

import { SyncEngine, DiffEngine, MethodDefinition, MethodInfo, IntermediateState, MethodChangeType } from '../core';
import { ControllerApiDiffEngine } from './diff-engine';
import { ControllerApiCodeGenerator } from './code-generator';
import { CONTROLLER_SOURCE_PATH, CONTROLLER_API_TARGET_PATH } from '../../constants';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export class ControllerApiSyncEngine extends SyncEngine {
  constructor() {
    super();
  }

  /**
   * 创建差异比对引擎
   */
  protected createDiffEngine(): DiffEngine {
    return new ControllerApiDiffEngine();
  }

  /**
   * 创建代码生成器
   */
  protected createCodeGenerator(): ControllerApiCodeGenerator {
    return new ControllerApiCodeGenerator();
  }

  /**
   * API 控制器不需要目标适配器
   */
  protected getTargetAdapter(): null {
    return null;
  }

  /**
   * 查找所有 API 控制器对
   */
  protected findAllControllerPairs(): Array<{ sourcePath: string; targetPath: string; className: string }> {
    const pairs: Array<{ sourcePath: string; targetPath: string; className: string }> = [];

    // 使用全局路径常量

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

        // API 控制器的目标路径结构不同
        const fileName = sourceFile.split('/').pop()?.replace('.controller.ts', '.ts') || '';
        const targetPath = join(CONTROLLER_API_TARGET_PATH, fileName);
        const className = this.extractClassNameFromPath(sourceFile);

        pairs.push({
          sourcePath,
          targetPath,
          className,
        });
      }
    } catch (error) {
      console.error('查找 API 控制器文件时出错:', error);
    }

    return pairs;
  }

  /**
   * 解析 API 目标代码为中间态 - API 控制器专用解析
   * 需要正确解析参数信息以便进行差异比对
   */
  protected parseApiTargetToIntermediateState(code: string, filePath: string): IntermediateState {
    const methods = new Map<string, MethodDefinition>();

    // 更强健的方法解析，支持复杂的参数类型
    const methodRegex = /static\s+async\s+(\w+)\s*\(/g;
    let match;

    while ((match = methodRegex.exec(code)) !== null) {
      const methodName = match[1];
      const startPos = match.index + match[0].length - 1; // 定位到开括号
      
      // 找到匹配的闭括号，处理嵌套的泛型类型
      let braceCount = 1;
      let i = startPos + 1;
      let paramString = '';
      
      while (i < code.length && braceCount > 0) {
        const char = code[i];
        if (char === '(') {
          braceCount++;
        } else if (char === ')') {
          braceCount--;
        }
        
        if (braceCount > 0) {
          paramString += char;
        }
        i++;
      }
      
      // 解析参数
      const parameters: any[] = [];
      if (paramString.trim()) {
        // 智能分割参数，考虑泛型和嵌套类型
        const paramParts = this.smartSplitParameters(paramString);
        for (const param of paramParts) {
          if (param.trim()) {
            // 匹配参数名和类型，支持可选参数和复杂类型
            const paramMatch = param.match(/(\w+)(\??):\s*(.+?)(?:\s*=\s*.*)?$/);
            if (paramMatch) {
              const paramName = paramMatch[1];
              const isOptional = paramMatch[2] === '?';
              const paramType = paramMatch[3].trim();
              
              // 根据参数名推断装饰器类型
              let decorator = 'Body';
              if (paramName === 'id') {
                decorator = 'Param';
              } else if (paramName === 'params' || paramName === 'query') {
                decorator = 'Query';
              } else if (paramName === 'body') {
                decorator = 'Body';
              }
              
              parameters.push({
                name: paramName,
                type: paramType,
                decorator,
                decoratorArgs: [],
                optional: isOptional,
              });
            }
          }
        }
      }
      
      methods.set(methodName, {
        name: methodName,
        verb: 'Get', // 占位符，不用于比对
        path: `/${methodName}`, // 占位符，不用于比对
        parameters,
        returnType: 'any', // 占位符，不用于比对
        bodyText: '',
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

    return {
      metadata: {
        className: this.extractClassNameFromPath(filePath),
        basePath: '',
        filePath,
        sourceType: 'target',
      },
      methods,
      constructor: { parameters: [] },
      imports: [],
    };
  }

  /**
   * 重写变更类型检测 - API 控制器专用
   * 检测参数签名是否发生变化
   */
  protected detectChangeType(sourceMethod: MethodDefinition, targetMethod: MethodDefinition): MethodChangeType {
    // 比较参数数量和类型
    if (sourceMethod.parameters.length !== targetMethod.parameters.length) {
      return 'parameters_changed';
    }
    
    // 比较参数类型（API 控制器忽略参数名和装饰器差异）
    for (let i = 0; i < sourceMethod.parameters.length; i++) {
      const sourceParam = sourceMethod.parameters[i];
      const targetParam = targetMethod.parameters[i];
      
      // API 控制器只比较参数类型，忽略参数名和装饰器差异
      if (sourceParam.type !== targetParam.type) {
        return 'parameters_changed';
      }
    }
    
    // API 控制器忽略返回类型差异，因为 API 控制器是生成的代码
    // if (sourceMethod.returnType !== targetMethod.returnType) {
    //   return 'signature_changed';
    // }
    
    return 'no_change';
  }

  /**
   * 重写方法变更生成 - API 控制器专用
   * 检查方法存在性和参数变化
   */
  protected generateMethodChanges(sourceState: IntermediateState, targetState: IntermediateState): any[] {
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
        const changeType = this.detectChangeType(sourceMethod, targetMethod);
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
   * 智能分割参数字符串，考虑泛型和嵌套类型
   */
  private smartSplitParameters(paramString: string): string[] {
    const params: string[] = [];
    let current = '';
    let braceCount = 0;
    let angleCount = 0;
    
    for (let i = 0; i < paramString.length; i++) {
      const char = paramString[i];
      
      if (char === '(') {
        braceCount++;
      } else if (char === ')') {
        braceCount--;
      } else if (char === '<') {
        angleCount++;
      } else if (char === '>') {
        angleCount--;
      } else if (char === ',' && braceCount === 0 && angleCount === 0) {
        // 只有在没有嵌套的情况下才分割
        if (current.trim()) {
          params.push(current.trim());
        }
        current = '';
        continue;
      }
      
      current += char;
    }
    
    // 添加最后一个参数
    if (current.trim()) {
      params.push(current.trim());
    }
    
    return params;
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

/**
 * 创建 API 控制器同步引擎实例
 */
export function createApiSyncEngine(): ControllerApiSyncEngine {
  return new ControllerApiSyncEngine();
}
