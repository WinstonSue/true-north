/**
 * AST 解析器统一入口
 */

export { BaseASTParser } from './base-parser';
export { SourceASTParser } from './source-parser';
export { TargetASTParser } from './target-parser';

// 便捷工厂函数
export function createSourceParser() {
  return new (require('./source-parser').SourceASTParser)();
}

export function createTargetParser() {
  return new (require('./target-parser').TargetASTParser)();
}
