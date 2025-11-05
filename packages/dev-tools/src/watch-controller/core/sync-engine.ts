/**
 * 同步引擎基类
 * 提供通用的同步逻辑，子类可以重写特定的方法
 */

import { readFileSync, writeFileSync } from 'fs';
import { SourceAdapter } from './adapters';
import { DiffEngine } from './diff-engine';
import { IntermediateState, MethodDefinition } from './intermediate-state';
import { DiffResult, SyncAction } from './intermediate-state';

// 新架构的类型定义
export type MethodChangeType =
  | 'signature_changed'
  | 'parameters_changed'
  | 'decorators_changed'
  | 'body_changed'
  | 'no_change'
  | 'method_added'
  | 'method_removed';

export interface MethodInfo {
  name: string;
  signature: string;
  returnType: string;
  parameters: Array<{
    name: string;
    type: string;
    decorator?: string;
    decoratorArgs?: string;
  }>;
  decorators: Array<{
    name: string;
    args: string;
  }>;
  body: string;
}

export interface MethodChange {
  methodName: string;
  changeType: MethodChangeType;
  sourceMethod: MethodInfo;
  targetMethod?: MethodInfo;
  details: string;
}

export interface MethodDetailsResult {
  className: string;
  sourcePath: string;
  targetPath: string;
  needsSync: boolean;
  methodChanges: MethodChange[];
  summary: {
    totalMethods: number;
    changedMethods: number;
    addedMethods: number;
    removedMethods: number;
  };
  error?: string;
}

export interface ControllerSyncStatus {
  className: string;
  sourcePath: string;
  targetPath: string;
  needsSync: boolean;
  changeCount: number;
  lastChecked: string;
  error?: string;
  // 前端兼容字段
  filePath: string;
  changes: MethodChange[];
  summary: {
    totalMethods: number;
    changedMethods: number;
    addedMethods: number;
    signatureChanges: number;
    parameterChanges: number;
    decoratorChanges: number;
  };
}

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

export abstract class SyncEngine {
  protected sourceAdapter: SourceAdapter;
  protected diffEngine: DiffEngine;
  protected codeGenerator: any; // 子类需要定义具体类型

  constructor() {
    this.sourceAdapter = new SourceAdapter();
    this.diffEngine = this.createDiffEngine();
    this.codeGenerator = this.createCodeGenerator();
  }

  /**
   * 创建差异比对引擎 - 抽象方法，子类必须实现
   */
  protected abstract createDiffEngine(): DiffEngine;

  /**
   * 创建代码生成器 - 抽象方法，子类必须实现
   */
  protected abstract createCodeGenerator(): any;

  /**
   * 获取目标适配器 - 子类可以重写
   */
  protected getTargetAdapter(): any {
    return null; // API 控制器不需要目标适配器
  }

  /**
   * 同步单个控制器 - 通用实现
   */
  async syncController(sourcePath: string, targetPath: string, options: SyncOptions = {}): Promise<SyncResult> {
    try {
      // 1. 读取源码
      const sourceCode = readFileSync(sourcePath, 'utf-8');
      const targetCode = readFileSync(targetPath, 'utf-8');

      if (options.verbose) {
        console.log(`📖 读取源码文件:`);
        console.log(`   Server: ${sourcePath}`);
        console.log(`   Target: ${targetPath}`);
      }

      // 2. 解析为中间态
      const sourceState = this.sourceAdapter.parseToIntermediateState(sourceCode, sourcePath);
      const targetState = this.parseTargetToIntermediateState(targetCode, targetPath);

      if (options.verbose) {
        console.log(`🔍 解析完成:`);
        console.log(`   源方法数: ${sourceState.methods.size}`);
        console.log(`   目标方法数: ${targetState.methods.size}`);
      }

      // 3. 比对差异
      const diff = this.diffEngine.compare(sourceState, targetState);

      if (options.verbose) {
        console.log(`📊 差异比对完成:`);
        console.log(`   变更数量: ${diff.changes.length}`);
        console.log(`   需要同步: ${diff.needsSync}`);
      }

      // 4. 生成同步操作
      const actions = this.diffEngine.generateSyncActions(diff, sourceState);

      // 5. 执行同步（如果不是干运行模式）
      if (!options.dryRun && diff.needsSync) {
        const newCode = this.codeGenerator.applyChanges(targetCode, actions, sourceState);
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
        diff: { controllerName: 'Unknown', changes: [], needsSync: false },
        actions: [],
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * 解析目标代码为中间态 - 子类可以重写
   */
  protected parseTargetToIntermediateState(targetCode: string, targetPath: string): IntermediateState {
    const targetAdapter = this.getTargetAdapter();
    if (targetAdapter) {
      return targetAdapter.parseToIntermediateState(targetCode, targetPath);
    }
    // API 控制器使用自定义解析逻辑
    return this.parseApiTargetToIntermediateState(targetCode, targetPath);
  }

  /**
   * 解析 API 目标代码为中间态 - 默认实现
   */
  protected parseApiTargetToIntermediateState(code: string, filePath: string): IntermediateState {
    const methods = new Map<string, MethodDefinition>();

    // 解析 API 控制器中的静态方法
    const methodRegex = /static\s+async\s+(\w+)\s*\([^)]*\)\s*\{/g;
    let match;

    while ((match = methodRegex.exec(code)) !== null) {
      const methodName = match[1];
      methods.set(methodName, {
        name: methodName,
        verb: 'Get', // 默认值
        path: `/${methodName}`,
        parameters: [],
        returnType: 'any',
        bodyText: '',
        bodyHash: '',
        decoratorOptions: {},
        sourceLocation: {
          startLine: 0,
          endLine: 0,
          startColumn: 0,
          endColumn: 0,
        },
      });
    }

    return {
      metadata: {
        className: this.extractClassNameFromPath(filePath),
        basePath: '',
        filePath,
        sourceType: 'target',
      },
      methods,
      constructor: { parameters: [] },
      imports: [],
    };
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
        console.log(`\n🔄 同步控制器: ${pair.sourcePath} -> ${pair.targetPath}`);
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
   * 获取文件的中间态表示
   */
  async getIntermediateState(filePath: string, sourceType: 'source' | 'target'): Promise<IntermediateState> {
    const code = readFileSync(filePath, 'utf-8');
    if (sourceType === 'source') {
      return this.sourceAdapter.parseToIntermediateState(code, filePath);
    } else {
      return this.parseTargetToIntermediateState(code, filePath);
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
        const targetState = this.parseTargetToIntermediateState(targetCode, pair.targetPath);

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
   * 检查所有控制器的同步状态
   */
  async checkAllControllers(): Promise<ControllerSyncStatus[]> {
    const pairs = this.findAllControllerPairs();
    const results: ControllerSyncStatus[] = [];

    for (const pair of pairs) {
      try {
        const methodDetails = await this.getMethodDetails([pair]);
        const controllerDetails = methodDetails[0];

        // 生成详细的统计信息
        const summary = this.generateDetailedSummary(controllerDetails.methodChanges);

        results.push({
          className: pair.className,
          sourcePath: pair.sourcePath,
          targetPath: pair.targetPath,
          filePath: pair.targetPath, // 前端兼容字段
          needsSync: controllerDetails.methodChanges.length > 0,
          changeCount: controllerDetails.methodChanges.length,
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
   * 查找所有控制器对 - 抽象方法，子类必须实现
   */
  protected abstract findAllControllerPairs(): Array<{ sourcePath: string; targetPath: string; className: string }>;

  /**
   * 生成方法变更详情 - 通用实现
   */
  protected generateMethodChanges(sourceState: IntermediateState, targetState: IntermediateState): MethodChange[] {
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
          sourceMethod: this.convertToMethodInfo(targetMethod), // 使用目标方法作为源
          details: 'Method exists in target but not in source',
        });
      }
    }

    return changes;
  }

  /**
   * 检测变更类型 - 通用实现
   */
  protected detectChangeType(sourceMethod: MethodDefinition, targetMethod: MethodDefinition): MethodChangeType {
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

    return 'no_change';
  }

  /**
   * 检查参数是否变更 - 通用实现
   */
  protected parametersChanged(sourceParams: any[], targetParams: any[]): boolean {
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
   * 转换为方法信息 - 子类可以重写
   */
  protected convertToMethodInfo(method: MethodDefinition): MethodInfo {
    return {
      name: method.name,
      signature: `async ${method.name}(${method.parameters
        .map(
          (p) =>
            `${p.decorator ? `@${p.decorator}${p.decoratorArgs?.length ? `(${p.decoratorArgs.join(', ')})` : '()'} ` : ''}${p.name}${p.optional ? '?' : ''}: ${p.type}`
        )
        .join(', ')})`,
      returnType: method.returnType,
      parameters: method.parameters.map((p) => ({
        name: p.name,
        type: p.type,
        decorator: p.decorator,
        decoratorArgs: p.decoratorArgs?.join(', '),
      })),
      decorators: [
        {
          name: method.verb.toUpperCase(),
          args: method.path,
        },
      ],
      body: method.bodyText,
    };
  }

  /**
   * 生成变更详情 - 通用实现
   */
  protected generateChangeDetails(
    sourceMethod: MethodDefinition,
    targetMethod: MethodDefinition,
    changeType: MethodChangeType
  ): string {
    switch (changeType) {
      case 'decorators_changed':
        return `Decorators changed: ${targetMethod.verb}('${targetMethod.path}') -> ${sourceMethod.verb}('${sourceMethod.path}')`;
      case 'parameters_changed':
        return `Parameters changed: ${targetMethod.parameters.length} -> ${sourceMethod.parameters.length} parameters`;
      case 'signature_changed':
        return `Return type changed: ${targetMethod.returnType} -> ${sourceMethod.returnType}`;
      default:
        return 'Method changed';
    }
  }

  /**
   * 生成统计摘要 - 通用实现
   */
  protected generateSummary(
    methodChanges: MethodChange[],
    totalMethods: number
  ): { totalMethods: number; changedMethods: number; addedMethods: number; removedMethods: number } {
    const addedMethods = methodChanges.filter((c) => c.changeType === 'method_added').length;
    const removedMethods = methodChanges.filter((c) => c.changeType === 'method_removed').length;
    const changedMethods = methodChanges.filter(
      (c) => c.changeType !== 'method_added' && c.changeType !== 'method_removed'
    ).length;

    return {
      totalMethods,
      changedMethods,
      addedMethods,
      removedMethods,
    };
  }

  /**
   * 生成详细统计摘要 - 通用实现
   */
  protected generateDetailedSummary(methodChanges: MethodChange[]) {
    const signatureChanges = methodChanges.filter((c) => c.changeType === 'signature_changed').length;
    const parameterChanges = methodChanges.filter((c) => c.changeType === 'parameters_changed').length;
    const decoratorChanges = methodChanges.filter((c) => c.changeType === 'decorators_changed').length;

    return {
      totalMethods: methodChanges.length,
      changedMethods: methodChanges.filter((c) => c.changeType !== 'method_added' && c.changeType !== 'method_removed')
        .length,
      addedMethods: methodChanges.filter((c) => c.changeType === 'method_added').length,
      signatureChanges,
      parameterChanges,
      decoratorChanges,
    };
  }

  /**
   * 从文件路径提取类名 - 工具方法
   */
  protected extractClassNameFromPath(relativePath: string): string {
    const fileName = relativePath.split('/').pop() || '';
    const baseName = fileName.replace(/\.(ts|js)$/, '');
    return (
      baseName
        .split(/[-_]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('') + 'Controller'
    );
  }
}
