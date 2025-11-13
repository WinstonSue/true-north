/**
 * Proxy 控制器代码生成器
 * 专门处理 Proxy Controller 的代码生成和同步
 * 现在基于 AST 操作而非字符串操作
 */

import { IntermediateState, MethodDefinition } from '../core/intermediate-state/types';
import { SyncAction } from '../core/sync-engine';
import { ASTClassInfo, ASTMethod, ASTComposer } from '../core/ast';

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

  constructor(targetState: IntermediateState, sourceState: IntermediateState) {
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
    const result = this.generateCodeFromDiff(this.targetState, this.sourceState, actions);

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
  generateCodeFromDiff(
    targetState: IntermediateState,
    sourceState: IntermediateState,
    actions: SyncAction[]
  ): ASTModificationResult {
    const errors: string[] = [];
    let appliedActions = 0;

    // 获取目标代码的 AST
    const targetAST = targetState.astData;

    // 创建 AST 的深拷贝进行修改
    const modifiedAST = this.cloneAST(targetAST);

    // 应用同步操作
    for (const action of actions) {
      try {
        const success = this.applyActionToAST(modifiedAST, action, sourceState);
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
      // 如果生成失败，尝试使用原始代码
      generatedCode = targetState.code || '';
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
  private applyActionToAST(ast: ASTClassInfo, action: SyncAction, sourceState: IntermediateState): boolean {
    switch (action.type) {
      case 'add_method':
        return this.addMethodToAST(ast, action.data as MethodDefinition, sourceState);

      case 'remove_method':
        return this.removeMethodFromAST(ast, action.methodName!);

      case 'update_method':
        return this.updateMethodInAST(ast, action.methodName!, action.data as MethodDefinition, sourceState);

      case 'update_constructor':
        return this.updateConstructorInAST(ast, action.data);

      case 'update_imports':
        return this.updateImportsInAST(ast, action.data);

      default:
        return false;
    }
  }

  /**
   * 向 AST 添加方法
   */
  private addMethodToAST(ast: ASTClassInfo, method: MethodDefinition, sourceState: IntermediateState): boolean {
    try {
      // 检查方法是否已存在
      const existingIndex = ast.methods.findIndex((m) => m.name === method.name);
      if (existingIndex >= 0) {
        // 如果存在，替换它
        ast.methods[existingIndex] = this.convertMethodDefinitionToASTMethod(method, sourceState);
      } else {
        // 如果不存在，添加新方法
        ast.methods.push(this.convertMethodDefinitionToASTMethod(method, sourceState));
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
  private updateMethodInAST(
    ast: ASTClassInfo,
    methodName: string,
    method: MethodDefinition,
    sourceState: IntermediateState
  ): boolean {
    try {
      const methodIndex = ast.methods.findIndex((m) => m.name === methodName);
      if (methodIndex >= 0) {
        ast.methods[methodIndex] = this.convertMethodDefinitionToASTMethod(method, sourceState);
        return true;
      } else {
        // 如果方法不存在，添加它
        return this.addMethodToAST(ast, method, sourceState);
      }
    } catch (error) {
      console.error('更新 AST 方法失败:', error);
      return false;
    }
  }

  /**
   * 更新 AST 中的构造函数
   */
  private updateConstructorInAST(ast: ASTClassInfo, constructorData: any): boolean {
    try {
      if (constructorData && ast.constructor) {
        // 更新构造函数参数
        ast.constructor.parameters = constructorData.parameters || ast.constructor.parameters;
      }
      return true;
    } catch (error) {
      console.error('更新 AST 构造函数失败:', error);
      return false;
    }
  }

  /**
   * 更新 AST 中的导入声明
   */
  private updateImportsInAST(ast: ASTClassInfo, importsData: any): boolean {
    try {
      if (Array.isArray(importsData)) {
        ast.imports = importsData;
      }
      return true;
    } catch (error) {
      console.error('更新 AST 导入失败:', error);
      return false;
    }
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
        decorators: p.decoratorArgs
          ? [
              {
                name: p.decorator,
                arguments: p.decoratorArgs.map((arg) => ({
                  type: 'string' as const,
                  value: arg,
                  rawText: `'${arg}'`,
                })),
              },
            ]
          : [],
      })),
      returnType: method.returnType.startsWith('Promise<') ? method.returnType : `Promise<${method.returnType}>`,
      bodyText: this.generateProxyMethodBody(method),
      sourceLocation: method.sourceLocation,
      methodDeclaration: null as any, // 这里需要重新生成时会被设置
    };
  }

  /**
   * 转换装饰器到 AST 格式
   */
  private convertDecoratorsToAST(method: MethodDefinition) {
    const decorators = [];

    // 添加 HTTP 方法装饰器
    decorators.push({
      name: method.verb,
      arguments: [
        {
          type: 'string' as const,
          value: method.path,
          rawText: `'${method.path}'`,
        },
      ],
    });

    // 如果有装饰器选项，添加它们
    if (method.decoratorOptions) {
      Object.entries(method.decoratorOptions).forEach(([key, value]) => {
        decorators.push({
          name: key,
          arguments: [
            {
              type: 'object' as const,
              value: JSON.stringify(value),
              rawText: JSON.stringify(value),
            },
          ],
        });
      });
    }

    return decorators;
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
      preserveComments: true,
      indentChar: ' ',
      indentSize: 2,
    });
  }

  /**
   * 深拷贝 AST 对象
   */
  private cloneAST(ast: ASTClassInfo): ASTClassInfo {
    return {
      className: ast.className,
      decorators: ast.decorators.map((d) => ({
        name: d.name,
        arguments: d.arguments.map((arg) => ({ ...arg })),
      })),
      methods: ast.methods.map((m) => ({
        name: m.name,
        decorators: m.decorators.map((d) => ({
          name: d.name,
          arguments: d.arguments.map((arg) => ({ ...arg })),
        })),
        parameters: m.parameters.map((p) => ({
          name: p.name,
          type: p.type,
          optional: p.optional,
          decorators: p.decorators.map((d) => ({
            name: d.name,
            arguments: d.arguments.map((arg) => ({ ...arg })),
          })),
        })),
        returnType: m.returnType,
        bodyText: m.bodyText,
        sourceLocation: { ...m.sourceLocation },
        methodDeclaration: m.methodDeclaration,
      })),
      constructor: ast.constructor
        ? {
            parameters: ast.constructor.parameters.map((p) => ({
              name: p.name,
              type: p.type,
              modifiers: [...p.modifiers],
            })),
          }
        : undefined,
      imports: ast.imports.map((i) => ({
        source: i.source,
        specifiers: i.specifiers.map((s) => ({ ...s })),
        importType: i.importType,
      })),
      sourceFile: ast.sourceFile,
      classDeclaration: ast.classDeclaration,
    };
  }

  /**
   * 验证 AST 结构完整性
   */
  validateAST(ast: ASTClassInfo): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!ast.className) {
      errors.push('缺少类名');
    }

    if (!ast.methods || ast.methods.length === 0) {
      errors.push('缺少方法定义');
    }

    // 检查方法名重复
    const methodNames = ast.methods.map((m) => m.name);
    const duplicates = methodNames.filter((name, index) => methodNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push(`方法名重复: ${duplicates.join(', ')}`);
    }

    // 检查方法体
    ast.methods.forEach((method) => {
      if (!method.bodyText || method.bodyText.trim() === '') {
        errors.push(`方法 ${method.name} 缺少方法体`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
