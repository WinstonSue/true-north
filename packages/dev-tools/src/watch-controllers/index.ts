/*
  Dev tool (TS): Watch business server controllers and sync desktop + API controllers.
  - Desktop: sync constructor args and missing methods
  - API: sync missing methods with proper method names

  Usage:
    pnpm -F @life-toolkit/dev-tools run sync:controllers   # one-off
    pnpm -F @life-toolkit/dev-tools run watch:controllers  # watch
*/

import path from 'path';
import fs from 'fs';
import chokidar from 'chokidar';
import fg from 'fast-glob';
import { ROOT, SOURCE_BASE } from '../constants';
import {
  createLogger,
  readFileSafe,
  writeFileIfChanged,
  getRelServerPath,
  getDesktopControllerPathFromServer,
  getApiControllerPathFromServer,
  typeToServiceConstName,
} from '../utils';
import { parseClassName, parseConstructorServiceTypes } from './parser';
import { syncMissingMethods, ensureConstructorArgs } from './sync/sync-database';
import { syncApiMethods } from './sync/sync-api';

const logLocal = createLogger('watch-controllers');

function syncOne(sourceControllerPath: string) {
  const rel = getRelServerPath(sourceControllerPath);
  if (!rel.endsWith('.controller.ts')) return;

  const sourceContent = readFileSafe(sourceControllerPath);
  if (!sourceContent) return;

  const className = parseClassName(sourceContent);
  if (!className) {
    logLocal('Skip (no class found):', rel);
    return;
  }

  const serviceTypes = parseConstructorServiceTypes(sourceContent);
  const serviceConstNames = serviceTypes.map(typeToServiceConstName);

  // 同步 Desktop Controller
  const targetPath = getDesktopControllerPathFromServer(sourceControllerPath);
  if (fs.existsSync(targetPath)) {
    const targetContent = readFileSafe(targetPath);
    if (targetContent) {
      let next = targetContent;
      // Always update constructor args, even when empty
      next = ensureConstructorArgs(next, className, serviceConstNames);
      // Append any missing methods at class end (no import changes)
      next = syncMissingMethods(next, className, sourceContent);

      if (next !== targetContent) {
        const ok = writeFileIfChanged(targetPath, next);
        if (ok) logLocal('Synced desktop controller ->', path.relative(ROOT, targetPath));
      }
    }
  } else {
    logLocal('Desktop controller not found:', path.relative(ROOT, targetPath));
  }

  // 同步 API Controller
  const apiPath = getApiControllerPathFromServer(sourceControllerPath);
  if (fs.existsSync(apiPath)) {
    const apiContent = readFileSafe(apiPath);
    if (apiContent) {
      const next = syncApiMethods(apiContent, className, sourceContent, className);
      if (next !== apiContent) {
        const ok = writeFileIfChanged(apiPath, next);
        if (ok) logLocal('Synced API controller ->', path.relative(ROOT, apiPath));
      }
    }
  } else {
    logLocal('API controller not found:', path.relative(ROOT, apiPath));
  }
}

function syncAllOnce() {
  const sourceControllerPaths = fg.sync(path.join(SOURCE_BASE, '**/*.controller.ts').replace(/\\/g, '/'));
  for (const p of sourceControllerPaths) {
    syncOne(p);
  }
}

function watchAndSync() {
  const sourceControllerGlob = path.join(SOURCE_BASE, '**/*.controller.ts');
  logLocal('[dev-tools/watch-controllers] Watching:', sourceControllerGlob);

  const watcher = chokidar.watch(sourceControllerGlob, {
    ignoreInitial: false,
    persistent: true,
  });

  watcher.on('add', syncOne);
  watcher.on('change', syncOne);

  watcher.on('ready', () => {
    logLocal('[dev-tools/watch-controllers] Initial scan complete. Watching for changes...');
  });

  return watcher;
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--once')) {
    logLocal('[dev-tools/watch-controllers] Run one-off sync (desktop + API controllers)');
    syncAllOnce();
  } else {
    watchAndSync();
  }
}

export { syncOne, syncAllOnce, watchAndSync };
