/**
 * AST 结构类型定义
 * 定义通用的 AST 解析结果类型，不包含任何业务逻辑
 */

import { SourceFile, ClassDeclaration, MethodDeclaration } from 'ts-morph';

export interface ASTClassInfo {
  className: string;
  decorators: ASTDecorator[];
  properties: ASTProperty[];
  methods: ASTMethod[];
  constructor?: ASTConstructor;
  imports: ASTImport[];
  sourceFile: SourceFile;
  classDeclaration: ClassDeclaration;
  /** 是否使用 export default */
  isDefaultExport?: boolean;
}

export interface ASTDecorator {
  name: string;
  arguments: ASTDecoratorArgument[];
}

export interface ASTDecoratorArgument {
  type: 'string' | 'object' | 'other';
  value: string;
  rawText: string;
}

export interface ASTMethod {
  name: string;
  decorators: ASTDecorator[];
  parameters: ASTParameter[];
  returnType: string;
  bodyText: string;
  sourceLocation: ASTSourceLocation;
  methodDeclaration: MethodDeclaration;
  /** 方法修饰符，如 'static', 'async' 等 */
  modifiers?: string[];
  /** 是否显示返回类型 */
  showReturnType?: boolean;
}

export interface ASTParameter {
  name: string;
  type: string;
  optional: boolean;
  decorators: ASTDecorator[];
  /** 是否显示参数类型 */
  showType?: boolean;
}

export interface ASTProperty {
  name: string;
  type: string;
  modifiers: string[];
  initializer?: string;
  decorators: ASTDecorator[];
}

export interface ASTConstructor {
  parameters: ASTConstructorParameter[];
}

export interface ASTConstructorParameter {
  name: string;
  type: string;
  modifiers: string[];
}

export interface ASTImport {
  source: string;
  specifiers: ASTImportSpecifier[];
  importType: 'default' | 'named' | 'namespace' | 'type';
}

export interface ASTImportSpecifier {
  imported: string;
  local: string;
}

export interface ASTSourceLocation {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}
