/**
 * Desktop 控制器同步引擎
 * 专门处理 Server Controller 到 Desktop Controller 的同步
 */

import { SyncEngine, DiffEngine, TargetAdapter, MethodInfo, MethodDefinition } from '../core';
import { ControllerProxyDiffEngine } from './diff-engine';
import { ControllerProxyCodeGenerator } from './code-generator';
import { CONTROLLER_SOURCE_PATH, CONTROLLER_PROXY_TARGET_PATH } from '../../constants';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export class ControllerProxySyncEngine extends SyncEngine {
  private targetAdapter: TargetAdapter;

  constructor() {
    super();
    this.targetAdapter = new TargetAdapter();
  }

  /**
   * 创建差异比对引擎
   */
  protected createDiffEngine(): DiffEngine {
    return new ControllerProxyDiffEngine();
  }

  /**
   * 创建代码生成器
   */
  protected createCodeGenerator(): ControllerProxyCodeGenerator {
    return new ControllerProxyCodeGenerator();
  }

  /**
   * 获取目标适配器
   */
  protected getTargetAdapter(): TargetAdapter {
    return this.targetAdapter;
  }

  /**
   * 查找所有控制器对
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
        const targetPath = join(CONTROLLER_PROXY_TARGET_PATH, sourceFile);
        const className = this.extractClassNameFromPath(sourceFile);

        pairs.push({
          sourcePath,
          targetPath,
          className,
        });
      }
    } catch (error) {
      console.error('查找控制器文件时出错:', error);
    }

    return pairs;
  }

  /**
   * Desktop 控制器特有的方法信息转换
   */
  protected convertToMethodInfo(method: MethodDefinition): MethodInfo {
    return {
      name: method.name,
      signature: `async ${method.name}(${method.parameters
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
 * 创建 Desktop 控制器同步引擎实例
 */
export function createProxySyncEngine(): ControllerProxySyncEngine {
  return new ControllerProxySyncEngine();
}
