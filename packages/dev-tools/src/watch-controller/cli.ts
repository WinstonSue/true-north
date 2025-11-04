#!/usr/bin/env node

/**
 * 统一的控制器同步 CLI 工具
 * 支持 Desktop 和 API 控制器的同步
 */

import { Command } from 'commander';
import { join } from 'path';
import { existsSync } from 'fs';
import { createProxySyncEngine } from './target-proxy/sync-engine';
import { createApiSyncEngine } from './target-api/sync-engine';
import { CONTROLLER_SOURCE_PATH, CONTROLLER_PROXY_TARGET_PATH, CONTROLLER_API_TARGET_PATH } from '../constants';

interface ControllerPair {
  className: string;
  sourcePath: string;
  targetPath: string;
}

type SyncTarget = 'desktop' | 'api' | 'all';

/**
 * 查找控制器对
 */
function findControllerPairs(target: SyncTarget): ControllerPair[] {
  const pairs: ControllerPair[] = [];
  
  // 硬编码的控制器列表（后续可以改为自动发现）
  const controllers = [
    { name: 'todo', path: 'growth/todo' },
    { name: 'goal', path: 'growth/goal' },
    { name: 'habit', path: 'growth/habit' },
    { name: 'task', path: 'growth/task' },
  ];

  for (const controller of controllers) {
    const className = controller.name.charAt(0).toUpperCase() + controller.name.slice(1) + 'Controller';
    const sourcePath = join(CONTROLLER_SOURCE_PATH, controller.path, `${controller.name}.controller.ts`);

    // 根据目标类型确定目标路径
    const targetPaths: { target: SyncTarget; path: string }[] = [];
    
    if (target === 'desktop' || target === 'all') {
      const desktopPath = join(CONTROLLER_PROXY_TARGET_PATH, controller.path, `${controller.name}.controller.ts`);
      if (existsSync(sourcePath) && existsSync(desktopPath)) {
        targetPaths.push({ target: 'desktop', path: desktopPath });
      }
    }
    
    if (target === 'api' || target === 'all') {
      const apiPath = join(CONTROLLER_API_TARGET_PATH, `${controller.name}.ts`);
      if (existsSync(sourcePath) && existsSync(apiPath)) {
        targetPaths.push({ target: 'api', path: apiPath });
      }
    }

    for (const { path: targetPath } of targetPaths) {
      pairs.push({
        className,
        sourcePath,
        targetPath,
      });
    }
  }

  return pairs;
}

// 移除未使用的函数

/**
 * 创建同步引擎
 */
function createSyncEngine(targetPath: string) {
  if (targetPath.includes('/api/controller/')) {
    return createApiSyncEngine();
  } else {
    return createProxySyncEngine();
  }
}

/**
 * 获取目标类型描述
 */
function getTargetDescription(targetPath: string): string {
  if (targetPath.includes('/api/controller/')) {
    return 'API';
  } else if (targetPath.includes('/desktop/')) {
    return 'Desktop';
  } else {
    return 'Unknown';
  }
}

/**
 * 同步命令
 */
async function syncCommand(controllerName?: string, options: any = {}) {
  const target: SyncTarget = options.target || 'all';
  
  try {
    console.log(`🚀 启动控制器同步引擎 (目标: ${target})...\n`);

    if (controllerName) {
      // 同步单个控制器
      const pairs = findControllerPairs(target).filter(p => 
        p.className.toLowerCase().includes(controllerName.toLowerCase())
      );
      
      if (pairs.length === 0) {
        console.error(`❌ 未找到控制器: ${controllerName}`);
        process.exit(1);
      }

      for (const pair of pairs) {
        const engine = createSyncEngine(pair.targetPath);
        const targetType = getTargetDescription(pair.targetPath);
        
        try {
          console.log(`🎯 同步控制器: ${pair.className} (${targetType})`);
          console.log(`   Server: ${pair.sourcePath}`);
          console.log(`   Target: ${pair.targetPath}\n`);

          const result = await engine.syncController(pair.sourcePath, pair.targetPath, {
            dryRun: options.dryRun,
            verbose: options.verbose,
            force: options.force,
          });

          if (result.success) {
            console.log(`✅ ${pair.className} (${targetType}) 同步完成`);
            
            if (result.diff.needsSync) {
              console.log(`   变更数量: ${result.diff.changes.length}`);
              console.log(`   同步操作: ${result.actions.length}`);
            } else {
              console.log('   无需同步');
            }
          } else {
            console.error(`❌ ${pair.className} (${targetType}) 同步失败: ${result.error}`);
          }
        } finally {
          engine.dispose();
        }
        
        console.log(); // 添加空行分隔
      }
    } else {
      // 同步所有控制器
      const pairs = findControllerPairs(target);
      console.log(`📋 发现 ${pairs.length} 个控制器对\n`);

      // 按目标类型分组
      const desktopPairs = pairs.filter(p => p.targetPath.includes('/desktop/'));
      const apiPairs = pairs.filter(p => p.targetPath.includes('/api/controller/'));

      let allResults: any[] = [];

      // 同步 Desktop 控制器
      if (desktopPairs.length > 0) {
        console.log(`🖥️  同步 Desktop 控制器 (${desktopPairs.length} 个)...`);
        const engine = createProxySyncEngine();
        
        try {
          const results = await engine.syncControllers(
            desktopPairs.map(p => ({ sourcePath: p.sourcePath, targetPath: p.targetPath })),
            {
              dryRun: options.dryRun,
              verbose: options.verbose,
              force: options.force,
            }
          );
          allResults.push(...results.map(r => ({ ...r, type: 'Desktop' })));
        } finally {
          engine.dispose();
        }
      }

      // 同步 API 控制器
      if (apiPairs.length > 0) {
        console.log(`🌐 同步 API 控制器 (${apiPairs.length} 个)...`);
        const engine = createApiSyncEngine();
        
        try {
          const results = await engine.syncControllers(
            apiPairs.map(p => ({ sourcePath: p.sourcePath, targetPath: p.targetPath })),
            {
              dryRun: options.dryRun,
              verbose: options.verbose,
              force: options.force,
            }
          );
          allResults.push(...results.map(r => ({ ...r, type: 'API' })));
        } finally {
          engine.dispose();
        }
      }

      // 显示结果摘要
      const successful = allResults.filter(r => r.success).length;
      const needsSync = allResults.filter(r => r.diff.needsSync).length;
      
      console.log('\n📊 同步摘要:');
      console.log(`   处理数量: ${allResults.length}`);
      console.log(`   成功数量: ${successful}`);
      console.log(`   需要同步: ${needsSync}`);

      if (options.report) {
        console.log('\n📋 详细报告:');
        for (const result of allResults) {
          const status = result.success ? '✅' : '❌';
          const syncStatus = result.diff.needsSync ? '🔄' : '✅';
          console.log(`   ${status} ${result.controllerName} (${result.type}): ${syncStatus} ${result.diff.changes.length} 个变更`);
        }
      }
    }
  } catch (error) {
    console.error('❌ 同步过程中发生错误:', error);
    process.exit(1);
  }
}

/**
 * 检查命令
 */
async function checkCommand(controllerName?: string, options: any = {}) {
  const target: SyncTarget = options.target || 'all';
  
  try {
    console.log(`🔍 启动差异检查 (目标: ${target})...\n`);

    if (controllerName) {
      // 检查单个控制器
      const pairs = findControllerPairs(target).filter(p => 
        p.className.toLowerCase().includes(controllerName.toLowerCase())
      );
      
      if (pairs.length === 0) {
        console.error(`❌ 未找到控制器: ${controllerName}`);
        process.exit(1);
      }

      for (const pair of pairs) {
        const engine = createSyncEngine(pair.targetPath);
        const targetType = getTargetDescription(pair.targetPath);
        
        try {
          const result = await engine.checkController(pair.sourcePath, pair.targetPath, {
            verbose: options.verbose,
          });

          console.log(`🎯 ${pair.className} (${targetType}) 检查结果:`);
          if (result.diff.needsSync) {
            console.log(`   需要同步: 是`);
            console.log(`   变更数量: ${result.diff.changes.length}`);
            
            if (options.verbose) {
              console.log('\n   变更详情:');
              for (const change of result.diff.changes) {
                const methodName = change.methodName ? ` (${change.methodName})` : '';
                console.log(`   - ${change.type}${methodName}: ${change.details.description}`);
              }
            }
          } else {
            console.log('   需要同步: 否');
          }
        } finally {
          engine.dispose();
        }
        
        console.log(); // 添加空行分隔
      }
    } else {
      // 检查所有控制器
      const pairs = findControllerPairs(target);
      
      // 按目标类型分组检查
      const desktopPairs = pairs.filter(p => p.targetPath.includes('/desktop/'));
      const apiPairs = pairs.filter(p => p.targetPath.includes('/api/controller/'));

      // 检查 Desktop 控制器
      if (desktopPairs.length > 0) {
        console.log('🖥️  Desktop 控制器检查结果:');
        const engine = createProxySyncEngine();
        
        try {
          const results = await engine.syncControllers(
            desktopPairs.map(p => ({ sourcePath: p.sourcePath, targetPath: p.targetPath })),
            { dryRun: true, verbose: options.verbose }
          );

          for (const result of results) {
            const status = result.diff.needsSync ? '🔄 需要同步' : '✅ 无需同步';
            const changeCount = result.diff.changes.length;
            console.log(`   ${result.controllerName}: ${status} (${changeCount} 个变更)`);
          }
        } finally {
          engine.dispose();
        }
        
        console.log();
      }

      // 检查 API 控制器
      if (apiPairs.length > 0) {
        console.log('🌐 API 控制器检查结果:');
        const engine = createApiSyncEngine();
        
        try {
          const results = await engine.syncControllers(
            apiPairs.map(p => ({ sourcePath: p.sourcePath, targetPath: p.targetPath })),
            { dryRun: true, verbose: options.verbose }
          );

          for (const result of results) {
            const status = result.diff.needsSync ? '🔄 需要同步' : '✅ 无需同步';
            const changeCount = result.diff.changes.length;
            console.log(`   ${result.controllerName}: ${status} (${changeCount} 个变更)`);
          }
        } finally {
          engine.dispose();
        }
      }
    }
  } catch (error) {
    console.error('❌ 检查过程中发生错误:', error);
    process.exit(1);
  }
}

/**
 * 调试命令 - 显示中间态
 */
async function debugCommand(filePath: string, options: any = {}) {
  try {
    const engine = createSyncEngine(filePath);
    
    try {
      const sourceType = filePath.includes('/server/') ? 'source' : 'target';
      const state = await engine.getIntermediateState(filePath, sourceType);
      const targetType = getTargetDescription(filePath);

      console.log(`🐛 ${targetType} 控制器中间态调试信息:\n`);
      console.log(`文件: ${filePath}`);
      console.log(`类型: ${sourceType}`);
      console.log(`目标: ${targetType}`);
      console.log(`类名: ${state.metadata.className}`);
      console.log(`基础路径: ${state.metadata.basePath}`);
      console.log(`方法数量: ${state.methods.size}`);
      console.log(`导入数量: ${state.imports.length}`);
      
      if (options.verbose) {
        console.log('\n方法列表:');
        for (const [name, method] of state.methods) {
          console.log(`  ${method.verb} ${method.path} -> ${name}()`);
          console.log(`    参数: ${method.parameters.length}`);
          console.log(`    返回: ${method.returnType}`);
        }

        console.log('\n导入列表:');
        for (const imp of state.imports) {
          console.log(`  ${imp.importType}: ${imp.source}`);
        }
      }
    } finally {
      engine.dispose();
    }
  } catch (error) {
    console.error('❌ 调试过程中发生错误:', error);
    process.exit(1);
  }
}

// 设置 CLI 命令
const program = new Command();

program
  .name('controller-sync')
  .description('统一的控制器同步 CLI 工具')
  .version('1.0.0');

program
  .command('sync')
  .description('同步控制器')
  .argument('[controller]', '控制器名称（可选）')
  .option('-t, --target <type>', '同步目标 (desktop|api|all)', 'all')
  .option('-d, --dry-run', '干运行模式，不实际修改文件')
  .option('-v, --verbose', '显示详细信息')
  .option('-f, --force', '强制同步')
  .option('-r, --report', '生成详细报告')
  .action(syncCommand);

program
  .command('check')
  .description('检查控制器差异')
  .argument('[controller]', '控制器名称（可选）')
  .option('-t, --target <type>', '检查目标 (desktop|api|all)', 'all')
  .option('-v, --verbose', '显示详细信息')
  .action(checkCommand);

program
  .command('debug')
  .description('调试中间态')
  .argument('<file>', '文件路径')
  .option('-v, --verbose', '显示详细信息')
  .action(debugCommand);

// 解析命令行参数
program.parse(process.argv);
