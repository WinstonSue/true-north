/**
 * 基础 AST 解析器
 * 提供通用的 AST 解析功能
 */

import { Project, SourceFile, ClassDeclaration, MethodDeclaration, ParameterDeclaration, Decorator } from 'ts-morph';
import { IntermediateState, ControllerMetadata, MethodDefinition, ConstructorDefinition, ImportDeclaration, ParameterDefinition, SourceLocation, ConstructorParameter } from '../intermediate-state';

export abstract class BaseASTParser {
  protected project: Project;

  constructor() {
    this.project = new Project({
      useInMemoryFileSystem: true,
      compilerOptions: {
        target: 99, // Latest
        module: 1, // CommonJS
        strict: false,
        skipLibCheck: true,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      },
    });
  }

  /**
   * 解析 TypeScript 代码为 AST
   */
  protected parseToAST(code: string, filePath: string): { sourceFile: SourceFile; classDeclaration: ClassDeclaration } {
    const sourceFile = this.project.createSourceFile(filePath, code, { overwrite: true });
    
    const classDeclaration = sourceFile.getClasses()[0];
    if (!classDeclaration) {
      throw new Error(`No class found in ${filePath}`);
    }

    return { sourceFile, classDeclaration };
  }

  /**
   * 解析控制器元数据
   */
  protected parseControllerMetadata(classDeclaration: ClassDeclaration, filePath: string, sourceType: 'source' | 'target'): ControllerMetadata {
    const className = classDeclaration.getName();
    if (!className) {
      throw new Error(`Class name not found in ${filePath}`);
    }

    let basePath = '';
    
    // 解析 @Controller 装饰器的路径参数
    const controllerDecorator = classDeclaration.getDecorators().find(d => d.getName() === 'Controller');
    if (controllerDecorator) {
      const args = controllerDecorator.getArguments();
      if (args.length > 0) {
        const pathArg = args[0];
        if (pathArg.getKind() === 10 || pathArg.getKind() === 11) { // StringLiteral
          basePath = pathArg.getText().slice(1, -1); // 移除引号
        }
      }
    }

    return {
      className,
      basePath,
      sourceType,
      filePath,
    };
  }

  /**
   * 解析方法定义
   */
  protected parseMethods(classDeclaration: ClassDeclaration, sourceType: 'source' | 'target'): Map<string, MethodDefinition> {
    const methods = new Map<string, MethodDefinition>();
    const methodDeclarations = classDeclaration.getMethods();

    for (const method of methodDeclarations) {
      const methodDef = this.parseMethod(method, sourceType);
      if (methodDef) {
        methods.set(methodDef.name, methodDef);
      }
    }

    return methods;
  }

  /**
   * 解析单个方法
   */
  protected parseMethod(method: MethodDeclaration, sourceType: 'source' | 'target'): MethodDefinition | null {
    const name = method.getName();
    const decorators = method.getDecorators();
    
    // 查找 HTTP 动词装饰器
    const httpDecorator = decorators.find(d => 
      ['Get', 'Post', 'Put', 'Delete', 'Patch'].includes(d.getName())
    );

    if (!httpDecorator) {
      return null; // 不是 HTTP 方法
    }

    const verb = httpDecorator.getName() as 'Get' | 'Post' | 'Put' | 'Delete' | 'Patch';
    const { path, decoratorOptions } = this.parseHttpDecorator(httpDecorator);
    const parameters = this.parseParameters(method.getParameters());
    const returnType = this.parseReturnType(method);
    const bodyText = method.getBodyText() || '';
    const bodyHash = this.generateBodyHash(bodyText);
    const sourceLocation = this.getSourceLocation(method);

    return {
      name,
      verb,
      path: path || `/${name}`,
      parameters,
      returnType,
      bodyText,
      bodyHash,
      decoratorOptions,
      sourceLocation,
    };
  }

  /**
   * 解析 HTTP 装饰器
   */
  protected parseHttpDecorator(decorator: Decorator): { path?: string; decoratorOptions?: Record<string, any> } {
    const args = decorator.getArguments();
    let path: string | undefined;
    let decoratorOptions: Record<string, any> | undefined;

    if (args.length > 0) {
      const firstArg = args[0];
      
      if (firstArg.getKind() === 10 || firstArg.getKind() === 11) { // StringLiteral 或其他字符串类型
        const rawText = firstArg.getText();
        path = rawText.slice(1, -1); // 移除引号
      }
    }

    if (args.length > 1) {
      const secondArg = args[1];
      if (secondArg.getKind() === 201) { // ObjectLiteralExpression
        try {
          decoratorOptions = this.parseObjectLiteral(secondArg.getText());
        } catch (e) {
          // 解析失败，忽略
        }
      }
    }

    return { path, decoratorOptions };
  }

  /**
   * 解析方法参数
   */
  protected parseParameters(parameters: ParameterDeclaration[]): ParameterDefinition[] {
    return parameters.map(param => {
      const name = param.getName();
      const type = param.getType().getText();
      const optional = param.hasQuestionToken();

      // 解析参数装饰器
      let decorator: 'Param' | 'Query' | 'Body' = 'Body';
      let decoratorArgs: string[] = [];

      const paramDecorator = param.getDecorators().find(d => 
        ['Param', 'Query', 'Body'].includes(d.getName())
      );

      if (paramDecorator) {
        decorator = paramDecorator.getName() as 'Param' | 'Query' | 'Body';
        const args = paramDecorator.getArguments();
        decoratorArgs = args.map(arg => {
          if (arg.getKind() === 10 || arg.getKind() === 11) { // StringLiteral
            return arg.getText().slice(1, -1); // 移除引号
          }
          return arg.getText();
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
   * 解析构造函数
   */
  protected parseConstructor(classDeclaration: ClassDeclaration, _sourceType: 'source' | 'target'): ConstructorDefinition {
    const constructors = classDeclaration.getConstructors();
    
    if (constructors.length === 0) {
      return { parameters: [] };
    }

    const constructor = constructors[0];
    const parameters = constructor.getParameters().map(param => {
      const name = param.getName();
      const type = param.getType().getText();
      const modifier = param.getModifiers().map(m => m.getText()).join(' ') as 'private' | 'protected' | 'public' | 'readonly' | undefined;

      return {
        name,
        type,
        modifier,
      };
    });

    return { parameters };
  }

  /**
   * 解析导入声明
   */
  protected parseImports(sourceFile: SourceFile): ImportDeclaration[] {
    return sourceFile.getImportDeclarations().map(importDecl => {
      const source = importDecl.getModuleSpecifierValue();
      const namedImports = importDecl.getNamedImports().map(ni => ni.getName());
      const defaultImport = importDecl.getDefaultImport()?.getText();
      const namespaceImport = importDecl.getNamespaceImport()?.getText();

      // 构建 specifiers
      const specifiers = [];
      
      if (defaultImport) {
        specifiers.push({
          imported: 'default',
          local: defaultImport,
        });
      }

      if (namespaceImport) {
        specifiers.push({
          imported: '*',
          local: namespaceImport,
        });
      }

      namedImports.forEach(name => {
        specifiers.push({
          imported: name,
          local: name,
        });
      });

      // 确定导入类型
      let importType: 'default' | 'named' | 'namespace' | 'type' = 'named';
      if (defaultImport) importType = 'default';
      if (namespaceImport) importType = 'namespace';
      if (importDecl.isTypeOnly()) importType = 'type';

      return {
        specifiers,
        source,
        importType,
      };
    });
  }

  /**
   * 解析返回类型
   */
  protected parseReturnType(method: MethodDeclaration): string {
    const returnType = method.getReturnTypeNode();
    if (returnType) {
      return returnType.getText();
    }
    
    // 尝试从类型推断获取
    const type = method.getReturnType();
    return type.getText();
  }

  /**
   * 生成方法体哈希
   */
  protected generateBodyHash(bodyText: string): string {
    // 简单的哈希实现
    let hash = 0;
    for (let i = 0; i < bodyText.length; i++) {
      const char = bodyText.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return hash.toString(16);
  }

  /**
   * 获取源码位置信息
   */
  protected getSourceLocation(method: MethodDeclaration): SourceLocation {
    const start = method.getStart();
    const end = method.getEnd();
    const sourceFile = method.getSourceFile();
    const startLineAndColumn = sourceFile.getLineAndColumnAtPos(start);
    const endLineAndColumn = sourceFile.getLineAndColumnAtPos(end);

    return {
      startLine: startLineAndColumn.line,
      startColumn: startLineAndColumn.column,
      endLine: endLineAndColumn.line,
      endColumn: endLineAndColumn.column,
    };
  }

  /**
   * 解析对象字面量
   */
  protected parseObjectLiteral(text: string): Record<string, any> {
    try {
      return eval(`(${text})`);
    } catch (e) {
      return {};
    }
  }

  /**
   * 抽象方法：解析为中间态
   */
  abstract parseToIntermediateState(code: string, filePath: string): IntermediateState;
}
