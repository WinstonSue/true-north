import {
  ASTClassInfo,
  ASTMethod,
  ASTParameter,
  ASTConstructor,
  ASTImport,
  ASTSourceLocation,
} from '../core/ast';
import {
  IntermediateState,
  MethodDefinition,
  ControllerMetadata,
  ConstructorDefinition,
  ImportDeclaration,
  ParameterDefinition,
  SourceLocation,
  BaseParser,
} from '../core/intermediate-state';

export class TargetApiParser extends BaseParser {
  constructor(filePath: string) {
    super(filePath);
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
      astData: astInfo,
    };
  }

  /**
   * 解析控制器元数据 - Target API 业务规则
   */
  private parseControllerMetadata(astInfo: ASTClassInfo, filePath: string): ControllerMetadata {
    return {
      className: astInfo.className,
      basePath: '',
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

    const returnType = astMethod.returnType;
    const bodyText = astMethod.bodyText;
    const sourceLocation = this.convertASTSourceLocation(astMethod.sourceLocation);

    // 从方法体中提取路径和 HTTP 动词
    const { path, verb } = this.extractPathAndVerbFromBody(bodyText);
    
    // 基于路径解析参数装饰器
    const parameters = this.parseParameters(astMethod.parameters, path);

    return {
      name,
      verb,
      path,
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
  private parseParameters(astParameters: ASTParameter[], path: string = ''): ParameterDefinition[] {
    // 从路径中提取动态参数
    const pathParams = this.extractPathParams(path);
    
    return astParameters.map((param) => {
      const name = param.name;
      const type = param.type;
      const optional = param.optional;

      // Target API 参数装饰器推断逻辑
      let decorator: 'Param' | 'Query' | 'Body' = 'Body';
      let decoratorArgs: string[] = [];

      // 优先根据路径中的动态参数判断
      if (pathParams.includes(name)) {
        decorator = 'Param';
        decoratorArgs = [name];
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
   * 从路径中提取动态参数名
   * 例如: "/todo/update/:relatedType/:id" => ["relatedType", "id"]
   */
  private extractPathParams(path: string): string[] {
    const paramMatches = path.match(/:(\w+)/g);
    if (!paramMatches) return [];
    
    return paramMatches.map(match => match.substring(1)); // 移除 : 前缀
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
   * 从方法体中提取路径和 HTTP 动词
   */
  private extractPathAndVerbFromBody(bodyText: string): { path: string; verb: 'Get' | 'Post' | 'Put' | 'Delete' | 'Patch' } {
    // 默认值
    let path = '';
    let verb: 'Get' | 'Post' | 'Put' | 'Delete' | 'Patch' = 'Get';

    try {
      // 匹配 request 调用中的 method 和路径
      // 例如: request<TodoVO.TodoVo>({ method: 'put' })(`/todo/update/${relatedType}/${id}`, body);
      const methodMatch = bodyText.match(/method:\s*['"](\w+)['"]/);
      if (methodMatch) {
        const method = methodMatch[1].toLowerCase();
        switch (method) {
          case 'get':
            verb = 'Get';
            break;
          case 'post':
            verb = 'Post';
            break;
          case 'put':
            verb = 'Put';
            break;
          case 'remove':
          case 'delete':
            verb = 'Delete';
            break;
          case 'patch':
            verb = 'Patch';
            break;
          default:
            verb = 'Get';
        }
      }

      // 匹配路径模板字符串
      const pathMatch = bodyText.match(/\(`([^`]+)`/);
      if (pathMatch) {
        let extractedPath = pathMatch[1];
        // 将模板字符串中的 ${变量} 转换为 :变量 格式
        extractedPath = extractedPath.replace(/\$\{(\w+)\}/g, '/:$1');
        // 清理多余的斜杠
        extractedPath = extractedPath.replace(/\/+/g, '/');
        path = extractedPath;
      }
    } catch (error) {
      console.warn('解析方法体失败:', error);
    }

    return { path, verb };
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
