import path from 'path';
import fs from 'fs';
import fg from 'fast-glob';
import { ROOT, SOURCE_BASE } from '../constants';
import {
  readFileSafe,
  getRelServerPath,
  getDesktopControllerPathFromServer,
  getApiControllerPathFromServer,
} from '../utils';
import { parseClassName, parseConstructorServiceTypes } from './parser';
import { ensureConstructorArgs, syncMissingMethods } from './sync/sync-database';
import { syncApiMethods } from './sync/sync-api';
import { typeToServiceConstName } from '../utils';

export interface ControllerStatus {
  sourcePath: string;
  relativePath: string;
  className: string | null;
  serviceTypes: string[];
  desktop: {
    exists: boolean;
    path: string;
    needsSync: boolean;
    issues: string[];
  };
  api: {
    exists: boolean;
    path: string;
    needsSync: boolean;
    issues: string[];
  };
}

export interface SyncStatus {
  totalControllers: number;
  needsSyncCount: number;
  controllers: ControllerStatus[];
  lastChecked: string;
}

/**
 * 检查单个 controller 的状态
 */
export function checkControllerStatus(sourceControllerPath: string): ControllerStatus | null {
  const rel = getRelServerPath(sourceControllerPath);
  if (!rel.endsWith('.controller.ts')) return null;

  const sourceContent = readFileSafe(sourceControllerPath);
  if (!sourceContent) return null;

  const className = parseClassName(sourceContent);
  const serviceTypes = parseConstructorServiceTypes(sourceContent);
  const serviceConstNames = serviceTypes.map(typeToServiceConstName);

  // 检查 Desktop Controller
  const targetPath = getDesktopControllerPathFromServer(sourceControllerPath);
  const targetExists = fs.existsSync(targetPath);
  let targetNeedsSync = false;
  const targetIssues: string[] = [];

  if (targetExists) {
    const targetContent = readFileSafe(targetPath);
    if (targetContent) {
      try {
        let next = targetContent;
        next = ensureConstructorArgs(next, className || '', serviceConstNames);
        next = syncMissingMethods(next, className || '', sourceContent);
        
        targetNeedsSync = next !== targetContent;
        
        if (targetNeedsSync) {
          targetIssues.push('需要同步构造函数参数或方法');
        }
      } catch (error) {
        targetIssues.push(`检查失败: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      targetIssues.push('文件读取失败');
    }
  } else {
    targetIssues.push('文件不存在');
  }

  // 检查 API Controller
  const apiPath = getApiControllerPathFromServer(sourceControllerPath);
  const apiExists = fs.existsSync(apiPath);
  let apiNeedsSync = false;
  const apiIssues: string[] = [];

  if (apiExists) {
    const apiContent = readFileSafe(apiPath);
    if (apiContent) {
      try {
        const next = syncApiMethods(apiContent, className || '', sourceContent, className || '');
        
        apiNeedsSync = next !== apiContent;
        
        if (apiNeedsSync) {
          apiIssues.push('需要同步 API 方法');
        }
      } catch (error) {
        apiIssues.push(`检查失败: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      apiIssues.push('文件读取失败');
    }
  } else {
    apiIssues.push('文件不存在');
  }

  return {
    sourcePath: sourceControllerPath,
    relativePath: rel,
    className,
    serviceTypes,
    desktop: {
      exists: targetExists,
      path: targetPath,
      needsSync: targetNeedsSync,
      issues: targetIssues,
    },
    api: {
      exists: apiExists,
      path: apiPath,
      needsSync: apiNeedsSync,
      issues: apiIssues,
    },
  };
}

/**
 * 检查所有待同步的 controller 文件
 */
export function checkPendingSyncFiles(): SyncStatus {
  const sourceControllerPaths = fg.sync(path.join(SOURCE_BASE, '**/*.controller.ts').replace(/\\/g, '/'));
  const controllers: ControllerStatus[] = [];
  
  for (const p of sourceControllerPaths) {
    const status = checkControllerStatus(p);
    if (status) {
      controllers.push(status);
    }
  }

  const needsSyncCount = controllers.filter(c => 
    c.desktop.needsSync || c.api.needsSync || !c.desktop.exists || !c.api.exists
  ).length;

  return {
    totalControllers: controllers.length,
    needsSyncCount,
    controllers,
    lastChecked: new Date().toISOString(),
  };
}

/**
 * 获取需要同步的文件列表
 */
export function getPendingSyncFiles(): string[] {
  const status = checkPendingSyncFiles();
  const pendingFiles: string[] = [];

  for (const controller of status.controllers) {
    if (controller.desktop.needsSync || !controller.desktop.exists) {
      pendingFiles.push(controller.desktop.path);
    }
    if (controller.api.needsSync || !controller.api.exists) {
      pendingFiles.push(controller.api.path);
    }
  }

  return pendingFiles;
}
