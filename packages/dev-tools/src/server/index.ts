import express from 'express';
import path from 'path';
import { findControllerPairs } from '../watch-controllers/utils/file-finder';
import { createProxySyncEngine } from '../controller/proxy/sync-engine';
import { SOURCE_BASE, TARGET_BASE } from '../constants';
import { existsSync } from 'fs';

const app = express();
const port = 3002;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'dist')));

// 辅助函数：查找控制器对
function findControllerPairsV2() {
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
    const sourcePath = path.join(SOURCE_BASE, controller.path, `${controller.name}.controller.ts`);
    const targetPath = path.join(TARGET_BASE, controller.path, `${controller.name}.controller.ts`);

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

// 辅助函数：查找单个控制器对
function findControllerPairV2(name: string) {
  const pairs = findControllerPairsV2();
  return (
    pairs.find(
      (p) => p.name.toLowerCase() === name.toLowerCase() || p.className.toLowerCase().includes(name.toLowerCase())
    ) || null
  );
}

// 获取方法级别的详细差异
app.get('/api/check/method-details', async (req, res) => {
  try {
    // 获取项目根目录（从 dev-tools 目录向上两级）
    const projectRoot = path.join(process.cwd(), '../..');

    // 查找所有控制器对
    const pairs = await findControllerPairs(projectRoot);

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

// ========== 新架构 V2 API 端点 ==========

// V2: 检查控制器差异（新架构）
app.get('/api/v2/check/controllers', async (req, res) => {
  const engine = createProxySyncEngine();

  try {
    const pairs = findControllerPairsV2();
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

// V2: 检查单个控制器差异
app.get('/api/v2/check/controller/:name', async (req, res) => {
  const { name } = req.params;
  const engine = createProxySyncEngine();

  try {
    const pair = findControllerPairV2(name);
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

// V2: 同步单个控制器
app.post('/api/v2/sync/controller', async (req, res) => {
  const { name, dryRun = false } = req.body;
  const engine = createProxySyncEngine();

  try {
    if (!name) {
      res.json({ success: false, error: '缺少 name 参数' });
      return;
    }

    const pair = findControllerPairV2(name);
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

// V2: 批量同步控制器
app.post('/api/v2/sync/controllers', async (req, res) => {
  const { controllers = [], dryRun = false } = req.body;
  const engine = createProxySyncEngine();

  try {
    let pairs;
    if (controllers.length === 0) {
      // 同步所有控制器
      pairs = findControllerPairsV2();
    } else {
      // 同步指定的控制器
      pairs = controllers.map((name: string) => findControllerPairV2(name)).filter(Boolean);
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

// 处理 SPA 路由
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Dev Tools 服务器运行在 http://localhost:${port}`);
});
