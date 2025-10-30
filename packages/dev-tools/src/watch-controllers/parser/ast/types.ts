/**
 * AST 解析器相关类型定义
 */

export interface ASTMethodDecoratorInfo {
  name: string;
  verb: string;
  path: string;
  paramStyle: 'none' | 'id' | 'id+body' | 'query' | 'body';
  description?: string;
  paramTypes?: {
    idType?: string;
    bodyType?: string;
    queryType?: string;
  };
  returnType?: string;
  fullSignature?: string;
}

export interface ASTControllerInfo {
  className: string;
  basePath?: string;
  methods: Map<string, ASTMethodDecoratorInfo>;
  constructorServiceTypes: string[];
}

export interface ASTClassBodyRange {
  start: number;
  end: number;
}
