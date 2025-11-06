/**
 * Desktop 控制器同步引擎
 * 专门处理 Server Controller 到 Desktop Controller 的同步
 */

import { ControllerProxyDiffEngine } from './diff-engine';
import { ControllerProxyCodeGenerator } from './code-generator';
import { readFileSync, writeFileSync } from 'fs';
import { SyncOptions, SyncResult } from '../core';
import { generateSyncActions } from '../core/sync-engine';
import { ErrorHandler, Logger } from '../core/utils';

export class ControllerProxySyncEngine {
  private codeGenerator: ControllerProxyCodeGenerator;
  diffEngine: ControllerProxyDiffEngine;
  private logger = Logger.createContextLogger('ProxySyncEngine');

  constructor() {
    this.diffEngine = new ControllerProxyDiffEngine();
    this.codeGenerator = new ControllerProxyCodeGenerator();
  }

  /**
   * 同步单个控制器 - 通用实现
   */
  async syncController(sourcePath: string, targetPath: string, options: SyncOptions = {}): Promise<SyncResult> {
    try {
      // 1. 读取源码
      const targetCode = readFileSync(targetPath, 'utf-8');

      if (options.verbose) {
        this.logger.info('读取源码文件', { server: sourcePath, target: targetPath });
      }

      // 2. 解析为中间态
      const sourceState = this.diffEngine.getSourceIntermediateState(sourcePath);
      const targetState = this.diffEngine.getTargetIntermediateState(targetPath);

      if (options.verbose) {
        this.logger.info('解析完成', {
          sourceMethods: sourceState.methods.size,
          targetMethods: targetState.methods.size
        });
      }

      // 3. 比对差异
      const diff = this.diffEngine.compare(sourceState, targetState);

      if (options.verbose) {
        this.logger.info('差异比对完成', {
          changeCount: diff.changes.length,
          needsSync: diff.needsSync
        });
      }

      // 4. 生成同步操作
      const actions = generateSyncActions(diff, sourceState);

      // 5. 执行同步（如果不是干运行模式）
      if (!options.dryRun && diff.needsSync) {
        const newCode = this.codeGenerator.applySyncActions(targetCode, actions, targetState, sourceState);
        writeFileSync(targetPath, newCode, 'utf-8');

        if (options.verbose) {
          this.logger.info('同步完成', { targetPath });
        }
      }

      return {
        success: true,
        controllerName: sourceState.metadata.className,
        diff,
        actions,
        details: options.verbose ? `处理了 ${actions.length} 个操作` : undefined,
      };
    } catch (error) {
      const errorResult = ErrorHandler.handleSyncError(error, 'syncController');
      this.logger.error('同步失败', errorResult.error);
      return {
        success: false,
        controllerName: 'Unknown',
        diff: { controllerName: 'Unknown', changes: [], needsSync: false },
        actions: [],
        error: errorResult.error,
      };
    }
  }
}

/**
 * 创建 Desktop 控制器同步引擎实例
 */
export function createProxySyncEngine(): ControllerProxySyncEngine {
  return new ControllerProxySyncEngine();
}
