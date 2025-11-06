import {
  IntermediateState,
  MethodDefinition,
  ConstructorDefinition,
  ImportDeclaration,
  ParameterDefinition,
  SourceLocation,
} from '../core/intermediate-state';
import {
  ASTClassInfo,
  ASTMethod,
  ASTParameter,
  ASTConstructor,
  ASTImport,
  ASTSourceLocation,
} from '../core/ast/ast-types';
import { TargetAdapter } from '../core/adapters/target-adapter';

/**
 * Web Service 目标适配器
 * 将 Web Service 代码的 AST 转换为中间态
 */
export class TargetWebServiceAdapter extends TargetAdapter {
  constructor() {
    super();
  }

  /**
   * 将 AST 转换为中间态
   * Web Service 代码特点：
   * - 静态异步方法：static async methodName()
   * - 无装饰器，纯 TypeScript 方法
   * - 参数类型为 VO 类型
   */
  astToIntermediateState(astInfo: ASTClassInfo, filePath: string): IntermediateState {
    const methods = new Map<string, MethodDefinition>();

    // 转换方法
    for (const astMethod of astInfo.methods) {
      const method = this.convertASTMethodToMethodDefinition(astMethod);
      methods.set(method.name, method);
    }

    // 提取类名
    const className = this.extractServiceClassNameFromFilePath(filePath);

    return {
      metadata: {
        className,
        basePath: '',
        filePath,
        sourceType: 'target' as const,
      },
      methods,
      constructor: this.convertASTConstructorToConstructorDefinition(astInfo.constructor),
      imports: this.convertASTImportsToImportDeclarations(astInfo.imports),
    };
  }

  /**
   * 转换 AST 方法为方法定义
   */
  private convertASTMethodToMethodDefinition(astMethod: ASTMethod): MethodDefinition {
    return {
      name: astMethod.name,
      verb: 'Get', // Web Service 默认为 Get，实际不重要
      path: `/${astMethod.name}`,
      parameters: this.convertASTParametersToParameterDefinitions(astMethod.parameters),
      returnType: this.normalizeReturnType(astMethod.returnType),
      bodyText: astMethod.bodyText,
      decoratorOptions: {},
      sourceLocation: this.convertASTSourceLocationToSourceLocation(astMethod.sourceLocation),
    };
  }

  /**
   * 转换 AST 参数为参数定义
   * Web Service 参数特点：
   * - 无装饰器
   * - 直接使用 VO 类型
   * - 根据位置推断参数类型（第一个通常是 id，第二个是 body/query）
   */
  private convertASTParametersToParameterDefinitions(astParameters: ASTParameter[]): ParameterDefinition[] {
    return astParameters.map((param, index) => {
      // 根据参数位置和类型推断装饰器类型
      let decorator: 'Param' | 'Query' | 'Body' = 'Body';
      
      if (index === 0 && param.type === 'string') {
        // 第一个参数且类型为 string，通常是路径参数
        decorator = 'Param';
      } else if (param.optional || param.type.includes('?')) {
        // 可选参数通常是查询参数
        decorator = 'Query';
      }

      return {
        name: param.name,
        type: param.type,
        decorator,
        decoratorArgs: decorator === 'Param' ? ['id'] : [],
        optional: param.optional,
      };
    });
  }

  /**
   * 转换 AST 构造函数为构造函数定义
   */
  private convertASTConstructorToConstructorDefinition(astConstructor?: ASTConstructor): ConstructorDefinition {
    if (!astConstructor) {
      return { parameters: [] };
    }

    return {
      parameters: astConstructor.parameters.map(param => ({
        name: param.name,
        type: param.type,
        modifier: param.modifiers.includes('private') ? 'private' : 
                 param.modifiers.includes('protected') ? 'protected' :
                 param.modifiers.includes('public') ? 'public' : undefined,
      })),
    };
  }

  /**
   * 转换 AST 导入为导入声明
   */
  private convertASTImportsToImportDeclarations(astImports: ASTImport[]): ImportDeclaration[] {
    return astImports.map(astImport => ({
      specifiers: astImport.specifiers.map(spec => ({
        imported: spec.imported,
        local: spec.local,
      })),
      source: astImport.source,
      importType: astImport.importType,
    }));
  }

  /**
   * 转换 AST 源码位置为源码位置
   */
  private convertASTSourceLocationToSourceLocation(astLocation: ASTSourceLocation): SourceLocation {
    return {
      startLine: astLocation.startLine,
      endLine: astLocation.endLine,
      startColumn: astLocation.startColumn,
      endColumn: astLocation.endColumn,
    };
  }

  /**
   * 标准化返回类型
   */
  private normalizeReturnType(returnType: string): string {
    // 移除 Promise 包装
    if (returnType.startsWith('Promise<') && returnType.endsWith('>')) {
      return returnType.slice(8, -1);
    }
    return returnType;
  }

  /**
   * 从文件路径提取 Service 类名
   */
  private extractServiceClassNameFromFilePath(filePath: string): string {
    const fileName = filePath.split('/').pop() || '';
    const baseName = fileName.replace('.service.ts', '');
    return baseName.charAt(0).toUpperCase() + baseName.slice(1) + 'Service';
  }
}
