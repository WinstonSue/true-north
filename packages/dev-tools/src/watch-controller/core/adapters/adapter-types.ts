/**
 * Adapter 接口定义
 * 定义 Source 和 Target 适配器的统一接口
 */

import { IntermediateState } from '../intermediate-state';
import { ASTClassInfo } from '../ast/ast-types';

/**
 * 适配器基础接口
 */
export interface BaseAdapter {
  /**
   * 将 AST 结构转换为中间态
   */
  astToIntermediateState(astInfo: ASTClassInfo, filePath: string): IntermediateState;
}

/**
 * Source 适配器接口
 * 负责处理源码（如 Server Controller）的业务转换规则
 */
export interface SourceAdapter extends BaseAdapter {
  /**
   * 解析源码为中间态
   */
  parseToIntermediateState(code: string, filePath: string): IntermediateState;
}

/**
 * Target 适配器接口
 * 负责处理目标代码（如 Desktop Controller）的业务转换规则
 */
export interface TargetAdapter extends BaseAdapter {
  /**
   * 解析目标代码为中间态
   */
  parseToIntermediateState(code: string, filePath: string): IntermediateState;
}