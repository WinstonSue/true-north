/**
 * Model VO Sync Engine
 * 生成并同步 Model VO 文件
 */

import { SyncEngine } from '../core/sync-engine';
import { IntermediateState } from '../core/intermediate-state';
import { TargetModelComposer } from './target-composer';
import { Logger } from '../helpers/Logger';

export class ModelSyncEngine extends SyncEngine {
  private composer: TargetModelComposer;
  private logger = Logger.createContextLogger('ModelSyncEngine');

  constructor() {
    super();
    this.composer = new TargetModelComposer();
  }

  /**
   * 生成 VO 内容
   */
  generateVoContent(intermediateState: IntermediateState): string {
    try {
      return this.composer.composeVo(intermediateState);
    } catch (error) {
      this.logger.error('Failed to generate VO content', error);
      throw error;
    }
  }

  /**
   * 同步 Model VO
   */
  sync(dtoFilePath: string, intermediateState: IntermediateState): boolean {
    const voPath = this.getVoPath(dtoFilePath);
    const content = this.generateVoContent(intermediateState);

    // 如果 VO 文件已存在，保留用户自定义的导入
    let finalContent = content;
    const fs = require('fs');
    if (fs.existsSync(voPath)) {
      const existingContent = fs.readFileSync(voPath, 'utf-8');
      finalContent = this.preserveUserImports(existingContent, content);
    }

    const changed = this.syncToFile(voPath, finalContent);

    if (changed) {
      this.logger.info(`Synced Model VO: ${voPath}`);
    }

    return changed;
  }
}
