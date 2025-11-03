#!/usr/bin/env node

/**
 * 新架构的 CLI 工具
 * 使用统一的同步引擎进行控制器同步
 */

import { Command } from 'commander';
import { join } from 'path';
import { existsSync } from 'fs';
import { createApiSyncEngine } from './sync-engine';
import { ROOT, SOURCE_BASE, API_TARGET_BASE } from '../../constants';

interface ControllerPair {
  className: string;
  sourcePath: string;
  targetPath: string;
}
