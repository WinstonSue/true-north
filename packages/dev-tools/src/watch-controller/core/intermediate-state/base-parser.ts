/**
 * 适配器基类
 * 提供通用的错误处理和工具方法
 */

import { ASTParser } from '../ast/ast-parser';
import { IntermediateState } from './types';
import { ASTClassInfo } from '../ast/ast-types';
import { ErrorHandler, Logger, ValidationUtils } from '../../../helpers';
import { readFileSync } from 'fs';

export abstract class BaseParser {
  protected astParser: ASTParser;
  protected logger = Logger.createContextLogger(this.constructor.name);
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
    // 输入验证
    const validationResult = ValidationUtils.validateInput(code, filePath);
    if (!ErrorHandler.isSuccess(validationResult)) {
      this.logger.error('输入验证失败', validationResult.error);
      throw new Error(validationResult.error);
    }

    try {
      const astInfo = this.astParser.parse(code, filePath);
      const intermediateState = this.astToIntermediateState(astInfo, filePath);

      // 挂载 AST 数据和源码，用于后续恢复
      intermediateState.astData = astInfo;
      intermediateState.code = code;

      return intermediateState;
    } catch (error) {
      const errorResult = ErrorHandler.handleASTError(error, filePath);
      this.logger.error('AST 解析失败', errorResult.error);
      throw new Error(errorResult.error);
    }
  }

  /**
   * 验证类名
   */
  protected validateClassName(className: string): void {
    const error = ValidationUtils.validateClassName(className);
    if (error) {
      this.logger.error('类名验证失败', error.error);
      throw new Error(error.error);
    }
  }

  /**
   * 验证方法名
   */
  protected validateMethodName(methodName: string): void {
    const error = ValidationUtils.validateMethodName(methodName);
    if (error) {
      this.logger.error('方法名验证失败', error.error);
      throw new Error(error.error);
    }
  }

  /**
   * 抽象方法：将 AST 转换为中间态
   */
  abstract astToIntermediateState(astInfo: ASTClassInfo, filePath: string): IntermediateState;
}
