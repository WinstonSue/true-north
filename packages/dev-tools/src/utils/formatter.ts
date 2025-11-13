/**
 * 代码格式化工具
 * 使用 prettier 格式化生成的代码文件
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';

/**
 * 使用 prettier 格式化指定文件
 */
export function formatFile(filePath: string): void {
  try {
    // 检查文件是否存在
    if (!existsSync(filePath)) {
      console.warn(`文件不存在，跳过格式化: ${filePath}`);
      return;
    }

    // 查找项目根目录的 prettier 配置
    const projectRoot = findProjectRoot(filePath);
    
    // 执行 prettier 格式化
    const command = `npx prettier --write "${filePath}"`;
    execSync(command, { 
      cwd: projectRoot,
      stdio: 'pipe' // 静默执行，避免输出干扰
    });
    
    console.log(`✓ 已格式化: ${filePath}`);
  } catch (error) {
    console.warn(`格式化失败: ${filePath}`, error instanceof Error ? error.message : error);
  }
}

/**
 * 查找项目根目录（包含 package.json 的目录）
 */
function findProjectRoot(startPath: string): string {
  let currentDir = dirname(startPath);
  
  while (currentDir !== '/') {
    if (existsSync(join(currentDir, 'package.json'))) {
      return currentDir;
    }
    currentDir = dirname(currentDir);
  }
  
  // 如果找不到，返回当前目录
  return dirname(startPath);
}
