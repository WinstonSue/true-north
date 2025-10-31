/**
 * 目标代码 AST 解析器
 * 专门解析桌面端控制器代码
 */

import { BaseASTParser } from './base-parser';
import { IntermediateState } from '../intermediate-state';

export class TargetASTParser extends BaseASTParser {
  /**
   * 解析桌面端目标代码为中间态
   */
  parseToIntermediateState(code: string, filePath: string): IntermediateState {
    const { sourceFile, classDeclaration } = this.parseToAST(code, filePath);
    
    const metadata = this.parseControllerMetadata(classDeclaration, filePath, 'target');
    const methods = this.parseMethods(classDeclaration, 'target');
    const constructor = this.parseConstructor(classDeclaration, 'target');
    const imports = this.parseImports(sourceFile);

    return {
      metadata,
      methods,
      constructor,
      imports,
    };
  }
}
