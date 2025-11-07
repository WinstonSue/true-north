/**
 * 基于 AST 的代码生成器
 * 根据 diff 结果调整 AST，然后生成完整代码
 */

import { ASTClassInfo, ASTMethod } from './ast-types';
import { ASTParser } from './ast-parser';
import { IntermediateState, MethodDefinition } from '../intermediate-state';
import { SyncAction } from '../sync-engine/types';
import { CodeRecovery } from './code-recovery';

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

/**
 * 基于 AST 的代码生成器
 * 通过修改 AST 结构然后生成代码，而不是直接操作字符串
 */
export class ASTCodeGenerator {
  private parser: ASTParser;
  private codeRecovery: CodeRecovery;

  constructor() {
    this.parser = new ASTParser();
    this.codeRecovery = new CodeRecovery();
  }

  /**
   * 根据 diff 结果和同步操作生成新代码
   */
  generateCodeFromDiff(
    targetState: IntermediateState,
    actions: SyncAction[],
    sourceState: IntermediateState
  ): ASTModificationResult {
    const errors: string[] = [];
    let appliedActions = 0;

    // 获取目标代码的 AST
    let targetAST = targetState.astData;
    if (!targetAST) {
      if (targetState.code) {
        try {
          targetAST = this.parser.parse(targetState.code, targetState.metadata.filePath);
        } catch (error) {
          errors.push(`解析目标代码失败: ${error}`);
          return {
            modifiedAST: {} as ASTClassInfo,
            generatedCode: targetState.code || '',
            appliedActions: 0,
            errors,
          };
        }
      } else {
        errors.push('目标状态缺少 AST 数据和源码');
        return {
          modifiedAST: {} as ASTClassInfo,
          generatedCode: '',
          appliedActions: 0,
          errors,
        };
      }
    }

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
  private applyActionToAST(
    ast: ASTClassInfo,
    action: SyncAction,
    sourceState: IntermediateState
  ): boolean {
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
  private addMethodToAST(
    ast: ASTClassInfo,
    method: MethodDefinition,
    sourceState: IntermediateState
  ): boolean {
    try {
      // 检查方法是否已存在
      const existingIndex = ast.methods.findIndex(m => m.name === method.name);
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
      const methodIndex = ast.methods.findIndex(m => m.name === methodName);
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
      const methodIndex = ast.methods.findIndex(m => m.name === methodName);
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
  private convertMethodDefinitionToASTMethod(
    method: MethodDefinition,
    sourceState: IntermediateState
  ): ASTMethod {
    return {
      name: method.name,
      decorators: this.convertDecoratorsToAST(method),
      parameters: method.parameters.map(p => ({
        name: p.name,
        type: p.type,
        optional: p.optional,
        decorators: p.decoratorArgs ? [{
          name: p.decorator,
          arguments: p.decoratorArgs.map(arg => ({
            type: 'string' as const,
            value: arg,
            rawText: `'${arg}'`,
          })),
        }] : [],
      })),
      returnType: method.returnType,
      bodyText: this.generateMethodBody(method, sourceState),
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
      arguments: [{
        type: 'string' as const,
        value: method.path,
        rawText: `'${method.path}'`,
      }],
    });

    // 如果有装饰器选项，添加它们
    if (method.decoratorOptions) {
      Object.entries(method.decoratorOptions).forEach(([key, value]) => {
        decorators.push({
          name: key,
          arguments: [{
            type: 'object' as const,
            value: JSON.stringify(value),
            rawText: JSON.stringify(value),
          }],
        });
      });
    }

    return decorators;
  }

  /**
   * 生成 API 方法体
   */
  private generateMethodBody(method: MethodDefinition, sourceState: IntermediateState): string {
    // 合并Controller基础路径和方法路径
    const basePath = sourceState.metadata.basePath || '';
    const fullPath = basePath ? `${basePath}${method.path}` : method.path;

    // 根据参数样式生成不同的方法体
    const httpMethod = method.verb.toLowerCase() === 'delete' ? 'remove' : method.verb.toLowerCase();
    
    // 使用从server controller提取的返回类型
    let returnType = method.returnType || 'any';
    if (returnType.startsWith('Promise<') && returnType.endsWith('>')) {
      returnType = returnType.slice(8, -1);
    }
    const genericType = `<${returnType}>`;

    let pathStr = fullPath;
    let bodyParam = '';

    // 根据参数生成请求调用
    const hasId = method.parameters.some(p => p.decorator === 'Param' && p.name === 'id');
    const hasBody = method.parameters.some(p => p.decorator === 'Body');
    const hasQuery = method.parameters.some(p => p.decorator === 'Query');

    if (hasId) {
      pathStr = pathStr.replace('/:id', '/${id}');
    }

    if (hasBody) {
      bodyParam = ', body';
    } else if (hasQuery) {
      bodyParam = ', query';
    }

    if (hasQuery && hasBody) {
      pathStr = `${pathStr}?\${new URLSearchParams(query as any).toString()}`;
      bodyParam = ', body';
    }

    return `return request${genericType}({ method: "${httpMethod}" })(\`${pathStr}\`${bodyParam});`;
  }

  /**
   * 从 AST 生成完整代码
   */
  private generateCodeFromAST(ast: ASTClassInfo): string {
    return this.codeRecovery.recoverFromAST(ast, {
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
      decorators: ast.decorators.map(d => ({
        name: d.name,
        arguments: d.arguments.map(arg => ({ ...arg })),
      })),
      methods: ast.methods.map(m => ({
        name: m.name,
        decorators: m.decorators.map(d => ({
          name: d.name,
          arguments: d.arguments.map(arg => ({ ...arg })),
        })),
        parameters: m.parameters.map(p => ({
          name: p.name,
          type: p.type,
          optional: p.optional,
          decorators: p.decorators.map(d => ({
            name: d.name,
            arguments: d.arguments.map(arg => ({ ...arg })),
          })),
        })),
        returnType: m.returnType,
        bodyText: m.bodyText,
        sourceLocation: { ...m.sourceLocation },
        methodDeclaration: m.methodDeclaration,
      })),
      constructor: ast.constructor ? {
        parameters: ast.constructor.parameters.map(p => ({
          name: p.name,
          type: p.type,
          modifiers: [...p.modifiers],
        })),
      } : undefined,
      imports: ast.imports.map(i => ({
        source: i.source,
        specifiers: i.specifiers.map(s => ({ ...s })),
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
    const methodNames = ast.methods.map(m => m.name);
    const duplicates = methodNames.filter((name, index) => methodNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push(`方法名重复: ${duplicates.join(', ')}`);
    }

    // 检查方法体
    ast.methods.forEach(method => {
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
