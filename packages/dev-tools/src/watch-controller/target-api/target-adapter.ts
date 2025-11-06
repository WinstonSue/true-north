import {
  IntermediateState,
  MethodDefinition,
  ControllerMetadata,
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

export class TargetApiAdapter extends TargetAdapter {
  constructor() {
    super();
  }

  /**
   * 解析目标代码为中间态
   */
  parseToIntermediateState(code: string, filePath: string): IntermediateState {
    const astInfo = this.astParser.parse(code, filePath);
    return this.astToIntermediateState(astInfo, filePath);
  }

  /**
   * 将 AST 结构转换为中间态
   * 包含 Target API 代码的业务转换规则
   */
  astToIntermediateState(astInfo: ASTClassInfo, filePath: string): IntermediateState {
    const metadata = this.parseControllerMetadata(astInfo, filePath);
    const methods = this.parseMethods(astInfo.methods);
    const constructor = this.parseConstructor(astInfo.constructor);
    const imports = this.parseImports(astInfo.imports);

    return {
      metadata,
      methods,
      constructor,
      imports,
    };
  }

  /**
   * 解析控制器元数据 - Target API 业务规则
   */
  private parseControllerMetadata(astInfo: ASTClassInfo, filePath: string): ControllerMetadata {
    return {
      className: astInfo.className,
      basePath: '',
      sourceType: 'target',
      filePath,
    };
  }

  /**
   * 解析方法定义 - Target API 业务规则
   */
  private parseMethods(astMethods: ASTMethod[]): Map<string, MethodDefinition> {
    const methods = new Map<string, MethodDefinition>();

    for (const astMethod of astMethods) {
      const methodDef = this.parseMethod(astMethod);
      if (methodDef) {
        methods.set(methodDef.name, methodDef);
      }
    }

    return methods;
  }

  /**
   * 解析单个方法 - Target API 业务规则
   */
  private parseMethod(astMethod: ASTMethod): MethodDefinition | null {
    const name = astMethod.name;

    // Target API 方法通常是 static async 方法
    // 不需要检查 HTTP 装饰器，因为 API 控制器是生成的代码

    const parameters = this.parseParameters(astMethod.parameters);
    const returnType = astMethod.returnType;
    const bodyText = astMethod.bodyText;
    const sourceLocation = this.convertASTSourceLocation(astMethod.sourceLocation);

    return {
      name,
      verb: 'Get', // 占位符，Target API 不使用 HTTP 动词
      path: `/${name}`, // 占位符，Target API 不使用路径
      parameters,
      returnType,
      bodyText,
      decoratorOptions: {},
      sourceLocation,
    };
  }

  /**
   * 解析方法参数 - Target API 业务规则
   */
  private parseParameters(astParameters: ASTParameter[]): ParameterDefinition[] {
    return astParameters.map((param) => {
      const name = param.name;
      const type = param.type;
      const optional = param.optional;

      // Target API 参数装饰器推断逻辑
      let decorator: 'Param' | 'Query' | 'Body' = 'Body';
      let decoratorArgs: string[] = [];

      // 根据参数名推断装饰器类型
      if (name === 'id') {
        decorator = 'Param';
        decoratorArgs = ['id'];
      } else if (name === 'params' || name === 'query') {
        decorator = 'Query';
      } else if (name === 'body') {
        decorator = 'Body';
      }

      return {
        name,
        type,
        optional,
        decorator,
        decoratorArgs,
      };
    });
  }

  /**
   * 解析构造函数 - Target API 业务规则
   */
  private parseConstructor(astConstructor?: ASTConstructor): ConstructorDefinition {
    if (!astConstructor) {
      return { parameters: [] };
    }

    const parameters = astConstructor.parameters.map((param) => ({
      name: param.name,
      type: param.type,
      modifier: param.modifiers.join(' ') as 'private' | 'protected' | 'public' | 'readonly' | undefined,
    }));

    return { parameters };
  }

  /**
   * 解析导入声明 - Target API 业务规则
   */
  private parseImports(astImports: ASTImport[]): ImportDeclaration[] {
    return astImports.map((astImport) => ({
      specifiers: astImport.specifiers,
      source: astImport.source,
      importType: astImport.importType,
    }));
  }

  /**
   * 转换 AST 源码位置信息
   */
  private convertASTSourceLocation(astLocation: ASTSourceLocation): SourceLocation {
    return {
      startLine: astLocation.startLine,
      startColumn: astLocation.startColumn,
      endLine: astLocation.endLine,
      endColumn: astLocation.endColumn,
    };
  }
}
