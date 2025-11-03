/**
 * 统一同步引擎
 * 整合 AST 解析、差异比对、代码生成的完整流程
 */

import { readFileSync, writeFileSync } from 'fs';
import { SourceAdapter, TargetAdapter } from '../core/adapters';
import { ProxyDiffEngine } from './diff-engine';
import { ProxyCodeGenerator } from './code-generator';
import { IntermediateState, MethodDefinition, ParameterDefinition } from '../core/intermediate-state';
import {
  MethodChangeType,
  MethodChange,
  MethodDetailsResult,
  MethodInfo,
  ControllerSyncStatus,
  SyncOptions,
  SyncResult,
} from '../core/sync-engine';

export class ProxySyncEngine {
  private sourceAdapter: SourceAdapter;
  private targetAdapter: TargetAdapter;
  private diffEngine: ProxyDiffEngine;
  private codeGenerator: ProxyCodeGenerator;

  constructor() {
    this.sourceAdapter = new SourceAdapter();
    this.targetAdapter = new TargetAdapter();
    this.diffEngine = new ProxyDiffEngine();
    this.codeGenerator = new ProxyCodeGenerator();
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
      const sourceState = this.sourceAdapter.parseToIntermediateState(sourceCode, sourcePath);
      const targetState = this.targetAdapter.parseToIntermediateState(targetCode, targetPath);

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
        actions.forEach((action) => {
          console.log(`   ${action.type}: ${action.description}`);
        });
      }

      // 5. 应用同步操作
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
   * 检查控制器差异（不执行同步）
   */
  async checkController(sourcePath: string, targetPath: string, options: SyncOptions = {}): Promise<SyncResult> {
    return this.syncController(sourcePath, targetPath, { ...options, dryRun: true });
  }

  /**
   * 批量同步多个控制器
   */
  async syncControllers(
    pairs: Array<{ sourcePath: string; targetPath: string }>,
    options: SyncOptions = {}
  ): Promise<SyncResult[]> {
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
      return this.targetAdapter.parseToIntermediateState(code, filePath);
    }
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
        const targetState = this.targetAdapter.parseToIntermediateState(targetCode, pair.targetPath);

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
          details: 'Method not found in target controller',
        });
        continue;
      }

      // 比较方法差异
      const changeType = this.detectChangeType(sourceMethod, targetMethod);
      if (changeType !== 'no_change') {
        changes.push({
          methodName,
          changeType,
          sourceMethod: this.convertToMethodInfo(sourceMethod),
          targetMethod: this.convertToMethodInfo(targetMethod),
          details: this.generateChangeDetails(sourceMethod, targetMethod, changeType),
        });
      }
    }

    // 检查目标中多余的方法
    for (const [methodName, targetMethod] of targetState.methods) {
      if (!sourceState.methods.has(methodName)) {
        changes.push({
          methodName,
          changeType: 'method_removed',
          sourceMethod: this.convertToMethodInfo(targetMethod), // 使用目标方法作为参考
          details: 'Method exists in target but not in source',
        });
      }
    }

    return changes;
  }

  /**
   * 检测变更类型
   */
  private detectChangeType(sourceMethod: MethodDefinition, targetMethod: MethodDefinition): MethodChangeType {
    // 比较装饰器
    if (sourceMethod.verb !== targetMethod.verb || sourceMethod.path !== targetMethod.path) {
      return 'decorators_changed';
    }

    // 比较参数
    if (this.parametersChanged(sourceMethod.parameters, targetMethod.parameters)) {
      return 'parameters_changed';
    }

    // 比较方法签名
    if (sourceMethod.returnType !== targetMethod.returnType) {
      return 'signature_changed';
    }

    // 注意：方法体不在比对范围内，因为目标代码都是标准化的代理调用
    // 而源代码包含实际的业务逻辑，这种差异是预期的

    return 'no_change';
  }

  /**
   * 检查参数是否变更
   */
  private parametersChanged(sourceParams: ParameterDefinition[], targetParams: ParameterDefinition[]): boolean {
    if (sourceParams.length !== targetParams.length) {
      return true;
    }

    for (let i = 0; i < sourceParams.length; i++) {
      const source = sourceParams[i];
      const target = targetParams[i];

      if (
        source.name !== target.name ||
        source.type !== target.type ||
        source.decorator !== target.decorator ||
        source.optional !== target.optional
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * 转换为方法信息格式
   */
  private convertToMethodInfo(method: MethodDefinition): MethodInfo {
    return {
      name: method.name,
      signature: `async ${method.name}(${method.parameters
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
      body:
        method.bodyText || `return this.controller.${method.name}(${method.parameters.map((p) => p.name).join(', ')});`,
    };
  }

  /**
   * 生成变更详情描述
   */
  private generateChangeDetails(
    sourceMethod: MethodDefinition,
    targetMethod: MethodDefinition,
    changeType: MethodChangeType
  ): string {
    switch (changeType) {
      case 'decorators_changed':
        return `Decorator changed: ${targetMethod.verb} ${targetMethod.path} → ${sourceMethod.verb} ${sourceMethod.path}`;
      case 'parameters_changed':
        return `Parameters changed: ${targetMethod.parameters.length} → ${sourceMethod.parameters.length} parameters`;
      case 'signature_changed':
        return `Return type changed: ${targetMethod.returnType} → ${sourceMethod.returnType}`;
      default:
        return 'Unknown change';
    }
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
   * 检查所有控制器的同步状态
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
          filePath: pair.targetPath, // 前端兼容字段
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
    const fg = require('fast-glob');
    const path = require('path');
    const { existsSync } = require('fs');

    // 这里需要导入 constants，但为了避免循环依赖，我们直接定义路径
    const SOURCE_BASE = path.join(process.cwd(), '../../packages/business/server/src');
    const TARGET_BASE = path.join(process.cwd(), '../../apps/desktop/src/database');

    const sourceControllerPaths = fg.sync(path.join(SOURCE_BASE, '**/*.controller.ts').replace(/\\/g, '/'));
    const pairs: Array<{ className: string; sourcePath: string; targetPath: string }> = [];

    for (const sourcePath of sourceControllerPaths) {
      // 提取类名
      const relativePath = path.relative(SOURCE_BASE, sourcePath);
      const className = this.extractClassNameFromPath(relativePath);

      // 构建目标路径
      const targetPath = path.join(TARGET_BASE, relativePath);

      if (existsSync(targetPath)) {
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
 * 创建同步引擎实例
 */
export function createProxySyncEngine(): ProxySyncEngine {
  return new ProxySyncEngine();
}
