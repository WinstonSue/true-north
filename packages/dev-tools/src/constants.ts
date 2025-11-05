import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 从 packages/dev-tools/src/watch-controllers/constants.ts 回到项目根目录
export const ROOT = path.resolve(__dirname, '../../..');

export const CONTROLLER_SOURCE_PATH = path.join(ROOT, 'packages/business/server/src');
export const CONTROLLER_PROXY_TARGET_PATH = path.join(ROOT, 'apps/desktop/src/database');
export const CONTROLLER_API_TARGET_PATH = path.join(ROOT, 'packages/business/api/controller');
export const CONTROLLER_WEB_SERVICE_TARGET_PATH = path.join(ROOT, 'packages/business/web-service/src');

export const DTO_SOURCE_PATH = path.join(ROOT, 'packages/business/server/src');
export const DTO_VO_TARGET_PATH = path.join(ROOT, 'packages/business/vo');
