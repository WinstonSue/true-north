#!/usr/bin/env node

/**
 * 新架构的 CLI 工具
 * 使用统一的同步引擎进行控制器同步
 */

import { Command } from 'commander';
import { join } from 'path';
import { existsSync } from 'fs';
import { createProxySyncEngine } from './sync-engine';
import { ROOT, SOURCE_BASE, TARGET_BASE } from '../constants';

interface ControllerPair {
  className: string;
  sourcePath: string;
  targetPath: string;
}

/**
 * 查找控制器对
 */
function findControllerPairs(): ControllerPair[] {
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
    const sourcePath = join(SOURCE_BASE, controller.path, `${controller.name}.controller.ts`);
    const targetPath = join(TARGET_BASE, controller.path, `${controller.name}.controller.ts`);

    if (existsSync(sourcePath) && existsSync(targetPath)) {
      pairs.push({
        className,
        sourcePath,
        targetPath,
      });
    }
  }

  return pairs;
}

/**
 * 查找单个控制器对
 */
function findControllerPair(name: string): ControllerPair | null {
  const pairs = findControllerPairs();
  return pairs.find(p => p.className.toLowerCase().includes(name.toLowerCase())) || null;
}

/**
 * 同步命令
 */
async function syncCommand(controllerName?: string, options: any = {}) {
  const engine = createProxySyncEngine();
  
  try {
    console.log('🚀 启动新架构同步引擎...\n');

    if (controllerName) {
      // 同步单个控制器
      const pair = findControllerPair(controllerName);
      if (!pair) {
        console.error(`❌ 未找到控制器: ${controllerName}`);
        process.exit(1);
      }

      console.log(`🎯 同步控制器: ${pair.className}`);
      console.log(`   Server: ${pair.sourcePath}`);
      console.log(`   Desktop: ${pair.targetPath}\n`);

      const result = await engine.syncController(pair.sourcePath, pair.targetPath, {
        dryRun: options.dryRun,
        verbose: options.verbose,
        force: options.force,
      });

      if (result.success) {
        console.log(`✅ ${pair.className} 同步完成`);
        
        if (result.diff.needsSync) {
          console.log(`   变更数量: ${result.diff.changes.length}`);
          console.log(`   同步操作: ${result.actions.length}`);
        } else {
          console.log('   无需同步');
        }
      } else {
        console.error(`❌ ${pair.className} 同步失败: ${result.error}`);
        process.exit(1);
      }
    } else {
      // 同步所有控制器
      const pairs = findControllerPairs();
      console.log(`📋 发现 ${pairs.length} 个控制器对\n`);

      const results = await engine.syncControllers(
        pairs.map(p => ({ sourcePath: p.sourcePath, targetPath: p.targetPath })),
        {
          dryRun: options.dryRun,
          verbose: options.verbose,
          force: options.force,
        }
      );

      // 显示结果摘要
      const successful = results.filter(r => r.success).length;
      const needsSync = results.filter(r => r.diff.needsSync).length;
      
      console.log('\n📊 同步摘要:');
      console.log(`   处理数量: ${results.length}`);
      console.log(`   成功数量: ${successful}`);
      console.log(`   需要同步: ${needsSync}`);

      if (options.report) {
        const report = engine.generateReport(results);
        console.log('\n' + report);
      }
    }
  } finally {
    engine.dispose();
  }
}

/**
 * 检查命令
 */
async function checkCommand(controllerName?: string, options: any = {}) {
  const engine = createProxySyncEngine();
  
  try {
    console.log('🔍 启动差异检查...\n');

    if (controllerName) {
      // 检查单个控制器
      const pair = findControllerPair(controllerName);
      if (!pair) {
        console.error(`❌ 未找到控制器: ${controllerName}`);
        process.exit(1);
      }

      const result = await engine.checkController(pair.sourcePath, pair.targetPath, {
        verbose: options.verbose,
      });

      console.log(`🎯 ${pair.className} 检查结果:`);
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
    } else {
      // 检查所有控制器
      const pairs = findControllerPairs();
      const results = await engine.syncControllers(
        pairs.map(p => ({ sourcePath: p.sourcePath, targetPath: p.targetPath })),
        { dryRun: true, verbose: options.verbose }
      );

      console.log('📋 检查结果摘要:');
      for (const result of results) {
        const status = result.diff.needsSync ? '🔄 需要同步' : '✅ 无需同步';
        const changeCount = result.diff.changes.length;
        console.log(`   ${result.controllerName}: ${status} (${changeCount} 个变更)`);
      }
    }
  } finally {
    engine.dispose();
  }
}

/**
 * 调试命令 - 显示中间态
 */
async function debugCommand(filePath: string, options: any = {}) {
  const engine = createProxySyncEngine();
  
  try {
    const sourceType = filePath.includes('/server/') ? 'source' : 'target';
    const state = await engine.getIntermediateState(filePath, sourceType);

    console.log('🐛 中间态调试信息:\n');
    console.log(`文件: ${filePath}`);
    console.log(`类型: ${sourceType}`);
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
}

// 设置 CLI 命令
const program = new Command();

program
  .name('dev-tools-v2')
  .description('Dev Tools 新架构 CLI')
  .version('2.0.0');

program
  .command('sync')
  .description('同步控制器')
  .argument('[controller]', '控制器名称（可选）')
  .option('-d, --dry-run', '干运行模式，不实际修改文件')
  .option('-v, --verbose', '显示详细信息')
  .option('-f, --force', '强制同步')
  .option('-r, --report', '生成详细报告')
  .action(syncCommand);

program
  .command('check')
  .description('检查控制器差异')
  .argument('[controller]', '控制器名称（可选）')
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
