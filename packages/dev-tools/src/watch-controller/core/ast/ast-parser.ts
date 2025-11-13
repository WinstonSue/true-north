/**
 * 通用 AST 解析器
 * 提供纯粹的 TypeScript AST 解析功能，不包含任何业务逻辑
 */

import { Project, MethodDeclaration, ParameterDeclaration, Decorator, ConstructorDeclaration } from 'ts-morph';
import { 
  ASTClassInfo, 
  ASTDecorator, 
  ASTDecoratorArgument, 
  ASTMethod, 
  ASTParameter, 
  ASTConstructor, 
  ASTImport, 
  ASTImportSpecifier, 
  ASTSourceLocation 
} from './ast-types';

/**
 * 通用 AST 解析器
 * 只负责解析 TypeScript 代码为 AST 结构，不包含任何业务逻辑
 */
export class ASTParser {
  private project: Project;

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
   * 解析 TypeScript 代码为 AST 结构
   */
  parse(code: string, filePath: string): ASTClassInfo {
    const sourceFile = this.project.createSourceFile(filePath, code, { overwrite: true });
    
    const classDeclaration = sourceFile.getClasses()[0];
    if (!classDeclaration) {
      throw new Error(`No class found in ${filePath}`);
    }

    const className = classDeclaration.getName();
    if (!className) {
      throw new Error(`Class name not found in ${filePath}`);
    }

    return {
      className,
      decorators: this.parseDecorators(classDeclaration.getDecorators()),
      methods: this.parseMethods(classDeclaration.getMethods()),
      constructor: this.parseConstructor(classDeclaration.getConstructors()[0]),
      imports: this.parseImports(sourceFile.getImportDeclarations()),
      sourceFile,
      classDeclaration,
    };
  }

  /**
   * 解析装饰器
   */
  private parseDecorators(decorators: Decorator[]): ASTDecorator[] {
    return decorators.map(decorator => ({
      name: decorator.getName(),
      arguments: this.parseDecoratorArguments(decorator),
    }));
  }

  /**
   * 解析装饰器参数
   */
  private parseDecoratorArguments(decorator: Decorator): ASTDecoratorArgument[] {
    return decorator.getArguments().map(arg => {
      const rawText = arg.getText();
      const kind = arg.getKind();
      
      let type: 'string' | 'object' | 'other' = 'other';
      let value = rawText;

      if (kind === 10 || kind === 11) { // StringLiteral
        type = 'string';
        value = rawText.slice(1, -1); // 移除引号
      } else if (kind === 201) { // ObjectLiteralExpression
        type = 'object';
      }

      return {
        type,
        value,
        rawText,
      };
    });
  }

  /**
   * 解析方法
   */
  private parseMethods(methods: MethodDeclaration[]): ASTMethod[] {
    return methods.map(method => ({
      name: method.getName(),
      decorators: this.parseDecorators(method.getDecorators()),
      parameters: this.parseParameters(method.getParameters()),
      returnType: this.parseReturnType(method),
      bodyText: method.getBodyText() || '',
      sourceLocation: this.getSourceLocation(method),
      methodDeclaration: method,
    }));
  }

  /**
   * 解析参数
   */
  private parseParameters(parameters: ParameterDeclaration[]): ASTParameter[] {
    return parameters.map(param => ({
      name: param.getName(),
      type: param.getType().getText(),
      optional: param.hasQuestionToken(),
      decorators: this.parseDecorators(param.getDecorators()),
    }));
  }

  /**
   * 解析构造函数
   */
  private parseConstructor(constructor?: ConstructorDeclaration): ASTConstructor | undefined {
    if (!constructor) {
      return undefined;
    }

    return {
      parameters: constructor.getParameters().map(param => ({
        name: param.getName(),
        type: param.getType().getText(),
        modifiers: param.getModifiers().map(m => m.getText()),
      })),
    };
  }

  /**
   * 解析导入声明
   */
  private parseImports(imports: any[]): ASTImport[] {
    return imports.map(importDecl => {
      const source = importDecl.getModuleSpecifierValue();
      const namedImports = importDecl.getNamedImports();
      const defaultImport = importDecl.getDefaultImport()?.getText();
      const namespaceImport = importDecl.getNamespaceImport()?.getText();

      // 构建 specifiers
      const specifiers: ASTImportSpecifier[] = [];
      
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

      namedImports.forEach((namedImport: any) => {
        const imported = namedImport.getName();
        const local = namedImport.getAliasNode()?.getText() || imported;
        specifiers.push({
          imported,
          local,
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
  private parseReturnType(method: MethodDeclaration): string {
    const returnType = method.getReturnTypeNode();
    if (returnType) {
      return returnType.getText();
    }
    
    // 尝试从类型推断获取
    const type = method.getReturnType();
    return type.getText();
  }

  /**
   * 获取源码位置信息
   */
  private getSourceLocation(method: MethodDeclaration): ASTSourceLocation {
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
}
