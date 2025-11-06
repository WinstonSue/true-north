/**
 * API 控制器同步引擎
 * 专门处理 Server Controller 到 API Controller 的同步
 */

import { SyncOptions, SyncResult, generateSyncActions } from '../core/sync-engine';
import { ControllerApiDiffEngine } from './diff-engine';
import { ControllerApiCodeGenerator } from './code-generator';
import { readFileSync, writeFileSync } from 'fs';

export class ControllerApiSyncEngine {
  diffEngine: ControllerApiDiffEngine;
  private codeGenerator: ControllerApiCodeGenerator;

  constructor() {
    this.diffEngine = new ControllerApiDiffEngine();
    this.codeGenerator = new ControllerApiCodeGenerator();
  }

  /**
   * 同步单个控制器 - 通用实现
   */
  async syncController(sourcePath: string, targetPath: string, options: SyncOptions = {}): Promise<SyncResult> {
    try {
      // 1. 读取源码
      const targetCode = readFileSync(targetPath, 'utf-8');

      if (options.verbose) {
        console.log(`📖 读取源码文件:`);
        console.log(`   Server: ${sourcePath}`);
        console.log(`   Target: ${targetPath}`);
      }

      // 2. 解析为中间态
      const sourceState = this.diffEngine.getSourceIntermediateState(sourcePath);
      const targetState = this.diffEngine.getTargetIntermediateState(targetPath);

      if (options.verbose) {
        console.log(`🔍 解析完成:`);
        console.log(`   源方法数: ${sourceState.methods.size}`);
        console.log(`   目标方法数: ${targetState.methods.size}`);
      }

      // 3. 比对差异
      const diff = this.diffEngine.compareIntermediateState(sourceState, targetState);

      if (options.verbose) {
        console.log(`📊 差异比对完成:`);
        console.log(`   变更数量: ${diff.changes.length}`);
        console.log(`   需要同步: ${diff.needsSync}`);
      }

      // 4. 生成同步操作
      const actions = generateSyncActions(diff, sourceState);

      // 5. 执行同步（如果不是干运行模式）
      if (!options.dryRun && diff.needsSync) {
        const newCode = this.codeGenerator.applySyncActions(targetCode, actions, targetState, sourceState);
        writeFileSync(targetPath, newCode, 'utf-8');

        if (options.verbose) {
          console.log(`✅ 同步完成: ${targetPath}`);
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
      return {
        success: false,
        controllerName: 'Unknown',
        diff: { className: 'Unknown', changes: [], methodChanges: [], needsSync: false },
        actions: [],
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

/**
 * 创建 API 控制器同步引擎实例
 */
export function createApiSyncEngine(): ControllerApiSyncEngine {
  return new ControllerApiSyncEngine();
}
