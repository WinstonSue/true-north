import express from 'express';
import path from 'path';
// 移除已废弃的导入
import { createProxySyncEngine } from '../watch-controller/target-proxy/sync-engine';
import { createApiSyncEngine } from '../watch-controller/target-api/sync-engine';
import { CONTROLLER_SOURCE_PATH, CONTROLLER_PROXY_TARGET_PATH, CONTROLLER_API_TARGET_PATH } from '../constants';
import { existsSync } from 'fs';

const app = express();
const port = 3002;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'dist')));

// 辅助函数：查找 Desktop 控制器对
function findDesktopControllerPairs() {
  const pairs = [];

  // 硬编码的控制器列表（后续可以改为自动发现）
  const controllers = [
    { name: 'todo', path: 'growth/todo' },
    { name: 'goal', path: 'growth/goal' },
    { name: 'habit', path: 'growth/habit' },
    { name: 'task', path: 'growth/task' },
  ];

  for (const controller of controllers) {
    const className = controller.name.charAt(0).toUpperCase() + controller.name.slice(1) + 'Controller';
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
  ];

  for (const controller of controllers) {
    const className = controller.name.charAt(0).toUpperCase() + controller.name.slice(1) + 'Controller';
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
    const controllers = await engine.checkAllControllers();

    res.json({
      success: true,
      data: {
        controllers: controllers,
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

// 检查 Desktop 控制器差异
app.get('/api/check/desktop-controllers', async (req, res) => {
  const engine = createProxySyncEngine();

  try {
    const pairs = findDesktopControllerPairs();
    const results = await engine.syncControllers(
      pairs.map((p) => ({ sourcePath: p.sourcePath, targetPath: p.targetPath })),
      { dryRun: true, verbose: false }
    );

    const controllerStatuses = results.map((result, index) => ({
      name: pairs[index].name,
      className: pairs[index].className,
      needsSync: result.diff.needsSync,
      changeCount: result.diff.changes.length,
      success: result.success,
      error: result.error,
      changes: result.diff.changes.map((change) => ({
        type: change.type,
        methodName: change.methodName,
        description: change.details.description,
        severity: change.details.severity,
      })),
    }));

    res.json({
      success: true,
      data: {
        controllers: controllerStatuses,
        lastChecked: new Date().toISOString(),
        summary: {
          total: controllerStatuses.length,
          needsSync: controllerStatuses.filter((c) => c.needsSync).length,
          totalChanges: controllerStatuses.reduce((sum, c) => sum + c.changeCount, 0),
        },
      },
    });
  } catch (error) {
    res.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    engine.dispose();
  }
});

// 检查单个 Desktop 控制器差异
app.get('/api/check/desktop-controller/:name', async (req, res) => {
  const { name } = req.params;
  const engine = createProxySyncEngine();

  try {
    const pair = findDesktopControllerPair(name);
    if (!pair) {
      res.json({ success: false, error: `未找到控制器: ${name}` });
      return;
    }

    const result = await engine.checkController(pair.sourcePath, pair.targetPath, {
      verbose: true,
    });

    res.json({
      success: true,
      data: {
        name: pair.name,
        className: pair.className,
        needsSync: result.diff.needsSync,
        changeCount: result.diff.changes.length,
        changes: result.diff.changes.map((change) => ({
          type: change.type,
          methodName: change.methodName,
          description: change.details.description,
          severity: change.details.severity,
        })),
        actions: result.actions.map((action) => ({
          type: action.type,
          methodName: action.methodName,
          description: action.description,
        })),
      },
    });
  } catch (error) {
    res.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    engine.dispose();
  }
});

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
          type: change.type,
          methodName: change.methodName,
          description: change.details.description,
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
  } finally {
    engine.dispose();
  }
});

// 批量同步 Desktop 控制器
app.post('/api/sync/desktop-controllers', async (req, res) => {
  const { controllers = [], dryRun = false } = req.body;
  const engine = createProxySyncEngine();

  try {
    let pairs;
    if (controllers.length === 0) {
      // 同步所有控制器
      pairs = findDesktopControllerPairs();
    } else {
      // 同步指定的控制器
      pairs = controllers.map((name: string) => findDesktopControllerPair(name)).filter(Boolean);
    }

    if (pairs.length === 0) {
      res.json({ success: false, error: '没有找到可同步的控制器' });
      return;
    }

    const results = await engine.syncControllers(
      pairs.map((p: any) => ({ sourcePath: p.sourcePath, targetPath: p.targetPath })),
      { dryRun, verbose: true }
    );

    const summary = {
      total: results.length,
      successful: results.filter((r) => r.success).length,
      needsSync: results.filter((r) => r.diff.needsSync).length,
      totalChanges: results.reduce((sum, r) => sum + r.diff.changes.length, 0),
      totalActions: results.reduce((sum, r) => sum + r.actions.length, 0),
    };

    const controllerResults = results.map((result, index) => ({
      name: pairs[index].name,
      className: pairs[index].className,
      success: result.success,
      needsSync: result.diff.needsSync,
      changeCount: result.diff.changes.length,
      actionCount: result.actions.length,
      error: result.error,
    }));

    res.json({
      success: true,
      data: {
        controllers: controllerResults,
        summary,
        dryRun,
      },
      message: dryRun
        ? `批量检查完成 (${summary.successful}/${summary.total})`
        : `批量同步完成 (${summary.successful}/${summary.total})`,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    engine.dispose();
  }
});

// ========== API 控制器 API 端点 ==========

// 检查 API 控制器差异
app.get('/api/check/api-controllers', async (req, res) => {
  const engine = createApiSyncEngine();

  try {
    const pairs = findApiControllerPairs();
    const results = await engine.syncControllers(
      pairs.map((p) => ({ sourcePath: p.sourcePath, targetPath: p.targetPath })),
      { dryRun: true, verbose: false }
    );

    const controllerStatuses = results.map((result, index) => ({
      name: pairs[index].name,
      className: pairs[index].className,
      needsSync: result.diff.needsSync,
      changeCount: result.diff.changes.length,
      success: result.success,
      error: result.error,
      changes: result.diff.changes.map((change) => ({
        type: change.type,
        methodName: change.methodName,
        description: change.details.description,
        severity: change.details.severity,
      })),
    }));

    res.json({
      success: true,
      data: {
        controllers: controllerStatuses,
        lastChecked: new Date().toISOString(),
        summary: {
          total: controllerStatuses.length,
          needsSync: controllerStatuses.filter((c) => c.needsSync).length,
          totalChanges: controllerStatuses.reduce((sum, c) => sum + c.changeCount, 0),
        },
      },
    });
  } catch (error) {
    res.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    engine.dispose();
  }
});

// 检查单个 API 控制器差异
app.get('/api/check/api-controller/:name', async (req, res) => {
  const { name } = req.params;
  const engine = createApiSyncEngine();

  try {
    const pair = findApiControllerPair(name);
    if (!pair) {
      res.json({ success: false, error: `未找到 API 控制器: ${name}` });
      return;
    }

    const result = await engine.checkController(pair.sourcePath, pair.targetPath, {
      verbose: true,
    });

    res.json({
      success: true,
      data: {
        name: pair.name,
        className: pair.className,
        needsSync: result.diff.needsSync,
        changeCount: result.diff.changes.length,
        changes: result.diff.changes.map((change) => ({
          type: change.type,
          methodName: change.methodName,
          description: change.details.description,
          severity: change.details.severity,
        })),
        actions: result.actions.map((action) => ({
          type: action.type,
          methodName: action.methodName,
          description: action.description,
        })),
      },
    });
  } catch (error) {
    res.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    engine.dispose();
  }
});

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
          type: change.type,
          methodName: change.methodName,
          description: change.details.description,
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
  } finally {
    engine.dispose();
  }
});

// 批量同步 API 控制器
app.post('/api/sync/api-controllers', async (req, res) => {
  const { controllers = [], dryRun = false } = req.body;
  const engine = createApiSyncEngine();

  try {
    let pairs;
    if (controllers.length === 0) {
      // 同步所有 API 控制器
      pairs = findApiControllerPairs();
    } else {
      // 同步指定的 API 控制器
      pairs = controllers.map((name: string) => findApiControllerPair(name)).filter(Boolean);
    }

    if (pairs.length === 0) {
      res.json({ success: false, error: '没有找到可同步的 API 控制器' });
      return;
    }

    const results = await engine.syncControllers(
      pairs.map((p: any) => ({ sourcePath: p.sourcePath, targetPath: p.targetPath })),
      { dryRun, verbose: true }
    );

    const summary = {
      total: results.length,
      successful: results.filter((r) => r.success).length,
      needsSync: results.filter((r) => r.diff.needsSync).length,
      totalChanges: results.reduce((sum, r) => sum + r.diff.changes.length, 0),
      totalActions: results.reduce((sum, r) => sum + r.actions.length, 0),
    };

    const controllerResults = results.map((result, index) => ({
      name: pairs[index].name,
      className: pairs[index].className,
      success: result.success,
      needsSync: result.diff.needsSync,
      changeCount: result.diff.changes.length,
      actionCount: result.actions.length,
      error: result.error,
    }));

    res.json({
      success: true,
      data: {
        controllers: controllerResults,
        summary,
        dryRun,
      },
      message: dryRun
        ? `API 控制器批量检查完成 (${summary.successful}/${summary.total})`
        : `API 控制器批量同步完成 (${summary.successful}/${summary.total})`,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    engine.dispose();
  }
});

// 获取 API 控制器方法级别详情
app.get('/api/check/api-method-details', async (req, res) => {
  try {
    console.log('开始检查 API 控制器方法详情...');
    const engine = createApiSyncEngine();
    console.log('API 同步引擎创建成功');
    
    const controllers = await engine.checkAllControllers();
    console.log('检查完成，找到控制器数量:', controllers.length);
    
    if (controllers.length > 0) {
      console.log('控制器列表:', controllers.map(c => c.className));
    }
    
    res.json({
      success: true,
      data: {
        controllers,
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

// 处理 SPA 路由
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Dev Tools 服务器运行在 http://localhost:${port}`);
});
