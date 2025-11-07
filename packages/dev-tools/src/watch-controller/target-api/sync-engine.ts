/**
 * API 控制器同步引擎
 * 专门处理 Server Controller 到 API Controller 的同步
 */

import { SyncOptions, SyncResult, generateSyncActions } from '../core/sync-engine';
import { ControllerApiDiffEngine } from './diff-engine';
import { TargetApiComposer } from './target-composer';
import { writeFileSync } from 'fs';
import { findAllControllerPairs } from './helpers';
import { ControllerSyncStatus } from '../../../types';

export class ControllerApiSyncEngine {
  /**
   * 同步单个控制器 - 通用实现
   */
  async syncController(sourcePath: string, targetPath: string, options: SyncOptions = {}): Promise<SyncResult> {
    try {
      const diffEngine = new ControllerApiDiffEngine(sourcePath, targetPath);

      // 3. 比对差异
      diffEngine.compareIntermediateState();

      // 4. 生成同步操作
      const actions = generateSyncActions(diffEngine.diffResult!, diffEngine.sourceAdapter.intermediateState);

      // 5. 执行同步（如果不是干运行模式）
      if (!options.dryRun && diffEngine.diffResult!.needsSync) {
        const codeGenerator = new TargetApiComposer(
          diffEngine.targetAdapter.intermediateState,
          diffEngine.sourceAdapter.intermediateState
        );

        const newCode = codeGenerator.applySyncActions(actions);
        writeFileSync(targetPath, newCode, 'utf-8');
      }

      return {
        success: true,
        controllerName: diffEngine.sourceAdapter.intermediateState.metadata.className,
        diff: diffEngine.diffResult!,
        actions,
        details: options.verbose ? `处理了 ${actions.length} 个操作` : undefined,
      };
    } catch (error) {
      return {
        success: false,
        controllerName: 'Unknown',
        diff: { className: 'Unknown', changes: [], methodChanges: [], needsSync: false },
        actions: [],
        error: error instanceof Error ? error.message : String(error),
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
      const diffEngine = new ControllerApiDiffEngine(pair.sourcePath, pair.targetPath);
      diffEngine.compareIntermediateState();

      results.push(diffEngine.getSummary(pair));
    }

    return results;
  }
}

/**
 * 创建 API 控制器同步引擎实例
 */
export function createApiSyncEngine(): ControllerApiSyncEngine {
  return new ControllerApiSyncEngine();
}
