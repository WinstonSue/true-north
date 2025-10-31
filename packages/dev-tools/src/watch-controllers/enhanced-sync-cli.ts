#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { enhancedSyncController, getDetailedChangeReport, batchCheckControllerSync } from './sync/enhanced-sync';
import { findControllerPairs } from './utils/file-finder';

/**
 * 增强的控制器同步命令行工具
 */
class EnhancedSyncCLI {
  private projectRoot: string;

  constructor() {
    // 从 dev-tools 目录向上两级到项目根目录
    this.projectRoot = require('path').join(process.cwd(), '../..');
  }

  /**
   * 同步单个控制器
   */
  async syncSingleController(controllerName: string, options: { dryRun?: boolean; verbose?: boolean } = {}) {
    console.log(`🔍 Searching for ${controllerName} controller...`);
    
    const pairs = await findControllerPairs(this.projectRoot);
    const pair = pairs.find(p => p.className.toLowerCase().includes(controllerName.toLowerCase()));
    
    if (!pair) {
      console.error(`❌ Controller ${controllerName} not found`);
      return;
    }

    console.log(`📁 Found controller pair:`);
    console.log(`   Server: ${pair.sourcePath}`);
    console.log(`   Desktop: ${pair.targetPath}`);

    try {
      const sourceContent = readFileSync(pair.sourcePath, 'utf-8');
      const targetContent = readFileSync(pair.targetPath, 'utf-8');

      console.log(`\n🔄 Analyzing ${pair.className}...`);
      
      const result = enhancedSyncController(targetContent, sourceContent, pair.className);
      
      if (!result.hasChanges) {
        console.log(`✅ ${pair.className} is already up to date`);
        return;
      }

      console.log(`\n📊 Sync Summary:`);
      console.log(`   Total methods: ${result.summary.totalMethods}`);
      console.log(`   Changed methods: ${result.summary.changedMethods}`);
      console.log(`   Added methods: ${result.summary.addedMethods}`);
      console.log(`   Parameter changes: ${result.summary.parameterChanges}`);
      console.log(`   Decorator changes: ${result.summary.decoratorChanges}`);
      console.log(`   Body changes: ${result.summary.bodyChanges}`);

      if (options.verbose) {
        console.log(`\n📋 Detailed Changes:`);
        console.log(getDetailedChangeReport(result.methodChanges));
      }

      if (options.dryRun) {
        console.log(`\n🔍 Dry run mode - no files were modified`);
        return;
      }

      writeFileSync(pair.targetPath, result.newContent, 'utf-8');
      console.log(`\n✅ Successfully synced ${pair.className}`);

    } catch (error) {
      console.error(`❌ Error syncing ${pair.className}:`, error);
    }
  }

  /**
   * 同步所有控制器
   */
  async syncAllControllers(options: { dryRun?: boolean; verbose?: boolean } = {}) {
    console.log(`🔍 Searching for all controller pairs...`);
    
    const pairs = await findControllerPairs(this.projectRoot);
    
    if (pairs.length === 0) {
      console.log(`❌ No controller pairs found`);
      return;
    }

    console.log(`📁 Found ${pairs.length} controller pairs`);

    // 准备批量检查数据
    const controllers = pairs.map(pair => ({
      className: pair.className,
      targetPath: pair.targetPath,
      sourcePath: pair.sourcePath,
      targetContent: readFileSync(pair.targetPath, 'utf-8'),
      sourceContent: readFileSync(pair.sourcePath, 'utf-8')
    }));

    // 批量检查同步状态
    const statuses = batchCheckControllerSync(controllers);
    
    // 显示概览
    const needsSyncCount = statuses.filter(s => s.needsSync).length;
    console.log(`\n📊 Sync Overview:`);
    console.log(`   Total controllers: ${statuses.length}`);
    console.log(`   Need sync: ${needsSyncCount}`);
    console.log(`   Up to date: ${statuses.length - needsSyncCount}`);

    if (needsSyncCount === 0) {
      console.log(`\n✅ All controllers are up to date`);
      return;
    }

    // 显示需要同步的控制器
    console.log(`\n🔄 Controllers needing sync:`);
    for (const status of statuses.filter(s => s.needsSync)) {
      console.log(`   📝 ${status.className}: ${status.summary.changedMethods} changes`);
      
      if (options.verbose) {
        console.log(`      ${getDetailedChangeReport(status.changes).split('\n').slice(1).join('\n      ')}`);
      }
    }

    if (options.dryRun) {
      console.log(`\n🔍 Dry run mode - no files were modified`);
      return;
    }

    // 执行同步
    let syncedCount = 0;
    for (const controller of controllers) {
      const status = statuses.find(s => s.className === controller.className);
      if (!status?.needsSync) continue;

      try {
        const result = enhancedSyncController(
          controller.targetContent,
          controller.sourceContent,
          controller.className
        );

        writeFileSync(controller.targetPath, result.newContent, 'utf-8');
        syncedCount++;
        console.log(`   ✅ Synced ${controller.className}`);
      } catch (error) {
        console.error(`   ❌ Failed to sync ${controller.className}:`, error);
      }
    }

    console.log(`\n🎉 Successfully synced ${syncedCount}/${needsSyncCount} controllers`);
  }

  /**
   * 检查同步状态（不执行同步）
   */
  async checkSyncStatus(controllerName?: string) {
    console.log(`🔍 Checking sync status...`);
    
    const pairs = await findControllerPairs(this.projectRoot);
    
    if (pairs.length === 0) {
      console.log(`❌ No controller pairs found`);
      return;
    }

    let targetPairs = pairs;
    if (controllerName) {
      targetPairs = pairs.filter(p => p.className.toLowerCase().includes(controllerName.toLowerCase()));
      if (targetPairs.length === 0) {
        console.error(`❌ Controller ${controllerName} not found`);
        return;
      }
    }

    const controllers = targetPairs.map(pair => ({
      className: pair.className,
      targetPath: pair.targetPath,
      sourcePath: pair.sourcePath,
      targetContent: readFileSync(pair.targetPath, 'utf-8'),
      sourceContent: readFileSync(pair.sourcePath, 'utf-8')
    }));

    const statuses = batchCheckControllerSync(controllers);
    
    console.log(`\n📊 Sync Status Report:`);
    for (const status of statuses) {
      const statusIcon = status.needsSync ? '❌' : '✅';
      console.log(`${statusIcon} ${status.className}`);
      
      if (status.needsSync) {
        console.log(`   Changes: ${status.summary.changedMethods} methods`);
        console.log(`   Details: ${getDetailedChangeReport(status.changes).split('\n').slice(1).join('\n   ')}`);
      } else {
        console.log(`   Status: Up to date`);
      }
      console.log('');
    }
  }
}


// CLI 入口
async function main() {
  const args = process.argv.slice(2);
  const cli = new EnhancedSyncCLI();

  if (args.length === 0) {
    console.log(`
🚀 Enhanced Controller Sync CLI

Usage:
  enhanced-sync sync [controller-name]     # Sync specific or all controllers
  enhanced-sync check [controller-name]    # Check sync status
  enhanced-sync --help                     # Show this help

Options:
  --dry-run     # Show what would be changed without modifying files
  --verbose     # Show detailed change information

Examples:
  enhanced-sync sync todo                  # Sync TodoController
  enhanced-sync sync --dry-run            # Check all controllers (dry run)
  enhanced-sync check                     # Check status of all controllers
  enhanced-sync check todo               # Check status of TodoController
    `);
    return;
  }

  const command = args[0];
  const controllerName = args[1];
  const options = {
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose')
  };

  try {
    switch (command) {
      case 'sync':
        if (controllerName) {
          await cli.syncSingleController(controllerName, options);
        } else {
          await cli.syncAllControllers(options);
        }
        break;
      
      case 'check':
        await cli.checkSyncStatus(controllerName);
        break;
      
      default:
        console.error(`❌ Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error:`, error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { EnhancedSyncCLI };
