import { ASTParser } from '../ast/ast-parser';
import { IntermediateState } from '../intermediate-state';
import { ASTClassInfo } from '../ast/ast-types';

export abstract class TargetAdapter {
  astParser: ASTParser;

  constructor() {
    this.astParser = new ASTParser();
  }

  /**
   * 解析目标代码为中间态
   */
  parseToIntermediateState(code: string, filePath: string): IntermediateState {
    const astInfo = this.astParser.parse(code, filePath);
    return this.astToIntermediateState(astInfo, filePath);
  }

  abstract astToIntermediateState(astInfo: ASTClassInfo, filePath: string): IntermediateState;

}
