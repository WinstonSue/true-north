/**
 * DTO 中间态数据结构
 * 用于统一表示 DTO 和 VO 的结构
 */

import { ASTClassInfo } from '../ast/ast-types';

export interface IntermediateState {
  /** DTO 元信息 */
  metadata: DtoMetadata;
  /** 字段集合 */
  fields: Map<string, FieldDefinition>;
  /** 导入声明 */
  imports: ImportDeclaration[];
  /** AST 原始数据，用于代码恢复 */
  astData: ASTClassInfo;
  /** 原始源码，用于快速恢复 */
  code?: string;
  /** 继承信息 */
  inheritance?: InheritanceInfo;
}

export interface DtoMetadata {
  /** 类名 */
  className: string;
  /** DTO 类型 */
  dtoType: 'model' | 'form' | 'filter';
  /** 文件路径 */
  filePath: string;
  /** 对应的 VO 名称 */
  voName: string;
}

export interface FieldDefinition {
  /** 字段名 */
  name: string;
  /** 字段类型 */
  type: string;
  /** 是否可选 */
  optional: boolean;
  /** 装饰器 */
  decorators: DecoratorInfo[];
  /** 源码位置信息 */
  sourceLocation: SourceLocation;
  /** 是否有初始化值 */
  hasInitializer?: boolean;
  /** 初始化值 */
  initializer?: string;
}

export interface DecoratorInfo {
  /** 装饰器名称 */
  name: string;
  /** 装饰器参数 */
  args: string[];
}

export interface ImportDeclaration {
  /** 导入的标识符 */
  specifiers: ImportSpecifier[];
  /** 模块路径 */
  source: string;
  /** 导入类型 */
  importType: 'default' | 'named' | 'namespace' | 'type';
}

export interface ImportSpecifier {
  /** 导入名称 */
  imported: string;
  /** 本地名称 */
  local: string;
}

export interface SourceLocation {
  /** 开始行号 */
  startLine: number;
  /** 结束行号 */
  endLine: number;
  /** 开始列号 */
  startColumn: number;
  /** 结束列号 */
  endColumn: number;
}

export interface InheritanceInfo {
  /** 继承类型: 'pick', 'omit', 'intersection', 'extends' */
  type: 'pick' | 'omit' | 'intersection' | 'extends' | 'none';
  /** 父类名称 */
  baseClass?: string;
  /** Pick/Omit 的字段列表 */
  fields?: string[];
  /** 交集类型列表 */
  types?: string[];
  /** 完整的继承表达式 */
  fullExpression?: string;
}
