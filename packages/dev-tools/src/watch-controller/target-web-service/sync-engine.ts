/**
 * Web Service 同步引擎
 * 专门处理 Server Controller 到 Web Service 的同步
 */

import { writeFileSync } from 'fs';
import { ControllerWebServiceDiffEngine } from './diff-engine';
import { TargetWebServiceComposer } from './target-composer';
import { formatFile } from '../../utils/formatter';
import { generateSyncActions, SyncOptions, SyncResult } from '../core/sync-engine';
import { ControllerSyncStatus } from '../../../types';
import { findAllControllerPairs } from './helpers';

export class ControllerWebServiceSyncEngine {
  /**
   * 同步单个控制器 - 通用实现
   */
  async syncController(sourcePath: string, targetPath: string, options: SyncOptions = {}): Promise<SyncResult> {
    try {
      const diffEngine = new ControllerWebServiceDiffEngine({ sourcePath, targetPath });

      // 2. 比对差异
      const diff = diffEngine.compareIntermediateState();

      // 3. 生成同步操作
      const actions = generateSyncActions(diff, diffEngine.sourceAdapter.intermediateState);

      // 5. 执行同步（如果不是干运行模式）
      if (!options.dryRun && diff.needsSync) {
        const targetComposer = new TargetWebServiceComposer({
          targetState: diffEngine.targetAdapter.intermediateState,
          sourceState: diffEngine.sourceAdapter.intermediateState,
        });

        const newCode = targetComposer.applySyncActions(actions);
        writeFileSync(targetPath, newCode, 'utf-8');

        // 格式化生成的代码
        formatFile(targetPath);
      }

      return {
        success: true,
        controllerName: diffEngine.sourceAdapter.intermediateState.metadata.className,
        diff,
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
      const diffEngine = new ControllerWebServiceDiffEngine({
        sourcePath: pair.sourcePath,
        targetPath: pair.targetPath,
      });
      diffEngine.compareIntermediateState();

      results.push(diffEngine.getSummary(pair));
    }

    return results;
  }
}

/**
 * 创建 Web Service 同步引擎实例
 */
export function createWebServiceSyncEngine(): ControllerWebServiceSyncEngine {
  return new ControllerWebServiceSyncEngine();
}
