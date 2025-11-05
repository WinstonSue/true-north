/**
 * API 控制器同步引擎
 * 专门处理 Server Controller 到 API Controller 的同步
 */

import { SyncEngine, DiffEngine, MethodDefinition, MethodInfo, IntermediateState, MethodChangeType } from '../core';
import { ControllerApiDiffEngine } from './diff-engine';
import { ControllerApiCodeGenerator } from './code-generator';
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

    // 定义路径常量
    const CONTROLLER_SOURCE_PATH = '/Users/xuwenhua/code/application-mine/life-toolkit/packages/business/server/src';
    const CONTROLLER_API_TARGET_PATH =
      '/Users/xuwenhua/code/application-mine/life-toolkit/packages/business/api/controller';

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
   * API 控制器已经是生成的代码，我们只需要检查方法是否存在即可
   */
  protected parseApiTargetToIntermediateState(code: string, filePath: string): IntermediateState {
    const methods = new Map<string, MethodDefinition>();

    // 解析 API 控制器中的静态方法，只关注方法名
    const methodRegex = /static\s+async\s+(\w+)\s*\([^)]*\)\s*\{/g;
    let match;

    while ((match = methodRegex.exec(code)) !== null) {
      const methodName = match[1];
      
      // API 控制器的方法定义简化处理，只用于存在性检查
      // 不需要详细解析参数和装饰器，因为 API 控制器是生成的代码
      methods.set(methodName, {
        name: methodName,
        verb: 'Get', // 占位符，不用于比对
        path: `/${methodName}`, // 占位符，不用于比对
        parameters: [], // 占位符，不用于比对
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
   * API 控制器是生成的代码，只要方法存在就认为是同步的
   */
  protected detectChangeType(_sourceMethod: MethodDefinition, _targetMethod: MethodDefinition): MethodChangeType {
    // API 控制器不需要检测变更，只要方法存在就认为是同步的
    return 'no_change';
  }

  /**
   * 重写方法变更生成 - API 控制器专用
   * API 控制器只检查方法存在性，不检查详细变更
   */
  protected generateMethodChanges(sourceState: IntermediateState, targetState: IntermediateState): any[] {
    console.log('🔧 API 控制器使用重写的 generateMethodChanges 方法');
    console.log(`   源方法数: ${sourceState.methods.size}`);
    console.log(`   目标方法数: ${targetState.methods.size}`);
    
    const changes: any[] = [];

    // 只检查缺失的方法（在 Server 中存在但在 API 中不存在）
    for (const [methodName, sourceMethod] of sourceState.methods) {
      const targetMethod = targetState.methods.get(methodName);
      if (!targetMethod) {
        console.log(`   ❌ 缺失方法: ${methodName}`);
        // 方法在目标中不存在
        changes.push({
          methodName,
          changeType: 'method_added',
          sourceMethod: this.convertToMethodInfo(sourceMethod),
          details: 'Method not found in target controller',
        });
      } else {
        console.log(`   ✅ 方法存在: ${methodName}`);
      }
      // 如果方法存在，就认为是同步的，不添加到变更列表中
    }

    // 检查目标中多余的方法（在 API 中存在但在 Server 中不存在）
    for (const [methodName, targetMethod] of targetState.methods) {
      if (!sourceState.methods.has(methodName)) {
        console.log(`   🗑️ 多余方法: ${methodName}`);
        changes.push({
          methodName,
          changeType: 'method_removed',
          sourceMethod: this.convertToMethodInfo(targetMethod),
          details: 'Method exists in target but not in source',
        });
      }
    }

    console.log(`   📊 总变更数: ${changes.length}`);
    return changes;
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
