import { readdir, stat } from 'fs/promises';
import { join, basename } from 'path';

export interface ControllerPair {
  className: string;
  serverPath: string;
  desktopPath: string;
}

/**
 * 查找项目中的控制器文件对
 */
export async function findControllerPairs(projectRoot: string): Promise<ControllerPair[]> {
  const pairs: ControllerPair[] = [];
  
  const serverDir = join(projectRoot, 'packages/business/server/src');
  const desktopDir = join(projectRoot, 'apps/desktop/src/database');
  
  try {
    const serverControllers = await findControllerFiles(serverDir);
    const desktopControllers = await findControllerFiles(desktopDir);
    
    // 匹配服务端和桌面端控制器
    for (const serverController of serverControllers) {
      const className = extractClassName(serverController.path);
      const relativePath = getRelativePath(serverController.path, serverDir);
      const expectedDesktopPath = join(desktopDir, relativePath);
      
      const desktopController = desktopControllers.find(dc => dc.path === expectedDesktopPath);
      
      if (desktopController) {
        pairs.push({
          className,
          serverPath: serverController.path,
          desktopPath: desktopController.path
        });
      }
    }
    
    return pairs;
  } catch (error) {
    console.error('Error finding controller pairs:', error);
    return [];
  }
}

interface ControllerFile {
  path: string;
  name: string;
}

/**
 * 递归查找控制器文件
 */
async function findControllerFiles(dir: string): Promise<ControllerFile[]> {
  const controllers: ControllerFile[] = [];
  
  try {
    const entries = await readdir(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = await stat(fullPath);
      
      if (stats.isDirectory()) {
        const subControllers = await findControllerFiles(fullPath);
        controllers.push(...subControllers);
      } else if (entry.endsWith('.controller.ts')) {
        controllers.push({
          path: fullPath,
          name: entry
        });
      }
    }
  } catch (error) {
    // 目录不存在或无法访问，忽略错误
  }
  
  return controllers;
}

/**
 * 从文件路径提取类名
 */
function extractClassName(filePath: string): string {
  const fileName = basename(filePath, '.ts');
  
  // 如果文件名已经是 xxx.controller 格式，直接处理
  if (fileName.endsWith('.controller')) {
    const baseName = fileName.replace('.controller', '');
    // 将 kebab-case 转换为 PascalCase
    const pascalCase = baseName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    return pascalCase + 'Controller';
  }
  
  // 否则按原逻辑处理
  return fileName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * 获取相对路径
 */
function getRelativePath(fullPath: string, basePath: string): string {
  return fullPath.replace(basePath, '').replace(/^\//, '');
}

/**
 * 查找特定控制器的文件对
 */
export async function findSpecificControllerPair(
  projectRoot: string, 
  controllerName: string
): Promise<ControllerPair | null> {
  const pairs = await findControllerPairs(projectRoot);
  return pairs.find(pair => 
    pair.className.toLowerCase().includes(controllerName.toLowerCase())
  ) || null;
}
