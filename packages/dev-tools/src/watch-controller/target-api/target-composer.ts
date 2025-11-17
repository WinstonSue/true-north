/**
 * API 控制器代码生成器
 * 专门处理 API Controller 的代码生成和同步
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

export class TargetApiComposer {
  private astComposer: ASTComposer;
  targetState: IntermediateState;
  sourceState: IntermediateState;

  constructor({ targetState, sourceState }: { targetState: IntermediateState; sourceState: IntermediateState }) {
    this.astComposer = new ASTComposer();
    this.targetState = targetState;
    this.sourceState = sourceState;
  }

  /**
   * 应用同步操作到 API 控制器代码
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
   * 将 MethodDefinition 转换为 ASTMethod
   */
  private convertMethodDefinitionToASTMethod(method: MethodDefinition, sourceState: IntermediateState): ASTMethod {
    return {
      name: method.name,
      decorators: [], // API 控制器不需要装饰器
      parameters: method.parameters.map((p) => ({
        name: p.name, // 直接使用原始参数名
        type: p.type,
        optional: p.optional,
        decorators: [], // API 控制器参数也不需要装饰器
        showType: true, // API 控制器参数需要显示类型
      })),
      returnType: method.returnType,
      bodyText: this.generateMethodBody(method, sourceState),
      sourceLocation: method.sourceLocation,
      methodDeclaration: null as any, // 这里需要重新生成时会被设置
      modifiers: ['static', 'async'], // API 控制器方法使用 static async
      showReturnType: false, // API 控制器不显示返回类型
    };
  }

  /**
   * 生成 API 方法体 - 基于 AST 参数数据
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

    // 基于实际参数名生成方法体，而不是硬编码
    const idParam = method.parameters.find((p) => p.decorator === 'Param' && p.name === 'id');
    const bodyParam_obj = method.parameters.find((p) => p.decorator === 'Body');
    const queryParam = method.parameters.find((p) => p.decorator === 'Query');

    if (idParam) {
      pathStr = pathStr.replace('/:id', `\${${idParam.name}}`);
    }

    if (bodyParam_obj) {
      bodyParam = `, ${bodyParam_obj.name}`;
    } else if (queryParam) {
      bodyParam = `, ${queryParam.name}`;
    }

    if (queryParam && bodyParam_obj) {
      pathStr = `${pathStr}?\${new URLSearchParams(${queryParam.name} as any).toString()}`;
      bodyParam = `, ${bodyParam_obj.name}`;
    }

    return `return request${genericType}({ method: "${httpMethod}" })(\`${pathStr}\`${bodyParam});`;
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
      properties: [], // API 控制器不需要属性
      isDefaultExport: true, // API 控制器使用 export default
      methods: ast.methods.map((m) => ({
        name: m.name,
        decorators: [], // API 控制器所有方法都不需要装饰器
        parameters: m.parameters.map((p) => ({
          name: p.name, // 直接使用原始参数名
          type: p.type,
          optional: p.optional,
          decorators: [], // API 控制器所有参数都不需要装饰器
          showType: true, // API 控制器参数需要显示类型
        })),
        returnType: m.returnType,
        bodyText: m.bodyText,
        sourceLocation: { ...m.sourceLocation },
        methodDeclaration: m.methodDeclaration,
        modifiers: ['static', 'async'], // API 控制器所有方法都使用 static async
        showReturnType: false, // API 控制器所有方法都不显示返回类型
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
}
