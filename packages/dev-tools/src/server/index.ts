import express from 'express';
import path from 'path';
// 移除已废弃的导入
import { createProxySyncEngine } from '../watch-controller/target-proxy/sync-engine';
import { createApiSyncEngine } from '../watch-controller/target-api/sync-engine';
import { createWebServiceSyncEngine } from '../watch-controller/target-web-service/sync-engine';
import {
  CONTROLLER_SOURCE_PATH,
  CONTROLLER_PROXY_TARGET_PATH,
  CONTROLLER_API_TARGET_PATH,
  CONTROLLER_WEB_SERVICE_TARGET_PATH,
} from '../constants';
import { existsSync } from 'fs';

const app = express();
const port = 3002;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'dist')));

// 辅助函数：生成控制器类名
function generateControllerClassName(name: string): string {
  // 将 kebab-case 转换为 PascalCase
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') + 'Controller';
}

// 辅助函数：查找 Desktop 控制器对
function findDesktopControllerPairs() {
  const pairs = [];

  // 硬编码的控制器列表（后续可以改为自动发现）
  const controllers = [
    { name: 'todo', path: 'growth/todo' },
    { name: 'goal', path: 'growth/goal' },
    { name: 'habit', path: 'growth/habit' },
    { name: 'task', path: 'growth/task' },
    { name: 'track-time', path: 'growth/track-time' },
  ];

  for (const controller of controllers) {
    const className = generateControllerClassName(controller.name);
    const sourcePath = path.join(CONTROLLER_SOURCE_PATH, controller.path, `${controller.name}.controller.ts`);
    const targetPath = path.join(CONTROLLER_PROXY_TARGET_PATH, controller.path, `${controller.name}.controller.ts`);

    if (existsSync(sourcePath) && existsSync(targetPath)) {
      pairs.push({
        className,
        name: controller.name,
        sourcePath,
        targetPath,
      });
    }
  }

  return pairs;
}

// 辅助函数：查找 API 控制器对
function findApiControllerPairs() {
  const pairs = [];

  // 硬编码的控制器列表（后续可以改为自动发现）
  const controllers = [
    { name: 'todo', path: 'growth/todo' },
    { name: 'goal', path: 'growth/goal' },
    { name: 'habit', path: 'growth/habit' },
    { name: 'task', path: 'growth/task' },
    { name: 'track-time', path: 'growth/track-time' },
  ];

  for (const controller of controllers) {
    const className = generateControllerClassName(controller.name);
    const sourcePath = path.join(CONTROLLER_SOURCE_PATH, controller.path, `${controller.name}.controller.ts`);
    // API 控制器文件直接在 controller 目录下，不按模块分组
    const targetPath = path.join(CONTROLLER_API_TARGET_PATH, `${controller.name}.ts`);

    if (existsSync(sourcePath) && existsSync(targetPath)) {
      pairs.push({
        className,
        name: controller.name,
        sourcePath,
        targetPath,
      });
    }
  }

  return pairs;
}

// 辅助函数：查找 Web Service 控制器对
function findWebServiceControllerPairs() {
  const pairs = [];

  // 硬编码的控制器列表（后续可以改为自动发现）
  const controllers = [
    { name: 'todo', path: 'growth/todo' },
    { name: 'goal', path: 'growth/goal' },
    { name: 'habit', path: 'growth/habit' },
    { name: 'task', path: 'growth/task' },
    { name: 'track-time', path: 'growth/track-time' },
  ];

  for (const controller of controllers) {
    const className = generateControllerClassName(controller.name).replace('Controller', 'Service');
    const sourcePath = path.join(CONTROLLER_SOURCE_PATH, controller.path, `${controller.name}.controller.ts`);
    // Web Service 文件按模块分组
    const targetPath = path.join(
      CONTROLLER_WEB_SERVICE_TARGET_PATH,
      controller.path.split('/')[0],
      `${controller.name}.service.ts`
    );

    if (existsSync(sourcePath) && existsSync(targetPath)) {
      pairs.push({
        className,
        name: controller.name,
        sourcePath,
        targetPath,
      });
    }
  }

  return pairs;
}

// 辅助函数：查找单个 Desktop 控制器对
function findDesktopControllerPair(name: string) {
  const pairs = findDesktopControllerPairs();
  return (
    pairs.find(
      (p) => p.name.toLowerCase() === name.toLowerCase() || p.className.toLowerCase().includes(name.toLowerCase())
    ) || null
  );
}

// 辅助函数：查找单个 API 控制器对
function findApiControllerPair(name: string) {
  const pairs = findApiControllerPairs();
  return (
    pairs.find(
      (p) => p.name.toLowerCase() === name.toLowerCase() || p.className.toLowerCase().includes(name.toLowerCase())
    ) || null
  );
}

// 辅助函数：查找单个 Web Service 控制器对
function findWebServiceControllerPair(name: string) {
  const pairs = findWebServiceControllerPairs();
  return (
    pairs.find(
      (p) => p.name.toLowerCase() === name.toLowerCase() || p.className.toLowerCase().includes(name.toLowerCase())
    ) || null
  );
}

// 获取方法级别的详细差异
app.get('/api/check/method-details', async (req, res) => {
  try {
    // 查找所有 Desktop 控制器对
    const pairs = findDesktopControllerPairs();

    if (pairs.length === 0) {
      res.json({ success: true, data: [] });
      return;
    }

    // 使用新架构的同步引擎
    const engine = createProxySyncEngine();

    // 执行控制器状态检查（包含方法级别的详细信息）
    const results = await engine.checkAllDiffResults();

    res.json({
      success: true,
      data: {
        controllers: results,
        lastChecked: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// ========== Desktop 控制器 API 端点 ==========
// 同步单个 Desktop 控制器
app.post('/api/sync/desktop-controller', async (req, res) => {
  const { name, dryRun = false } = req.body;
  const engine = createProxySyncEngine();

  try {
    if (!name) {
      res.json({ success: false, error: '缺少 name 参数' });
      return;
    }

    const pair = findDesktopControllerPair(name);
    if (!pair) {
      res.json({ success: false, error: `未找到控制器: ${name}` });
      return;
    }

    const result = await engine.syncController(pair.sourcePath, pair.targetPath, {
      dryRun,
      verbose: true,
    });

    res.json({
      success: result.success,
      data: {
        name: pair.name,
        className: pair.className,
        needsSync: result.diff.needsSync,
        changeCount: result.diff.changes.length,
        actionCount: result.actions.length,
        dryRun,
        changes: result.diff.changes.map((change) => ({
          type: change.changeType,
          description: change.description,
        })),
        methodChanges: result.diff.methodChanges.map((change) => ({
          type: change.changeType,
          methodName: change.methodName,
          description: change.description,
        })),
        actions: result.actions.map((action) => ({
          type: action.type,
          methodName: action.methodName,
          description: action.description,
        })),
      },
      message: result.success
        ? dryRun
          ? `${pair.className} 检查完成`
          : `${pair.className} 同步完成`
        : `${pair.className} 同步失败`,
      error: result.error,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// ========== API 控制器 API 端点 ==========
// 同步单个 API 控制器
app.post('/api/sync/api-controller', async (req, res) => {
  const { name, dryRun = false } = req.body;
  const engine = createApiSyncEngine();

  try {
    if (!name) {
      res.json({ success: false, error: '缺少 name 参数' });
      return;
    }

    const pair = findApiControllerPair(name);
    if (!pair) {
      res.json({ success: false, error: `未找到 API 控制器: ${name}` });
      return;
    }

    const result = await engine.syncController(pair.sourcePath, pair.targetPath, {
      dryRun,
      verbose: true,
    });

    res.json({
      success: result.success,
      data: {
        name: pair.name,
        className: pair.className,
        needsSync: result.diff.needsSync,
        changeCount: result.diff.changes.length,
        actionCount: result.actions.length,
        dryRun,
        changes: result.diff.changes.map((change) => ({
          type: change.changeType,
          description: change.description,
        })),
        actions: result.actions.map((action) => ({
          type: action.type,
          methodName: action.methodName,
          description: action.description,
        })),
      },
      message: result.success
        ? dryRun
          ? `API 控制器 ${pair.className} 检查完成`
          : `API 控制器 ${pair.className} 同步完成`
        : `API 控制器 ${pair.className} 同步失败`,
      error: result.error,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// 获取 API 控制器方法级别详情
app.get('/api/check/api-method-details', async (req, res) => {
  try {
    const engine = createApiSyncEngine();

    const results = await engine.checkAllDiffResults();

    res.json({
      success: true,
      data: {
        controllers: results,
        lastChecked: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('API 控制器方法详情检查失败:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// ========== Web Service API 端点 ==========

// 获取 Web Service 方法级别详情
app.get('/api/check/web-service-method-details', async (req, res) => {
  try {
    const engine = createWebServiceSyncEngine();

    const results = await engine.checkAllDiffResults();

    res.json({
      success: true,
      data: {
        controllers: results,
        lastChecked: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Web Service 方法详情检查失败:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// 同步单个 Web Service
app.post('/api/sync/web-service-controller', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({
      success: false,
      error: '缺少控制器名称参数',
    });
    return;
  }

  try {
    const pair = findWebServiceControllerPair(name);
    if (!pair) {
      res.status(404).json({
        success: false,
        error: `未找到 Web Service: ${name}`,
      });
      return;
    }

    const engine = createWebServiceSyncEngine();
    const result = await engine.syncController(pair.sourcePath, pair.targetPath, {
      dryRun: false,
      verbose: true,
    });

    if (result.success) {
      res.json({
        success: true,
        message: `Web Service ${pair.className} 同步完成`,
        data: {
          controllerName: result.controllerName,
          needsSync: result.diff.needsSync,
          changeCount: result.diff.changes.length,
          actionCount: result.actions.length,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Web Service 同步失败',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// 处理 SPA 路由
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Dev Tools 服务器运行在 http://localhost:${port}`);
});
