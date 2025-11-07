/**
 * Desktop 控制器同步引擎
 * 专门处理 Server Controller 到 Desktop Controller 的同步
 */

import { ControllerProxyDiffEngine } from './diff-engine';
import { TargetProxyComposer } from './target-composer';
import { readFileSync, writeFileSync } from 'fs';
import { generateSyncActions, SyncOptions, SyncResult } from '../core/sync-engine';
import { ErrorHandler } from '../helpers';
import { findAllControllerPairs } from './helpers';
import { ControllerSyncStatus } from '../../../types';

export class ControllerProxySyncEngine {
  /**
   * 同步单个控制器 - 通用实现
   */
  async syncController(sourcePath: string, targetPath: string, options: SyncOptions = {}): Promise<SyncResult> {
    try {
      const diffEngine = new ControllerProxyDiffEngine(sourcePath, targetPath);

      // 1. 读取源码
      const targetCode = readFileSync(targetPath, 'utf-8');

      // 2. 比对差异
      const diff = diffEngine.compareIntermediateState();

      // 3. 生成同步操作
      const actions = generateSyncActions(diff, diffEngine.sourceAdapter.intermediateState);

      // 5. 执行同步（如果不是干运行模式）
      if (!options.dryRun && diff.needsSync) {
        const targetComposer = new TargetProxyComposer(
          diffEngine.sourceAdapter.intermediateState,
          diffEngine.targetAdapter.intermediateState
        );
        const newCode = targetComposer.applySyncActions(targetCode, actions);
        writeFileSync(targetPath, newCode, 'utf-8');
      }

      return {
        success: true,
        controllerName: diffEngine.sourceAdapter.intermediateState.metadata.className,
        diff,
        actions,
        details: options.verbose ? `处理了 ${actions.length} 个操作` : undefined,
      };
    } catch (error) {
      const errorResult = ErrorHandler.handleSyncError(error, 'syncController');
      return {
        success: false,
        controllerName: 'Unknown',
        diff: { className: 'Unknown', changes: [], methodChanges: [], needsSync: false },
        actions: [],
        error: errorResult.error,
      };
    }
  }

  /**
   * 检查所有控制器的同步状态
   */
  async checkAllDiffResults(): Promise<ControllerSyncStatus[]> {
    const pairs = findAllControllerPairs();
    const results: ControllerSyncStatus[] = [];

    for (const pair of pairs) {
      const diffEngine = new ControllerProxyDiffEngine(pair.sourcePath, pair.targetPath);
      diffEngine.compareIntermediateState();

      results.push(diffEngine.getSummary(pair));
    }

    return results;
  }
}

/**
 * 创建 Desktop 控制器同步引擎实例
 */
export function createProxySyncEngine(): ControllerProxySyncEngine {
  return new ControllerProxySyncEngine();
}
