/*
  Dev tool (TS): Watch business server DTOs and sync VO types.
  - 监听 DTO 文件变化，自动生成对应的 VO 类型定义
  - 支持 model.dto.ts, form.dto.ts, filter.dto.ts 三种类型
  - 使用模块化架构，类似 watch-controller

  Usage:
    pnpm -F @true-north/dev-tools run sync:dto     # one-off
    pnpm -F @true-north/dev-tools run watch:dto    # watch
*/

import path from 'path';
import fs from 'fs';
import fg from 'fast-glob';
import chokidar from 'chokidar';
import { ROOT } from '../constants';
import { Logger } from '../helpers/Logger';
import { TargetModelParser } from './target-model/target-parser';
import { ModelSyncEngine } from './target-model/sync-engine';
import { TargetFormParser } from './target-form/target-parser';
import { FormSyncEngine } from './target-form/sync-engine';
import { TargetFilterParser } from './target-filter/target-parser';
import { FilterSyncEngine } from './target-filter/sync-engine';
import { DTO_SOURCE_PATH } from '../constants';

const logger = Logger.createContextLogger('watch-dto');

// 同步引擎实例
const modelSync = new ModelSyncEngine();
const formSync = new FormSyncEngine();
const filterSync = new FilterSyncEngine();

/**
 * 同步单个 DTO 文件到 VO
 */
function syncOne(dtoFilePath: string) {
  const rel = path.relative(DTO_SOURCE_PATH, dtoFilePath);
  if (!rel.includes('/dto/') || !rel.endsWith('.dto.ts')) return;

  try {
    // 根据文件路径判断 DTO 类型
    const dtoType = determineDtoType(dtoFilePath);

    let parser;
    let syncEngine;

    switch (dtoType) {
      case 'model':
        parser = new TargetModelParser(dtoFilePath);
        syncEngine = modelSync;
        break;
      case 'form':
        parser = new TargetFormParser(dtoFilePath);
        syncEngine = formSync;
        break;
      case 'filter':
        parser = new TargetFilterParser(dtoFilePath);
        syncEngine = filterSync;
        break;
      default:
        logger.warn(`Unknown DTO type for file: ${rel}`);
        return;
    }

    const intermediateState = parser.intermediateState;
    const changed = syncEngine.sync(dtoFilePath, intermediateState);

    if (changed) {
      logger.info(`Synced ${dtoType} DTO: ${rel}`);
      updateVoIndex(syncEngine.getVoPath(dtoFilePath), intermediateState.metadata.voName);
    }
  } catch (error) {
    logger.error(`Error processing ${rel}:`, error);
  }
}

/**
 * 判断 DTO 类型
 */
function determineDtoType(filePath: string): 'model' | 'form' | 'filter' {
  if (filePath.includes('filter.dto.ts')) return 'filter';
  if (filePath.includes('form.dto.ts')) return 'form';
  return 'model';
}

/**
 * 更新 VO index.ts
 */
function updateVoIndex(voFilePath: string, voName: string) {
  const indexPath = path.join(path.dirname(voFilePath), 'index.ts');
  const fileName = path.basename(voFilePath, '.vo.ts');

  let indexContent = '';
  if (fs.existsSync(indexPath)) {
    indexContent = fs.readFileSync(indexPath, 'utf-8');
  }

  const newExport = `export * from './${fileName}.vo';`;

  if (!indexContent.includes(newExport)) {
    indexContent = indexContent.trim();
    if (indexContent) {
      indexContent += '\n';
    }
    indexContent += newExport + '\n';

    const dir = path.dirname(indexPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(indexPath, indexContent, 'utf-8');
    logger.info(`Updated index: ${path.relative(ROOT, indexPath)}`);
  }
}

/**
 * 一次性同步所有 DTO 文件
 */
function syncAllOnce() {
  const dtoPaths = fg.sync(path.join(DTO_SOURCE_PATH, '**/dto/*.dto.ts').replace(/\\/g, '/'));
  logger.info(`Found ${dtoPaths.length} DTO files`);

  for (const p of dtoPaths) {
    syncOne(p);
  }
}

/**
 * 监听 DTO 文件变化并同步
 */
function watchAndSync() {
  const dtoGlob = path.join(DTO_SOURCE_PATH, '**/dto/*.dto.ts');
  logger.info(`Watching: ${dtoGlob}`);

  const watcher = chokidar.watch(dtoGlob, {
    ignoreInitial: false,
    persistent: true,
  });

  watcher.on('add', syncOne);
  watcher.on('change', syncOne);

  watcher.on('ready', () => {
    logger.info('Initial scan complete. Watching for changes...');
  });

  return watcher;
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--once')) {
    logger.info('Run one-off sync (DTO → VO)');
    syncAllOnce();
  } else {
    watchAndSync();
  }
}

export { syncOne, syncAllOnce, watchAndSync };
