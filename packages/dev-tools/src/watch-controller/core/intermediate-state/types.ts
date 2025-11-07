/**
 * Dev-Tools 中间态数据结构
 * 用于统一表示 Server 和 Desktop Controller 的结构
 */

import { ASTClassInfo } from '../ast/ast-types';

export interface IntermediateState {
  /** 控制器元信息 */
  metadata: ControllerMetadata;
  /** 方法集合 */
  methods: Map<string, MethodDefinition>;
  /** 构造函数信息 */
  constructor: ConstructorDefinition;
  /** 导入声明 */
  imports: ImportDeclaration[];
  /** AST 原始数据，用于代码恢复 */
  astData: ASTClassInfo;
  /** 原始源码，用于快速恢复 */
  code?: string;
}

export interface ControllerMetadata {
  /** 类名 */
  className: string;
  /** 控制器基础路径 */
  basePath: string;
  /** 文件路径 */
  filePath: string;
}

export interface MethodDefinition {
  /** 方法名 */
  name: string;
  /** HTTP 动词 */
  verb: 'Get' | 'Post' | 'Put' | 'Delete' | 'Patch';
  /** 路由路径 */
  path: string;
  /** 参数定义 */
  parameters: ParameterDefinition[];
  /** 返回类型 */
  returnType: string;
  /** 方法体文本 */
  bodyText: string;
  /** 装饰器选项 */
  decoratorOptions?: Record<string, any>;
  /** 源码位置信息 */
  sourceLocation: SourceLocation;
}

export interface ParameterDefinition {
  /** 参数名 */
  name: string;
  /** 参数类型 */
  type: string;
  /** 装饰器类型 */
  decorator: 'Param' | 'Query' | 'Body';
  /** 装饰器参数 */
  decoratorArgs?: string[];
  /** 是否可选 */
  optional: boolean;
}

export interface ConstructorDefinition {
  /** 构造函数参数 */
  parameters: ConstructorParameter[];
  /** 服务实例化代码 */
  serviceInstantiation?: string;
}

export interface ConstructorParameter {
  /** 参数名 */
  name: string;
  /** 参数类型 */
  type: string;
  /** 访问修饰符 */
  modifier?: 'private' | 'protected' | 'public' | 'readonly';
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
