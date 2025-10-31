import { readFileSync, writeFileSync } from 'fs';
import { enhancedSyncController, getDetailedChangeReport } from './enhanced-sync';
import { syncMissingMethods } from './sync-database';
import { log } from '../utils';

/**
 * 集成的同步选项
 */
export interface SyncOptions {
  enableContentSync?: boolean; // 是否启用内容级同步
  dryRun?: boolean;           // 是否为试运行
  verbose?: boolean;          // 是否显示详细信息
  forceSync?: boolean;        // 是否强制同步（忽略内容比对）
}

/**
 * 同步结果
 */
export interface SyncResult {
  success: boolean;
  hasChanges: boolean;
  message: string;
  details?: string;
  error?: string;
}

/**
 * 集成的控制器同步函数
 * 支持传统方法级同步和新的内容级同步
 */
export function syncControllerWithOptions(
  targetPath: string,
  sourcePath: string,
  className: string,
  options: SyncOptions = {}
): SyncResult {
  const {
    enableContentSync = true,
    dryRun = false,
    verbose = false,
    forceSync = false
  } = options;

  try {
    // 读取文件内容
    const targetContent = readFileSync(targetPath, 'utf-8');
    const sourceContent = readFileSync(sourcePath, 'utf-8');

    if (enableContentSync && !forceSync) {
      // 使用增强的内容级同步
      const result = enhancedSyncController(targetContent, sourceContent, className);
      
      if (!result.hasChanges) {
        return {
          success: true,
          hasChanges: false,
          message: `${className} is already up to date`
        };
      }

      const summary = result.summary;
      let message = `${className} sync completed: ${summary.changedMethods} methods changed`;
      
      if (summary.addedMethods > 0) {
        message += `, ${summary.addedMethods} methods added`;
      }

      let details = '';
      if (verbose) {
        details = getDetailedChangeReport(result.methodChanges);
      }

      if (!dryRun) {
        writeFileSync(targetPath, result.newContent, 'utf-8');
        log('Enhanced sync completed for', className);
      }

      return {
        success: true,
        hasChanges: true,
        message,
        details
      };

    } else {
      // 使用传统的方法级同步
      const syncedContent = syncMissingMethods(targetContent, className, sourceContent);
      
      const hasChanges = syncedContent !== targetContent;
      
      if (!hasChanges) {
        return {
          success: true,
          hasChanges: false,
          message: `${className} is already up to date (method-level check)`
        };
      }

      if (!dryRun) {
        writeFileSync(targetPath, syncedContent, 'utf-8');
        log('Traditional sync completed for', className);
      }

      return {
        success: true,
        hasChanges: true,
        message: `${className} sync completed (method-level)`
      };
    }

  } catch (error) {
    return {
      success: false,
      hasChanges: false,
      message: `Failed to sync ${className}`,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * 批量同步控制器
 */
export function batchSyncControllers(
  controllerPairs: Array<{
    className: string;
    targetPath: string;
    sourcePath: string;
  }>,
  options: SyncOptions = {}
): Array<SyncResult & { className: string }> {
  const results: Array<SyncResult & { className: string }> = [];

  for (const pair of controllerPairs) {
    const result = syncControllerWithOptions(
      pair.targetPath,
      pair.sourcePath,
      pair.className,
      options
    );

    results.push({
      ...result,
      className: pair.className
    });

    if (options.verbose) {
      console.log(`\n📝 ${pair.className}:`);
      console.log(`   ${result.message}`);
      if (result.details) {
        console.log(`   ${result.details.split('\n').join('\n   ')}`);
      }
      if (result.error) {
        console.log(`   ❌ Error: ${result.error}`);
      }
    }
  }

  return results;
}

/**
 * 检查控制器是否需要同步（不执行同步）
 */
export function checkControllerNeedsSync(
  targetPath: string,
  sourcePath: string,
  className: string,
  enableContentSync: boolean = true
): { needsSync: boolean; reason: string } {
  try {
    const targetContent = readFileSync(targetPath, 'utf-8');
    const sourceContent = readFileSync(sourcePath, 'utf-8');

    if (enableContentSync) {
      const result = enhancedSyncController(targetContent, sourceContent, className);
      
      if (result.hasChanges) {
        const changedMethods = result.methodChanges.filter(c => c.changeType !== 'no_change');
        return {
          needsSync: true,
          reason: `${changedMethods.length} methods need updates`
        };
      }
    } else {
      const syncedContent = syncMissingMethods(targetContent, className, sourceContent);
      
      if (syncedContent !== targetContent) {
        return {
          needsSync: true,
          reason: 'Method-level changes detected'
        };
      }
    }

    return {
      needsSync: false,
      reason: 'Up to date'
    };

  } catch (error) {
    return {
      needsSync: true,
      reason: `Error checking sync status: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * 向后兼容的同步函数
 * 保持与现有代码的兼容性
 */
export function legacySyncController(
  targetPath: string,
  sourcePath: string,
  className: string
): boolean {
  const result = syncControllerWithOptions(targetPath, sourcePath, className, {
    enableContentSync: false, // 使用传统同步
    dryRun: false,
    verbose: false
  });

  return result.success && result.hasChanges;
}
