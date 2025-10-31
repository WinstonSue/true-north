/**
 * 统一的 AST 解析器接口
 * 支持将 TypeScript 代码解析为中间态
 * 
 * @deprecated 请使用新的 AST 解析器架构：
 * - SourceASTParser: 解析服务端源码
 * - TargetASTParser: 解析桌面端目标代码
 */

import { IntermediateState } from './intermediate-state';
import { createSourceParser, createTargetParser } from './ast';

export class UnifiedASTParser {
  private sourceParser = createSourceParser();
  private targetParser = createTargetParser();

  /**
   * 解析 TypeScript 代码为中间态
   */
  parseToIntermediateState(code: string, filePath: string, sourceType: 'source' | 'target'): IntermediateState {
    if (sourceType === 'source') {
      return this.sourceParser.parseToIntermediateState(code, filePath);
    } else {
      return this.targetParser.parseToIntermediateState(code, filePath);
    }
  }

  /**
   * 清理资源
   */
  dispose(): void {
    // 新架构不需要特殊的清理逻辑
    // 保持兼容性
  }
}

// 导出新的解析器
export { createSourceParser, createTargetParser } from './ast';
export { SourceASTParser, TargetASTParser, BaseASTParser } from './ast';
