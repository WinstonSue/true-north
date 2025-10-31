/**
 * 统一同步引擎
 * 整合 AST 解析、差异比对、代码生成的完整流程
 */

import { readFileSync, writeFileSync } from 'fs';
import { UnifiedASTParser } from './ast-parser';
import { DiffEngine } from './diff-engine';
import { CodeGenerator } from './code-generator';
import { IntermediateState, DiffResult, SyncAction } from './intermediate-state';

export interface SyncOptions {
  /** 是否为干运行模式 */
  dryRun?: boolean;
  /** 是否显示详细信息 */
  verbose?: boolean;
  /** 是否强制同步 */
  force?: boolean;
}

export interface SyncResult {
  /** 是否成功 */
  success: boolean;
  /** 控制器名称 */
  controllerName: string;
  /** 差异结果 */
  diff: DiffResult;
  /** 同步操作 */
  actions: SyncAction[];
  /** 错误信息 */
  error?: string;
  /** 详细信息 */
  details?: string;
}

export class SyncEngine {
  private astParser: UnifiedASTParser;
  private diffEngine: DiffEngine;
  private codeGenerator: CodeGenerator;

  constructor() {
    this.astParser = new UnifiedASTParser();
    this.diffEngine = new DiffEngine();
    this.codeGenerator = new CodeGenerator();
  }

  /**
   * 同步单个控制器
   */
  async syncController(sourcePath: string, targetPath: string, options: SyncOptions = {}): Promise<SyncResult> {
    try {
      // 1. 读取源码
      const sourceCode = readFileSync(sourcePath, 'utf-8');
      const targetCode = readFileSync(targetPath, 'utf-8');

      if (options.verbose) {
        console.log(`📖 读取源码文件:`);
        console.log(`   Server: ${sourcePath}`);
        console.log(`   Desktop: ${targetPath}`);
      }

      // 2. 解析为中间态
      const sourceState = this.astParser.parseToIntermediateState(sourceCode, sourcePath, 'source');
      const targetState = this.astParser.parseToIntermediateState(targetCode, targetPath, 'target');

      if (options.verbose) {
        console.log(`🔍 解析结果:`);
        console.log(`   Server methods: ${sourceState.methods.size}`);
        console.log(`   Desktop methods: ${targetState.methods.size}`);
      }

      // 3. 比对差异
      const diff = this.diffEngine.compare(sourceState, targetState);

      if (options.verbose) {
        console.log(`📊 差异分析:`);
        console.log(`   变更数量: ${diff.changes.length}`);
        console.log(`   需要同步: ${diff.needsSync}`);
      }

      // 4. 生成同步操作
      const actions = this.diffEngine.generateSyncActions(diff, sourceState);

      if (options.verbose) {
        console.log(`🔧 同步操作:`);
        actions.forEach(action => {
          console.log(`   ${action.type}: ${action.description}`);
        });
      }

      // 5. 应用同步操作
      if (!options.dryRun && diff.needsSync) {
        const updatedCode = this.codeGenerator.applySyncActions(targetCode, actions, targetState);
        writeFileSync(targetPath, updatedCode, 'utf-8');

        if (options.verbose) {
          console.log(`✅ 已更新文件: ${targetPath}`);
        }
      }

      return {
        success: true,
        controllerName: sourceState.metadata.className,
        diff,
        actions,
        details: options.dryRun ? '干运行模式，未实际修改文件' : undefined,
      };

    } catch (error) {
      return {
        success: false,
        controllerName: 'Unknown',
        diff: { controllerName: 'Unknown', changes: [], needsSync: false },
        actions: [],
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * 检查控制器差异（不执行同步）
   */
  async checkController(sourcePath: string, targetPath: string, options: SyncOptions = {}): Promise<SyncResult> {
    return this.syncController(sourcePath, targetPath, { ...options, dryRun: true });
  }

  /**
   * 批量同步多个控制器
   */
  async syncControllers(pairs: Array<{ sourcePath: string; targetPath: string }>, options: SyncOptions = {}): Promise<SyncResult[]> {
    const results: SyncResult[] = [];

    for (const pair of pairs) {
      if (options.verbose) {
        console.log(`\n🔄 处理控制器: ${pair.sourcePath}`);
      }

      const result = await this.syncController(pair.sourcePath, pair.targetPath, options);
      results.push(result);

      if (!result.success && options.verbose) {
        console.error(`❌ 同步失败: ${result.error}`);
      }
    }

    return results;
  }

  /**
   * 生成同步报告
   */
  generateReport(results: SyncResult[]): string {
    const lines: string[] = [];
    
    lines.push('# 控制器同步报告');
    lines.push('');
    lines.push(`生成时间: ${new Date().toLocaleString()}`);
    lines.push(`处理数量: ${results.length}`);
    lines.push('');

    // 统计信息
    const successful = results.filter(r => r.success).length;
    const needsSync = results.filter(r => r.diff.needsSync).length;
    const totalChanges = results.reduce((sum, r) => sum + r.diff.changes.length, 0);

    lines.push('## 统计信息');
    lines.push('');
    lines.push(`- 成功处理: ${successful}/${results.length}`);
    lines.push(`- 需要同步: ${needsSync}`);
    lines.push(`- 总变更数: ${totalChanges}`);
    lines.push('');

    // 详细结果
    lines.push('## 详细结果');
    lines.push('');

    for (const result of results) {
      lines.push(`### ${result.controllerName}`);
      lines.push('');

      if (!result.success) {
        lines.push(`❌ **错误**: ${result.error}`);
        lines.push('');
        continue;
      }

      if (!result.diff.needsSync) {
        lines.push('✅ **状态**: 无需同步');
        lines.push('');
        continue;
      }

      lines.push(`🔄 **状态**: 需要同步 (${result.diff.changes.length} 个变更)`);
      lines.push('');

      lines.push('**变更详情**:');
      for (const change of result.diff.changes) {
        const methodName = change.methodName ? ` \`${change.methodName}\`` : '';
        lines.push(`- ${change.type}${methodName}: ${change.details.description}`);
      }
      lines.push('');

      if (result.actions.length > 0) {
        lines.push('**同步操作**:');
        for (const action of result.actions) {
          lines.push(`- ${action.description}`);
        }
        lines.push('');
      }
    }

    return lines.join('\n');
  }

  /**
   * 获取中间态信息（用于调试）
   */
  async getIntermediateState(filePath: string, sourceType: 'source' | 'target'): Promise<IntermediateState> {
    const code = readFileSync(filePath, 'utf-8');
    return this.astParser.parseToIntermediateState(code, filePath, sourceType);
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.astParser.dispose();
  }
}

/**
 * 创建同步引擎实例
 */
export function createSyncEngine(): SyncEngine {
  return new SyncEngine();
}
