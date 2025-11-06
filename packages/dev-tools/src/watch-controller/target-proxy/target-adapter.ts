import {
  IntermediateState,
  ControllerMetadata,
  MethodDefinition,
  ConstructorDefinition,
  ImportDeclaration,
  ParameterDefinition,
  SourceLocation,
  ASTClassInfo,
  ASTMethod,
  ASTDecorator,
  ASTParameter,
  ASTConstructor,
  ASTImport,
  ASTSourceLocation,
} from '../core';
import { TargetAdapter } from '../core/adapters';

export class TargetProxyAdapter extends TargetAdapter {
  constructor() {
    super();
  }

  /**
   * 将 AST 结构转换为中间态
   * 包含 Target 代码的业务转换规则
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
   * 解析控制器元数据 - Target 业务规则
   */
  private parseControllerMetadata(astInfo: ASTClassInfo, filePath: string): ControllerMetadata {
    const className = astInfo.className;
    let basePath = '';

    // Target 代码通常没有 @Controller 装饰器，或者有不同的处理逻辑
    // 这里可以根据 Target 代码的特点进行定制化处理
    const controllerDecorator = astInfo.decorators.find((d) => d.name === 'Controller');
    if (controllerDecorator && controllerDecorator.arguments.length > 0) {
      const pathArg = controllerDecorator.arguments[0];
      if (pathArg.type === 'string') {
        basePath = pathArg.value;
      }
    }

    return {
      className,
      basePath,
      sourceType: 'target',
      filePath,
    };
  }

  /**
   * 解析方法定义 - Target 业务规则
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
   * 解析单个方法 - Target 业务规则
   * Target 代码可能没有 HTTP 装饰器，需要不同的识别逻辑
   */
  private parseMethod(astMethod: ASTMethod): MethodDefinition | null {
    const name = astMethod.name;
    const decorators = astMethod.decorators;

    // Target 代码的方法识别逻辑可能不同
    // 例如：可能通过方法名模式识别，或者有不同的装饰器
    const httpDecorator = decorators.find((d) => ['Get', 'Post', 'Put', 'Delete', 'Patch'].includes(d.name));

    // 如果没有 HTTP 装饰器，可能需要其他识别逻辑
    // 这里先保持和 Source 一样的逻辑，但可以根据需要定制
    if (!httpDecorator) {
      // Target 代码可能有不同的方法识别规则
      // 例如：所有 public 方法都被认为是 API 方法
      // 这里可以根据实际需求进行调整
      return null;
    }

    const verb = httpDecorator.name as 'Get' | 'Post' | 'Put' | 'Delete' | 'Patch';
    const { path, decoratorOptions } = this.parseHttpDecorator(httpDecorator);
    const parameters = this.parseParameters(astMethod.parameters);
    const returnType = astMethod.returnType;
    const bodyText = astMethod.bodyText;
    const sourceLocation = this.convertASTSourceLocation(astMethod.sourceLocation);

    return {
      name,
      verb,
      path: path || `/${name}`,
      parameters,
      returnType,
      bodyText,
      decoratorOptions,
      sourceLocation,
    };
  }

  /**
   * 解析 HTTP 装饰器 - Target 业务规则
   */
  private parseHttpDecorator(decorator: ASTDecorator): { path?: string; decoratorOptions?: Record<string, any> } {
    const args = decorator.arguments;
    let path: string | undefined;
    let decoratorOptions: Record<string, any> | undefined;

    if (args.length > 0) {
      const firstArg = args[0];
      if (firstArg.type === 'string') {
        path = firstArg.value;
      }
    }

    if (args.length > 1) {
      const secondArg = args[1];
      if (secondArg.type === 'object') {
        try {
          decoratorOptions = this.parseObjectLiteral(secondArg.rawText);
        } catch (e) {
          // 解析失败，忽略
        }
      }
    }

    return { path, decoratorOptions };
  }

  /**
   * 解析方法参数 - Target 业务规则
   */
  private parseParameters(astParameters: ASTParameter[]): ParameterDefinition[] {
    return astParameters.map((param) => {
      const name = param.name;
      const type = param.type;
      const optional = param.optional;

      // Target 代码的参数装饰器可能有不同的处理逻辑
      let decorator: 'Param' | 'Query' | 'Body' = 'Body';
      let decoratorArgs: string[] = [];

      const paramDecorator = param.decorators.find((d) => ['Param', 'Query', 'Body'].includes(d.name));

      if (paramDecorator) {
        decorator = paramDecorator.name as 'Param' | 'Query' | 'Body';
        decoratorArgs = paramDecorator.arguments.map((arg) => {
          if (arg.type === 'string') {
            return arg.value;
          }
          return arg.rawText;
        });
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
   * 解析构造函数 - Target 业务规则
   */
  private parseConstructor(astConstructor?: ASTConstructor): ConstructorDefinition {
    if (!astConstructor) {
      return { parameters: [] };
    }

    // Target 代码的构造函数可能有不同的处理逻辑
    const parameters = astConstructor.parameters.map((param) => ({
      name: param.name,
      type: param.type,
      modifier: param.modifiers.join(' ') as 'private' | 'protected' | 'public' | 'readonly' | undefined,
    }));

    return { parameters };
  }

  /**
   * 解析导入声明 - Target 业务规则
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

  /**
   * 解析对象字面量
   */
  private parseObjectLiteral(text: string): Record<string, any> {
    return this.safeParseObjectLiteral(text);
  }
}
