/**
 * 源码 AST 解析器
 * 专门解析服务端控制器源码
 */

import { BaseASTParser } from './base-parser';
import { IntermediateState } from '../intermediate-state';

export class SourceASTParser extends BaseASTParser {
  /**
   * 解析服务端源码为中间态
   */
  parseToIntermediateState(code: string, filePath: string): IntermediateState {
    const { sourceFile, classDeclaration } = this.parseToAST(code, filePath);
    
    const metadata = this.parseControllerMetadata(classDeclaration, filePath, 'source');
    const methods = this.parseMethods(classDeclaration, 'source');
    const constructor = this.parseConstructor(classDeclaration, 'source');
    const imports = this.parseImports(sourceFile);

    return {
      metadata,
      methods,
      constructor,
      imports,
    };
  }
}
