import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 从 packages/dev-tools/src/watch-controllers/constants.ts 回到项目根目录
export const ROOT = path.resolve(__dirname, '../../..');

/** Growth 业务 SSOT：*.route-controller.ts */
export const CONTROLLER_SOURCE_PATH = path.join(ROOT, 'apps/desktop/src/service/growth');
/** @deprecated Proxy 透传层已合并进 route-controller，不再作为同步目标 */
export const CONTROLLER_PROXY_TARGET_PATH = path.join(ROOT, 'apps/desktop/src/service/growth');
export const CONTROLLER_API_TARGET_PATH = path.join(ROOT, 'packages/business/web-service/controller');
export const CONTROLLER_WEB_SERVICE_TARGET_PATH = path.join(ROOT, 'packages/business/web-service');

export const DTO_SOURCE_PATH = path.join(ROOT, 'apps/desktop/src/service/growth');
export const DTO_VO_TARGET_PATH = path.join(ROOT, 'packages/business/vo');
