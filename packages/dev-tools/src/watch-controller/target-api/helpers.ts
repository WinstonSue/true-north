import { CONTROLLER_SOURCE_PATH, CONTROLLER_API_TARGET_PATH } from '../../constants';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { extractClassNameFromPath } from '../utils';

/**
 * 查找所有 API 控制器对
 */
export function findAllControllerPairs(): Array<{ sourcePath: string; targetPath: string; className: string }> {
  const pairs: Array<{ sourcePath: string; targetPath: string; className: string }> = [];

  try {
    // 递归查找所有 .controller.ts 文件
    const findControllerFiles = (dir: string, basePath: string): string[] => {
      const files: string[] = [];
      const items = readdirSync(dir);

      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          files.push(...findControllerFiles(fullPath, basePath));
        } else if (item.endsWith('.controller.ts')) {
          const relativePath = fullPath.replace(basePath, '').replace(/^\//, '');
          files.push(relativePath);
        }
      }

      return files;
    };

    const sourceFiles = findControllerFiles(CONTROLLER_SOURCE_PATH, CONTROLLER_SOURCE_PATH);

    for (const sourceFile of sourceFiles) {
      const sourcePath = join(CONTROLLER_SOURCE_PATH, sourceFile);

      // API 控制器的目标路径结构不同
      const fileName = sourceFile.split('/').pop()?.replace('.controller.ts', '.ts') || '';
      const targetPath = join(CONTROLLER_API_TARGET_PATH, fileName);
      const className = extractClassNameFromPath(sourceFile);

      pairs.push({
        sourcePath,
        targetPath,
        className,
      });
    }
  } catch (error) {
    console.error('查找 API 控制器文件时出错:', error);
  }

  return pairs;
}
