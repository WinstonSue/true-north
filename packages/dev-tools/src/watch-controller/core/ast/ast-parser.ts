/**
 * 通用 AST 解析器
 * 提供纯粹的 TypeScript AST 解析功能，不包含任何业务逻辑
 */

import {
  Project,
  MethodDeclaration,
  ParameterDeclaration,
  Decorator,
  ConstructorDeclaration,
  SyntaxKind,
  PropertyDeclaration,
} from 'ts-morph';
import {
  ASTClassInfo,
  ASTDecorator,
  ASTDecoratorArgument,
  ASTMethod,
  ASTParameter,
  ASTProperty,
  ASTConstructor,
  ASTImport,
  ASTImportSpecifier,
  ASTSourceLocation,
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
      properties: this.parseProperties(classDeclaration.getProperties()),
      methods: this.parseMethods(classDeclaration.getMethods()),
      constructor: this.parseConstructor(classDeclaration.getConstructors()[0]),
      imports: this.parseImports(sourceFile.getImportDeclarations()),
      sourceFile,
      classDeclaration,
      isDefaultExport: this.checkIsDefaultExport(classDeclaration),
    };
  }

  /**
   * 解析装饰器
   */
  private parseDecorators(decorators: Decorator[]): ASTDecorator[] {
    return decorators.map((decorator) => ({
      name: decorator.getName(),
      arguments: this.parseDecoratorArguments(decorator),
    }));
  }

  /**
   * 解析装饰器参数
   */
  private parseDecoratorArguments(decorator: Decorator): ASTDecoratorArgument[] {
    return decorator.getArguments().map((arg) => {
      const rawText = arg.getText();
      const kind = arg.getKind();

      let type: 'string' | 'object' | 'other' = 'other';
      let value = rawText;

      if (kind === SyntaxKind.StringLiteral || kind === SyntaxKind.NoSubstitutionTemplateLiteral) {
        // StringLiteral
        type = 'string';
        value = rawText.slice(1, -1); // 移除引号
      } else if (kind === SyntaxKind.ObjectLiteralExpression) {
        // ObjectLiteralExpression
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
   * 解析类属性
   */
  private parseProperties(properties: PropertyDeclaration[]): ASTProperty[] {
    return properties.map((property) => {
      const modifiers: string[] = [];
      property.getModifiers().forEach((modifier) => {
        // 过滤掉装饰器，只保留修饰符
        if (modifier.getKind() !== SyntaxKind.Decorator) {
          modifiers.push(modifier.getText());
        }
      });

      return {
        name: property.getName(),
        type: property.getType().getText(),
        modifiers,
        initializer: property.getInitializer()?.getText(),
        decorators: this.parseDecorators(property.getDecorators()),
      };
    });
  }

  /**
   * 解析方法
   */
  private parseMethods(methods: MethodDeclaration[]): ASTMethod[] {
    return methods.map((method) => {
      return {
        name: method.getName(),
        decorators: this.parseDecorators(method.getDecorators()),
        parameters: this.parseParameters(method.getParameters()),
        returnType: this.parseReturnType(method),
        bodyText: method.getBodyText() || '',
        sourceLocation: this.getSourceLocation(method),
        methodDeclaration: method,
        modifiers: this.parseMethodModifiers(method),
      };
    });
  }

  /**
   * 解析方法修饰符（过滤掉装饰器）
   */
  private parseMethodModifiers(method: MethodDeclaration): string[] {
    const modifiers: string[] = [];
    method.getModifiers().forEach((modifier) => {
      // 通过 AST 节点类型过滤掉装饰器
      // 只保留真正的修饰符（如 public, private, static, async 等）
      if (modifier.getKind() !== SyntaxKind.Decorator) {
        modifiers.push(modifier.getText());
      }
    });
    return modifiers;
  }

  /**
   * 解析参数
   */
  private parseParameters(parameters: ParameterDeclaration[]): ASTParameter[] {
    return parameters.map((param) => ({
      name: param.getName(),
      type: param.getType().getText(),
      optional: param.hasQuestionToken(),
      decorators: this.parseDecorators(param.getDecorators()),
      showType: Boolean(param.getTypeNode()),
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
      parameters: constructor.getParameters().map((param) => ({
        name: param.getName(),
        type: param.getType().getText(),
        modifiers: param.getModifiers().map((m) => m.getText()),
      })),
    };
  }

  /**
   * 解析导入声明
   */
  private parseImports(imports: any[]): ASTImport[] {
    return imports.map((importDecl) => {
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

  /**
   * 检查类是否使用 export default
   */
  private checkIsDefaultExport(classDeclaration: any): boolean {
    // 检查类声明是否有 export default 修饰符
    const sourceFile = classDeclaration.getSourceFile();
    const exportAssignments = sourceFile.getExportAssignments();

    // 检查是否有 export default ClassName
    for (const exportAssignment of exportAssignments) {
      if (exportAssignment.isExportEquals() === false) {
        const expression = exportAssignment.getExpression();
        if (expression && expression.getText() === classDeclaration.getName()) {
          return true;
        }
      }
    }

    // 检查类声明本身是否有 default 修饰符
    return classDeclaration.hasModifier(SyntaxKind.DefaultKeyword);
  }
}
