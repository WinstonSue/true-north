/**
 * VO 同步引擎基类
 */

import { IntermediateState } from '../intermediate-state/types';
import { DiffResult } from '../diff-engine';
import fs from 'fs';
import path from 'path';

/**
 * 同步引擎基类
 */
export abstract class SyncEngine {
  /**
   * 生成 VO 内容
   */
  abstract generateVoContent(intermediateState: IntermediateState): string;

  /**
   * 同步到文件
   */
  syncToFile(voPath: string, content: string): boolean {
    // 确保目录存在
    const dir = path.dirname(voPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 检查文件是否存在以及内容是否变化
    if (fs.existsSync(voPath)) {
      const existingContent = fs.readFileSync(voPath, 'utf-8');
      if (existingContent === content) {
        return false; // 内容未变化
      }
    }

    // 写入文件
    fs.writeFileSync(voPath, content, 'utf-8');
    return true; // 文件已更新
  }

  /**
   * 获取 VO 文件路径
   */
  getVoPath(dtoFilePath: string): string {
    // 将 DTO 路径转换为 VO 路径
    // packages/business/server/src/**/dto/*.dto.ts -> packages/business/vo/**/*.vo.ts
    
    const relativePath = dtoFilePath.replace(/.*\/server\/src\//, '');
    const voRelativePath = relativePath
      .replace('/dto/', '/')
      .replace('.dto.ts', '.vo.ts');
    
    // 假设 VO 基础路径
    const voBase = dtoFilePath.split('/server/src/')[0].replace('/server', '/vo');
    return path.join(voBase, voRelativePath);
  }

  /**
   * 保留用户自定义的导入
   */
  preserveUserImports(existingContent: string, generatedContent: string): string {
    const existingImports = this.extractImports(existingContent);
    const generatedWithoutImports = this.removeImports(generatedContent);

    if (existingImports) {
      return `${existingImports}\n\n${generatedWithoutImports}`;
    }

    return generatedContent;
  }

  /**
   * 提取导入语句
   */
  private extractImports(content: string): string | null {
    const lines = content.split('\n');
    const importLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('import ')) {
        importLines.push(line);
      } else if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
        break;
      }
    }

    return importLines.length > 0 ? importLines.join('\n') : null;
  }

  /**
   * 移除导入语句
   */
  private removeImports(content: string): string {
    const lines = content.split('\n');
    const nonImportLines: string[] = [];
    let foundNonImport = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('import ')) {
        continue;
      } else if (trimmed || foundNonImport) {
        nonImportLines.push(line);
        if (trimmed) foundNonImport = true;
      }
    }

    return nonImportLines.join('\n').trim();
  }
}
