/**
 * Target Form Parser
 * 解析 Form DTO (Create/Update) 到中间态
 */

import { TargetModelParser } from '../target-model/target-parser';

/**
 * Form Parser 继承 Model Parser
 * Form DTO 和 Model DTO 的解析逻辑基本相同
 */
export class TargetFormParser extends TargetModelParser {}
