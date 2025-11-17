/**
 * Proxy 控制器代码生成器
 * 专门处理 Proxy Controller 的代码生成和同步
 * 现在基于 AST 操作而非字符串操作
 */

import { IntermediateState, MethodDefinition } from '../core/intermediate-state/types';
import { SyncAction } from '../core/sync-engine';
import { ASTClassInfo, ASTMethod, ASTComposer } from '../core/ast';
import { cloneDeep } from 'lodash-es';

export interface ASTModificationResult {
  /** 修改后的 AST */
  modifiedAST: ASTClassInfo;
  /** 生成的代码 */
  generatedCode: string;
  /** 应用的操作数量 */
  appliedActions: number;
  /** 错误信息 */
  errors: string[];
}

export class TargetProxyComposer {
  private astComposer: ASTComposer;
  targetState: IntermediateState;
  sourceState: IntermediateState;

  constructor({ sourceState, targetState }: { sourceState: IntermediateState; targetState: IntermediateState }) {
    this.astComposer = new ASTComposer();
    this.targetState = targetState;
    this.sourceState = sourceState;
  }
  /**
   * 应用同步操作到 Proxy 控制器代码
   * 现在基于 AST 操作而非字符串操作
   */
  applySyncActions(actions: SyncAction[]): string {
    // 使用新的 AST 代码生成器
    const result = this.generateCodeFromDiff(actions);

    // 如果有错误，记录并返回原始代码
    if (result.errors.length > 0) {
      console.warn('AST 代码生成警告:', result.errors);
    }

    console.log(`AST 代码生成成功，应用了 ${result.appliedActions}/${actions.length} 个操作`);
    return result.generatedCode;
  }

  /**
   * 根据 diff 结果和同步操作生成新代码
   */
  generateCodeFromDiff(actions: SyncAction[]): ASTModificationResult {
    console.log('================');

    const errors: string[] = [];
    let appliedActions = 0;

    // 获取目标代码的 AST
    const targetAST = this.targetState.astData;

    // 创建 AST 的深拷贝进行修改
    const modifiedAST = this.cloneAst(targetAST);

    // 应用同步操作
    for (const action of actions) {
      try {
        const success = this.applyActionToAST(modifiedAST, action);
        if (success) {
          appliedActions++;
        } else {
          errors.push(`应用操作失败: ${action.type} - ${action.description}`);
        }
      } catch (error) {
        errors.push(`应用操作异常: ${action.type} - ${error}`);
      }
    }

    // 从修改后的 AST 生成代码
    let generatedCode = '';
    try {
      generatedCode = this.generateCodeFromAST(modifiedAST);
    } catch (error) {
      errors.push(`从 AST 生成代码失败: ${error}`);
    }

    return {
      modifiedAST,
      generatedCode,
      appliedActions,
      errors,
    };
  }

  /**
   * 应用单个同步操作到 AST
   */
  private applyActionToAST(ast: ASTClassInfo, action: SyncAction): boolean {
    switch (action.type) {
      case 'add_method':
        return this.addMethodToAST(ast, action.data as MethodDefinition);

      case 'remove_method':
        return this.removeMethodFromAST(ast, action.methodName!);

      case 'update_method':
        return this.updateMethodInAST(ast, action.methodName!, action.data as MethodDefinition);

      case 'update_constructor':
        return true;

      case 'update_imports':
        return true;

      default:
        return false;
    }
  }

  /**
   * 向 AST 添加方法
   */
  private addMethodToAST(ast: ASTClassInfo, method: MethodDefinition): boolean {
    try {
      // 检查方法是否已存在
      const existingIndex = ast.methods.findIndex((m) => m.name === method.name);

      if (existingIndex >= 0) {
        // 如果存在，更新现有方法（保持装饰器）
        const existingMethod = ast.methods[existingIndex];
        ast.methods[existingIndex] = this.updateExistingASTMethod(existingMethod, method);
      } else {
        // 如果不存在，添加新方法（生成新装饰器）
        ast.methods.push(this.convertMethodDefinitionToASTMethod(method, this.sourceState));
      }
      return true;
    } catch (error) {
      console.error('添加方法到 AST 失败:', error);
      return false;
    }
  }

  /**
   * 从 AST 删除方法
   */
  private removeMethodFromAST(ast: ASTClassInfo, methodName: string): boolean {
    try {
      const methodIndex = ast.methods.findIndex((m) => m.name === methodName);
      if (methodIndex >= 0) {
        ast.methods.splice(methodIndex, 1);
        return true;
      }
      return false;
    } catch (error) {
      console.error('从 AST 删除方法失败:', error);
      return false;
    }
  }

  /**
   * 更新 AST 中的方法
   */
  private updateMethodInAST(ast: ASTClassInfo, methodName: string, method: MethodDefinition): boolean {
    try {
      const methodIndex = ast.methods.findIndex((m) => m.name === methodName);
      if (methodIndex >= 0) {
        // 更新现有方法（保持装饰器）
        const existingMethod = ast.methods[methodIndex];
        ast.methods[methodIndex] = this.updateExistingASTMethod(existingMethod, method);
        console.log('更新 AST 方法成功:', method.name);
        console.log('更新 AST 方法成功:', ast.methods[methodIndex]);
        return true;
      } else {
        // 如果方法不存在，添加它
        return this.addMethodToAST(ast, method);
      }
    } catch (error) {
      console.error('更新 AST 方法失败:', error);
      return false;
    }
  }

  /**
   * 更新现有 AST 方法（保持装饰器不变）
   */
  private updateExistingASTMethod(existingMethod: any, method: MethodDefinition): any {
    return {
      ...existingMethod,
      // 保持原有的装饰器
      decorators: existingMethod.decorators,
      // 更新参数
      parameters: method.parameters.map((p) => ({
        name: p.name,
        type: p.type,
        optional: p.optional,
        decorators: this.convertParameterDecorators(p),
      })),
      // 更新返回类型
      returnType: method.returnType.startsWith('Promise<') ? method.returnType : `Promise<${method.returnType}>`,
      // 更新方法体
      bodyText: this.generateProxyMethodBody(method),
      // 保持其他属性
      sourceLocation: method.sourceLocation,
      modifiers: ['async'], // Proxy 控制器方法需要 async
    };
  }

  /**
   * 将 MethodDefinition 转换为 ASTMethod
   */
  private convertMethodDefinitionToASTMethod(method: MethodDefinition, _sourceState: IntermediateState): ASTMethod {
    return {
      name: method.name,
      decorators: this.convertDecoratorsToAST(method),
      parameters: method.parameters.map((p) => ({
        name: p.name,
        type: p.type,
        optional: p.optional,
        decorators: this.convertParameterDecorators(p),
      })),
      returnType: method.returnType.startsWith('Promise<') ? method.returnType : `Promise<${method.returnType}>`,
      bodyText: this.generateProxyMethodBody(method),
      sourceLocation: method.sourceLocation,
      methodDeclaration: null as any, // 这里需要重新生成时会被设置
      modifiers: ['async'], // Proxy 控制器方法需要 async
    };
  }

  /**
   * 转换装饰器到 AST 格式 - Proxy 专用
   * 基于 MethodDefinition 中的信息生成装饰器，避免重复创建
   */
  private convertDecoratorsToAST(method: MethodDefinition) {
    const decorators = [];

    // 基于 MethodDefinition 的信息创建 HTTP 方法装饰器
    const decoratorArgs = [
      {
        type: 'string' as const,
        value: method.path,
        rawText: `'${method.path}'`,
      },
    ];

    // Proxy 控制器不需要装饰器选项（如 description），因为它只是转发
    // 所以这里不处理 method.decoratorOptions

    decorators.push({
      name: method.verb, // Get, Post, Put, Delete 等
      arguments: decoratorArgs,
    });

    return decorators;
  }

  /**
   * 转换参数装饰器 - Proxy 专用
   * 确保使用正确的装饰器名称（electron-ipc-restful）
   */
  private convertParameterDecorators(parameter: any) {
    if (!parameter.decorator) {
      return [];
    }

    // 对于 Proxy 控制器，参数装饰器应该保持原样
    const decoratorArgs = parameter.decoratorArgs || [];

    return [
      {
        name: parameter.decorator, // Param, Query, Body 等
        arguments: decoratorArgs.map((arg: string) => ({
          type: 'string' as const,
          value: arg,
          rawText: `'${arg}'`,
        })),
      },
    ];
  }

  /**
   * 生成 Proxy 方法体
   */
  private generateProxyMethodBody(method: MethodDefinition): string {
    // 生成方法体 - 简单的代理调用
    const callParams = method.parameters.map((p) => p.name).join(', ');
    return `return this.controller.${method.name}(${callParams});`;
  }

  /**
   * 从 AST 生成完整代码
   */
  private generateCodeFromAST(ast: ASTClassInfo): string {
    return this.astComposer.generateCodeFromAST(ast, {
      preserveFormatting: false,
    });
  }

  private cloneAst(ast: ASTClassInfo): ASTClassInfo {
    const clonedAst = cloneDeep(ast);

    return clonedAst;
  }
}
