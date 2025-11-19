/**
 * Form DTO Composer
 * 将中间态组合为 Form VO 代码
 */

import { IntermediateState } from '../core/intermediate-state';
import { filterNonRelationFields } from '../utils/field-utils';

export class TargetFormComposer {
  /**
   * 生成 Form VO 类型定义
   */
  composeVo(intermediateState: IntermediateState): string {
    const className = intermediateState.metadata.className;
    
    // 判断是 Create 还是 Update
    if (className.startsWith('Update')) {
      return this.composeUpdateVo(intermediateState);
    } else {
      return this.composeCreateVo(intermediateState);
    }
  }

  /**
   * 生成 Create VO
   */
  private composeCreateVo(intermediateState: IntermediateState): string {
    const lines: string[] = [];
    const voName = intermediateState.metadata.voName;

    lines.push(`export type ${voName} = {`);

    const fieldsArray = Array.from(intermediateState.fields.values());
    const nonRelationFields = filterNonRelationFields(fieldsArray);

    for (const field of nonRelationFields) {
      const optional = field.optional ? '?' : '';
      const voType = this.convertDtoTypeToVo(field.type);
      lines.push(`  ${field.name}${optional}: ${voType};`);
    }

    lines.push('};');

    return lines.join('\n');
  }

  /**
   * 生成 Update VO (Partial<CreateVo>)
   */
  private composeUpdateVo(intermediateState: IntermediateState): string {
    const voName = intermediateState.metadata.voName;
    const baseName = intermediateState.metadata.className
      .replace('Dto', '')
      .replace('Update', '');
    const createVoName = `Create${baseName}Vo`;

    return `export type ${voName} = Partial<${createVoName}>;`;
  }

  /**
   * 转换 DTO 类型到 VO 类型
   */
  private convertDtoTypeToVo(dtoType: string): string {
    return dtoType.replace(/(\w+)Dto\b/g, '$1Vo');
  }
}
