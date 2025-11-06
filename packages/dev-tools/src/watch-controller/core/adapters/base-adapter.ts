/**
 * 适配器基类
 * 提供通用的错误处理和工具方法
 */

import { ASTParser } from '../ast/ast-parser';
import { IntermediateState } from '../intermediate-state';
import { ASTClassInfo } from '../ast/ast-types';
import { ErrorHandler, Logger, ObjectParser, ValidationUtils } from '../../helpers';

export abstract class BaseAdapter {
  protected astParser: ASTParser;
  protected logger = Logger.createContextLogger(this.constructor.name);

  constructor() {
    this.astParser = new ASTParser();
  }

  /**
   * 安全解析代码为中间态
   */
  protected safeParseToIntermediateState(code: string, filePath: string): IntermediateState {
    // 输入验证
    const validationResult = ValidationUtils.validateInput(code, filePath);
    if (!ErrorHandler.isSuccess(validationResult)) {
      this.logger.error('输入验证失败', validationResult.error);
      throw new Error(validationResult.error);
    }

    try {
      const astInfo = this.astParser.parse(code, filePath);
      return this.astToIntermediateState(astInfo, filePath);
    } catch (error) {
      const errorResult = ErrorHandler.handleASTError(error, filePath);
      this.logger.error('AST 解析失败', errorResult.error);
      throw new Error(errorResult.error);
    }
  }

  /**
   * 安全解析对象字面量
   */
  protected safeParseObjectLiteral(text: string): Record<string, any> {
    try {
      return ObjectParser.parseObjectLiteral(text);
    } catch (error) {
      this.logger.warn('对象解析失败', { text, error });
      return {};
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
