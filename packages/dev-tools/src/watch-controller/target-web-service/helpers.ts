import { CONTROLLER_SOURCE_PATH, CONTROLLER_WEB_SERVICE_TARGET_PATH } from '../../constants';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * 查找所有控制器对
 * SSOT: apps/desktop/.../*.route-controller.ts → packages/business/web-service/{module}/*.service.ts
 */
export function findAllControllerPairs(): Array<{ sourcePath: string; targetPath: string; className: string }> {
  const pairs: Array<{ sourcePath: string; targetPath: string; className: string }> = [];

  try {
    const findControllerFiles = (dir: string, basePath: string): string[] => {
      const files: string[] = [];
      const items = readdirSync(dir);

      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          files.push(...findControllerFiles(fullPath, basePath));
        } else if (item.endsWith('.route-controller.ts')) {
          const relativePath = fullPath.replace(basePath, '').replace(/^\//, '');
          files.push(relativePath);
        }
      }

      return files;
    };

    const sourceFiles = findControllerFiles(CONTROLLER_SOURCE_PATH, CONTROLLER_SOURCE_PATH);

    for (const sourceFile of sourceFiles) {
      const sourcePath = join(CONTROLLER_SOURCE_PATH, sourceFile);

      // 转换路径：goal/goal.route-controller.ts -> growth/goal.service.ts
      const pathParts = sourceFile.split('/');
      if (pathParts.length >= 1) {
        // CONTROLLER_SOURCE_PATH 已是 .../service/growth，相对路径为 todo/todo.route-controller.ts
        const fileName = pathParts[pathParts.length - 1];
        const serviceName = fileName.replace('.route-controller.ts', '.service.ts');
        const targetPath = join(CONTROLLER_WEB_SERVICE_TARGET_PATH, 'growth', serviceName);

        const className = extractServiceClassNameFromPath(sourceFile);

        pairs.push({
          sourcePath,
          targetPath,
          className,
        });
      }
    }
  } catch (error) {
    console.error('查找控制器文件时出错:', error);
  }

  return pairs;
}

/**
 * 从文件路径提取 Service 类名
 */
export function extractServiceClassNameFromPath(relativePath: string): string {
  const fileName = relativePath.split('/').pop() || '';
  const baseName = fileName.replace('.route-controller.ts', '');
  return (
    baseName
      .split(/[-_]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Service'
  );
}
