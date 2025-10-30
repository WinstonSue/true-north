/**
 * Controller 解析器公共类型定义
 */

export interface MethodDecoratorInfo {
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

export interface ControllerInfo {
  className: string;
  basePath?: string;
  methods: MethodDecoratorInfo[];
  constructorServiceTypes: string[];
}

export interface ClassBodyRange {
  start: number;
  end: number;
}

export interface MethodOccurrence {
  name: string;
  start: number;
  end: number;
  fullMatch: string;
}
