import { IntermediateState } from '../intermediate-state';
import { ASTClassInfo } from '../ast/ast-types';
import { BaseAdapter } from './base-adapter';

export abstract class TargetAdapter extends BaseAdapter {
  constructor() {
    super();
  }

  /**
   * 解析目标代码为中间态
   */
  parseToIntermediateState(code: string, filePath: string): IntermediateState {
    return this.safeParseToIntermediateState(code, filePath);
  }

  abstract astToIntermediateState(astInfo: ASTClassInfo, filePath: string): IntermediateState;
}
