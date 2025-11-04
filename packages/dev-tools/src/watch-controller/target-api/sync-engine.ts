/**
 * API 控制器同步引擎
 * 专门处理 Server Controller 到 API Controller 的同步
 */

import { readFileSync, writeFileSync } from 'fs';
import { SourceAdapter } from '../core/adapters/index.js';
import { ControllerApiDiffEngine } from './diff-engine.js';
import { ControllerApiCodeGenerator } from './code-generator.js';
import { IntermediateState, MethodDefinition } from '../core/intermediate-state.js';
import {
  MethodChange,
  MethodDetailsResult,
  MethodInfo,
  ControllerSyncStatus,
  SyncOptions,
  SyncResult,
} from '../core/sync-engine.js';

/**
 * API 控制器同步引擎
 * 负责将 Server Controller 的方法同步到 API Controller
 */
export class ControllerApiSyncEngine {
  private sourceAdapter: SourceAdapter;
  private diffEngine: ControllerApiDiffEngine;
  private codeGenerator: ControllerApiCodeGenerator;

  constructor() {
    this.sourceAdapter = new SourceAdapter();
    this.diffEngine = new ControllerApiDiffEngine();
    this.codeGenerator = new ControllerApiCodeGenerator();
  }

  /**
   * 同步单个 API 控制器
   */
  async syncController(sourcePath: string, targetPath: string, options: SyncOptions = {}): Promise<SyncResult> {
    try {
      // 1. 读取源码
      const sourceCode = readFileSync(sourcePath, 'utf-8');
      const targetCode = readFileSync(targetPath, 'utf-8');

      if (options.verbose) {
        console.log(`📖 读取源码文件:`);
        console.log(`   Server: ${sourcePath}`);
        console.log(`   API: ${targetPath}`);
      }

      // 2. 解析源码为中间态
      const sourceState = this.sourceAdapter.parseToIntermediateState(sourceCode, sourcePath);
      
      // 3. 解析目标 API 控制器的现有方法
      const targetState = this.parseApiController(targetCode, targetPath);

      if (options.verbose) {
        console.log(`🔍 解析结果:`);
        console.log(`   Server methods: ${sourceState.methods.size}`);
        console.log(`   API methods: ${targetState.methods.size}`);
      }

      // 4. 比对差异
      const diff = this.diffEngine.compare(sourceState, targetState);

      if (options.verbose) {
        console.log(`📊 差异分析:`);
        console.log(`   变更数量: ${diff.changes.length}`);
        console.log(`   需要同步: ${diff.needsSync}`);
      }

      // 5. 生成同步操作
      const actions = this.diffEngine.generateSyncActions(diff, sourceState);

      if (options.verbose) {
        console.log(`🔧 同步操作:`);
        actions.forEach((action) => {
          console.log(`   ${action.type}: ${action.description}`);
        });
      }

      // 6. 应用同步操作
      if (!options.dryRun && diff.needsSync) {
        const updatedCode = this.codeGenerator.applySyncActions(targetCode, actions, targetState, sourceState);
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
   * 检查 API 控制器差异（不执行同步）
   */
  async checkController(sourcePath: string, targetPath: string, options: SyncOptions = {}): Promise<SyncResult> {
    return this.syncController(sourcePath, targetPath, { ...options, dryRun: true });
  }

  /**
   * 批量同步多个 API 控制器
   */
  async syncControllers(
    pairs: Array<{ sourcePath: string; targetPath: string }>,
    options: SyncOptions = {}
  ): Promise<SyncResult[]> {
    const results: SyncResult[] = [];

    for (const pair of pairs) {
      if (options.verbose) {
        console.log(`\n🔄 处理 API 控制器: ${pair.sourcePath}`);
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
   * 解析 API 控制器的现有方法
   * API 控制器的结构与 Desktop 控制器不同，需要特殊处理
   */
  private parseApiController(code: string, filePath: string): IntermediateState {
    // 创建一个简化的中间态，主要包含方法信息
    const state: IntermediateState = {
      metadata: {
        className: this.extractClassName(code),
        basePath: '',
        filePath,
        sourceType: 'target',
      },
      methods: new Map(),
      constructor: {
        parameters: [],
      },
      imports: [],
    };

    // 解析 API 控制器中的静态方法
    const methodRegex = /static\s+async\s+(\w+)\s*\([^)]*\)\s*\{/g;
    let match;
    
    while ((match = methodRegex.exec(code)) !== null) {
      const methodName = match[1];
      
      // 创建方法定义
      const methodDef: MethodDefinition = {
        name: methodName,
        verb: 'Get', // API 方法的 HTTP 动词需要从实际代码中解析
        path: '', // API 方法的路径需要从实际代码中解析
        parameters: [], // 简化处理，不解析参数
        returnType: 'Promise<any>',
        decoratorOptions: {},
        bodyText: '',
        bodyHash: '',
        sourceLocation: {
          startLine: 0,
          endLine: 0,
          startColumn: 0,
          endColumn: 0,
        },
      };

      state.methods.set(methodName, methodDef);
    }

    return state;
  }

  /**
   * 从代码中提取类名
   */
  private extractClassName(code: string): string {
    const classMatch = code.match(/export\s+(?:default\s+)?class\s+(\w+)/);
    return classMatch ? classMatch[1] : 'Unknown';
  }

  /**
   * 生成同步报告
   */
  generateReport(results: SyncResult[]): string {
    const lines: string[] = [];

    lines.push('# API 控制器同步报告');
    lines.push('');
    lines.push(`生成时间: ${new Date().toLocaleString()}`);
    lines.push(`处理数量: ${results.length}`);
    lines.push('');

    // 统计信息
    const successful = results.filter((r) => r.success).length;
    const needsSync = results.filter((r) => r.diff.needsSync).length;
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
   * 获取文件的中间态表示
   */
  async getIntermediateState(filePath: string, sourceType: 'source' | 'target'): Promise<IntermediateState> {
    const code = readFileSync(filePath, 'utf-8');
    if (sourceType === 'source') {
      return this.sourceAdapter.parseToIntermediateState(code, filePath);
    } else {
      return this.parseApiController(code, filePath);
    }
  }

  /**
   * 检查所有 API 控制器的同步状态
   */
  async checkAllControllers(): Promise<ControllerSyncStatus[]> {
    const pairs = this.findAllControllerPairs();
    const results: ControllerSyncStatus[] = [];

    for (const pair of pairs) {
      try {
        const diff = await this.checkController(pair.sourcePath, pair.targetPath);
        const methodDetails = await this.getMethodDetails([pair]);
        const controllerDetails = methodDetails[0];

        // 生成详细的统计信息
        const summary = this.generateDetailedSummary(controllerDetails.methodChanges);

        results.push({
          className: pair.className,
          sourcePath: pair.sourcePath,
          targetPath: pair.targetPath,
          filePath: pair.targetPath,
          needsSync: diff.diff.needsSync,
          changeCount: diff.diff.changes.length,
          changes: controllerDetails.methodChanges,
          summary,
          lastChecked: new Date().toISOString(),
          error: undefined,
        });
      } catch (error) {
        results.push({
          className: pair.className,
          sourcePath: pair.sourcePath,
          targetPath: pair.targetPath,
          filePath: pair.targetPath,
          needsSync: false,
          changeCount: 0,
          changes: [],
          summary: {
            totalMethods: 0,
            changedMethods: 0,
            addedMethods: 0,
            signatureChanges: 0,
            parameterChanges: 0,
            decoratorChanges: 0,
          },
          lastChecked: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return results;
  }

  /**
   * 获取方法级别的详细比对信息
   */
  async getMethodDetails(
    pairs: Array<{ sourcePath: string; targetPath: string; className: string }>
  ): Promise<MethodDetailsResult[]> {
    const results: MethodDetailsResult[] = [];

    for (const pair of pairs) {
      try {
        const sourceCode = readFileSync(pair.sourcePath, 'utf-8');
        const targetCode = readFileSync(pair.targetPath, 'utf-8');

        const sourceState = this.sourceAdapter.parseToIntermediateState(sourceCode, pair.sourcePath);
        const targetState = this.parseApiController(targetCode, pair.targetPath);

        const diff = this.diffEngine.compare(sourceState, targetState);
        const methodChanges = this.generateMethodChanges(sourceState, targetState);

        results.push({
          className: pair.className,
          sourcePath: pair.sourcePath,
          targetPath: pair.targetPath,
          needsSync: diff.needsSync,
          methodChanges,
          summary: this.generateSummary(methodChanges, sourceState.methods.size),
        });
      } catch (error) {
        results.push({
          className: pair.className,
          sourcePath: pair.sourcePath,
          targetPath: pair.targetPath,
          needsSync: false,
          methodChanges: [],
          summary: { totalMethods: 0, changedMethods: 0, addedMethods: 0, removedMethods: 0 },
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return results;
  }

  /**
   * 生成方法变更详情
   */
  private generateMethodChanges(sourceState: IntermediateState, targetState: IntermediateState): MethodChange[] {
    const changes: MethodChange[] = [];

    // 检查源码中的每个方法
    for (const [methodName, sourceMethod] of sourceState.methods) {
      const targetMethod = targetState.methods.get(methodName);

      if (!targetMethod) {
        // 方法在目标中不存在
        changes.push({
          methodName,
          changeType: 'method_added',
          sourceMethod: this.convertToMethodInfo(sourceMethod),
          details: 'Method not found in API controller',
        });
        continue;
      }

      // API 控制器的方法比较相对简单，主要检查方法是否存在
      // 因为 API 方法的具体实现是标准化的
    }

    // 检查目标中多余的方法
    for (const [methodName, targetMethod] of targetState.methods) {
      if (!sourceState.methods.has(methodName)) {
        changes.push({
          methodName,
          changeType: 'method_removed',
          sourceMethod: this.convertToMethodInfo(targetMethod),
          details: 'Method exists in API controller but not in source',
        });
      }
    }

    return changes;
  }

  /**
   * 转换为方法信息格式
   */
  private convertToMethodInfo(method: MethodDefinition): MethodInfo {
    return {
      name: method.name,
      signature: `static async ${method.name}(${method.parameters
        .map(
          (p) =>
            `${p.decorator ? `@${p.decorator}${p.decoratorArgs?.length ? `(${p.decoratorArgs.join(', ')})` : '()'} ` : ''}${p.name}${p.optional ? '?' : ''}: ${p.type}`
        )
        .join(', ')}): ${method.returnType}`,
      returnType: method.returnType,
      parameters: method.parameters.map((p) => ({
        name: p.name,
        type: p.type,
        decorator: p.decorator,
        decoratorArgs: p.decoratorArgs?.join(', '),
      })),
      decorators: [
        {
          name: method.verb,
          args: method.path + (method.decoratorOptions ? `, ${JSON.stringify(method.decoratorOptions)}` : ''),
        },
      ],
      body: method.bodyText || `return request({ method: "${method.verb.toLowerCase()}" })(\`${method.path}\`);`,
    };
  }

  /**
   * 生成摘要信息
   */
  private generateSummary(changes: MethodChange[], totalMethods: number) {
    const changedMethods = changes.filter(
      (c) => c.changeType !== 'no_change' && c.changeType !== 'method_added' && c.changeType !== 'method_removed'
    ).length;
    const addedMethods = changes.filter((c) => c.changeType === 'method_added').length;
    const removedMethods = changes.filter((c) => c.changeType === 'method_removed').length;

    return {
      totalMethods,
      changedMethods,
      addedMethods,
      removedMethods,
    };
  }

  /**
   * 生成详细的统计信息
   */
  private generateDetailedSummary(changes: MethodChange[]) {
    const summary = {
      totalMethods: 0,
      changedMethods: 0,
      addedMethods: 0,
      signatureChanges: 0,
      parameterChanges: 0,
      decoratorChanges: 0,
    };

    // 计算总方法数（包括变更和未变更的）
    const methodNames = new Set(changes.map((c) => c.methodName));
    summary.totalMethods = methodNames.size;

    changes.forEach((change) => {
      switch (change.changeType) {
        case 'method_added':
          summary.addedMethods++;
          break;
        case 'signature_changed':
          summary.signatureChanges++;
          summary.changedMethods++;
          break;
        case 'parameters_changed':
          summary.parameterChanges++;
          summary.changedMethods++;
          break;
        case 'decorators_changed':
          summary.decoratorChanges++;
          summary.changedMethods++;
          break;
      }
    });

    return summary;
  }

  /**
   * 查找所有控制器对
   */
  private findAllControllerPairs(): Array<{ className: string; sourcePath: string; targetPath: string }> {
    const path = require('path');
    const { existsSync } = require('fs');

    // 导入路径常量
    const { CONTROLLER_SOURCE_PATH, CONTROLLER_API_TARGET_PATH } = require('../../constants');

    // 硬编码的控制器列表（与服务器中保持一致）
    const controllers = [
      { name: 'todo', path: 'growth/todo' },
      { name: 'goal', path: 'growth/goal' },
      { name: 'habit', path: 'growth/habit' },
      { name: 'task', path: 'growth/task' },
    ];

    const pairs: Array<{ className: string; sourcePath: string; targetPath: string }> = [];

    for (const controller of controllers) {
      const className = controller.name.charAt(0).toUpperCase() + controller.name.slice(1) + 'Controller';
      const sourcePath = path.join(CONTROLLER_SOURCE_PATH, controller.path, `${controller.name}.controller.ts`);
      // API 控制器文件直接在 controller 目录下，不按模块分组
      const targetPath = path.join(CONTROLLER_API_TARGET_PATH, `${controller.name}.ts`);

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
   * 从文件路径提取类名
   */
  private extractClassNameFromPath(relativePath: string): string {
    const path = require('path');
    const basename = path.basename(relativePath, '.controller.ts');
    return (
      basename
        .split('-')
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('') + 'Controller'
    );
  }

  /**
   * 清理资源
   */
  dispose(): void {
    // Adapters 不需要特殊的清理逻辑
  }
}

/**
 * 创建 API 同步引擎实例
 */
export function createApiSyncEngine(): ControllerApiSyncEngine {
  return new ControllerApiSyncEngine();
}
