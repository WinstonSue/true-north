import { IntermediateState } from './types';
import { ASTClassInfo } from '../ast/ast-types';
import { BaseParser } from './base-parser';
import { parseControllerMetadata, parseMethods, parseConstructor, parseImports } from './helpers';

export class SourceIntermediateParser extends BaseParser {
  constructor(filePath: string) {
    super(filePath);
  }

  /**
   * 将 AST 结构转换为中间态
   * 包含 Source 代码的业务转换规则
   */
  astToIntermediateState(astInfo: ASTClassInfo, filePath: string): IntermediateState {
    const metadata = parseControllerMetadata(astInfo, filePath);
    const methods = parseMethods(astInfo.methods);
    const constructor = parseConstructor(astInfo.constructor);
    const imports = parseImports(astInfo.imports);

    return {
      metadata,
      methods,
      constructor,
      imports,
      astData: astInfo,
    };
  }
}
