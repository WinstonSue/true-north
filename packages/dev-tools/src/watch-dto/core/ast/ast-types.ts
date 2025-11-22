/**
 * AST 结构类型定义 - DTO 专用
 * 定义 DTO 文件的 AST 解析结果类型
 */

import { SourceFile, ClassDeclaration } from 'ts-morph';

export interface ASTClassInfo {
  className: string;
  properties: ASTProperty[];
  imports: ASTImport[];
  sourceFile: SourceFile;
  classDeclaration: ClassDeclaration;
  /** DTO 类型: model, form, filter */
  dtoType: 'model' | 'form' | 'filter';
  /** 是否使用 export default */
  isDefaultExport?: boolean;
  /** 继承信息 */
  extends?: ASTExtends;
}

export interface ASTProperty {
  name: string;
  type: string;
  optional: boolean;
  decorators: ASTDecorator[];
  sourceLocation: ASTSourceLocation;
  /** 是否有初始化值 */
  hasInitializer?: boolean;
  /** 初始化值文本 */
  initializer?: string;
}

export interface ASTDecorator {
  name: string;
  arguments: ASTDecoratorArgument[];
}

export interface ASTDecoratorArgument {
  type: 'string' | 'object' | 'array' | 'other';
  value: string;
  rawText: string;
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

export interface ASTExtends {
  /** 父类名称 */
  className: string;
  /** 泛型参数 */
  typeArguments?: string[];
  /** 完整的 extends 表达式 */
  fullText: string;
}
