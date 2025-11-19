/**
 * DTO Parser 基类
 * 提供通用的错误处理和工具方法
 */

import { ASTParser } from '../ast/ast-parser';
import { IntermediateState } from './types';
import { ASTClassInfo } from '../ast/ast-types';
import { readFileSync } from 'fs';

export abstract class BaseParser {
  protected astParser: ASTParser;
  protected filePath: string;
  intermediateState: IntermediateState;

  constructor(filePath: string) {
    this.astParser = new ASTParser();
    this.filePath = filePath;
    this.intermediateState = this.parseToIntermediateState(readFileSync(filePath, 'utf-8'), filePath);
  }

  /**
   * 安全解析代码为中间态
   */
  parseToIntermediateState(code: string, filePath: string): IntermediateState {
    try {
      const astInfo = this.astParser.parse(code, filePath);
      const intermediateState = this.astToIntermediateState(astInfo, filePath);

      // 挂载 AST 数据和源码，用于后续恢复
      intermediateState.astData = astInfo;
      intermediateState.code = code;

      return intermediateState;
    } catch (error) {
      throw new Error(`Failed to parse ${filePath}: ${(error as Error).message}`);
    }
  }

  /**
   * 验证类名
   */
  protected validateClassName(className: string): void {
    if (!className || className.trim().length === 0) {
      throw new Error('Class name is required');
    }
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(className)) {
      throw new Error(`Invalid class name: ${className}`);
    }
  }

  /**
   * 验证字段名
   */
  protected validateFieldName(fieldName: string): void {
    if (!fieldName || fieldName.trim().length === 0) {
      throw new Error('Field name is required');
    }
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(fieldName)) {
      throw new Error(`Invalid field name: ${fieldName}`);
    }
  }

  /**
   * 抽象方法：将 AST 转换为中间态
   */
  abstract astToIntermediateState(astInfo: ASTClassInfo, filePath: string): IntermediateState;
}
