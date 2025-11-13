/**
 * Web Service 代码生成器
 * 专门处理 Web Service 的代码生成和同步
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

export class TargetWebServiceComposer {
  private astComposer: ASTComposer;
  targetState: IntermediateState;
  sourceState: IntermediateState;

  constructor(targetState: IntermediateState, sourceState: IntermediateState) {
    this.astComposer = new ASTComposer();
    this.targetState = targetState;
    this.sourceState = sourceState;
  }

  /**
   * 应用同步操作到 Web Service 代码
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
      decorators: [], // Web Service 方法不需要装饰器
      parameters: this.convertParametersToAST(method),
      returnType: 'Promise<void>', // Web Service 方法通常返回 void
      bodyText: this.generateWebServiceMethodBody(method),
      sourceLocation: method.sourceLocation,
      methodDeclaration: null as any, // 这里需要重新生成时会被设置
    };
  }

  /**
   * 转换参数到 AST 格式
   */
  private convertParametersToAST(method: MethodDefinition) {
    const params = [];

    for (const param of method.parameters) {
      if (param.decorator === 'Param') {
        // Path 参数
        params.push({
          name: param.name,
          type: 'string',
          optional: false,
          decorators: [],
        });
      } else if (param.decorator === 'Body') {
        // Body 参数
        const voType = this.convertDtoTypeToVoType(param.type);
        params.push({
          name: param.name,
          type: voType,
          optional: false,
          decorators: [],
        });
      } else if (param.decorator === 'Query') {
        // Query 参数
        const voType = this.convertDtoTypeToVoType(param.type);
        params.push({
          name: param.name,
          type: voType,
          optional: param.optional,
          decorators: [],
        });
      }
    }

    // 添加 options 参数（如果方法需要）
    if (this.needsOptionsParameter(method)) {
      params.push({
        name: 'options',
        type: 'MethodOptions',
        optional: false,
        decorators: [],
      });
    }

    return params;
  }

  /**
   * 生成 Web Service 方法体
   */
  private generateWebServiceMethodBody(method: MethodDefinition): string {
    const lines: string[] = [];

    lines.push('try {');

    // 生成 Controller 调用
    const controllerCall = this.generateControllerCall(method);
    lines.push(`  ${controllerCall}`);

    // 生成成功消息（如果需要）
    if (this.needsSuccessMessage(method)) {
      lines.push('  if (!options.silent) {');
      lines.push(`    Message.success('${this.getSuccessMessage(method)}');`);
      lines.push('  }');
    }

    lines.push('  return res;');
    lines.push('} catch (error: unknown) {');
    lines.push('  Message.error(error);');
    lines.push('}');

    return lines.join('\n');
  }

  /**
   * 生成 Controller 调用代码
   */
  private generateControllerCall(method: MethodDefinition): string {
    const callParams: string[] = [];

    for (const param of method.parameters) {
      callParams.push(param.name);
    }

    const callParamsStr = callParams.join(', ');
    return `const res = await ${this.targetState.metadata.className.replace('Service', 'Controller')}.${method.name}(${callParamsStr});`;
  }

  /**
   * 转换 DTO 类型为 VO 类型
   */
  private convertDtoTypeToVoType(dtoType: string): string {
    // 移除泛型参数
    const baseType = dtoType.replace(/<.*>/, '');

    // 转换常见的 DTO 类型
    if (baseType.includes('FilterDto')) {
      return baseType.replace('FilterDto', 'FilterVo');
    } else if (baseType.includes('PageFilterDto')) {
      return baseType.replace('PageFilterDto', 'PageFilterVo');
    } else if (baseType.includes('CreateDto')) {
      return baseType.replace('CreateDto', 'CreateVo');
    } else if (baseType.includes('UpdateDto')) {
      return baseType.replace('UpdateDto', 'UpdateVo');
    } else if (baseType.includes('Dto')) {
      return baseType.replace('Dto', 'Vo');
    }

    return dtoType;
  }

  /**
   * 判断是否需要成功消息
   */
  private needsSuccessMessage(method: MethodDefinition): boolean {
    const mutatingVerbs = ['Post', 'Put', 'Delete', 'Patch'];
    return mutatingVerbs.includes(method.verb);
  }

  /**
   * 判断是否需要 options 参数
   */
  private needsOptionsParameter(method: MethodDefinition): boolean {
    return this.needsSuccessMessage(method);
  }

  /**
   * 获取成功消息
   */
  private getSuccessMessage(method: MethodDefinition): string {
    switch (method.verb) {
      case 'Post':
        return '创建成功';
      case 'Put':
      case 'Patch':
        return '操作成功';
      case 'Delete':
        return '删除成功';
      default:
        return '操作成功';
    }
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
