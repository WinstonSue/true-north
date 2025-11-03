/**
 * 统一同步引擎
 * 整合 AST 解析、差异比对、代码生成的完整流程
 */

import { readFileSync, writeFileSync } from 'fs';
import { SourceAdapter, TargetAdapter } from '../core/adapters';
import { ControllerApiDiffEngine } from './diff-engine';
import { ControllerApiCodeGenerator } from './code-generator';
import { IntermediateState, MethodDefinition, ParameterDefinition } from '../core/intermediate-state';
import {
  MethodChangeType,
  MethodChange,
  MethodDetailsResult,
  MethodInfo,
  ControllerSyncStatus,
  SyncOptions,
  SyncResult,
} from '../core/sync-engine';

export class ControllerApiSyncEngine {}

/**
 * 创建同步引擎实例
 */
export function createApiSyncEngine(): ControllerApiSyncEngine {
  return new ControllerApiSyncEngine();
}
