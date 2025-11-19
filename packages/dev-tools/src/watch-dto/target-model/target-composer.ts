/**
 * Model DTO Composer
 * 将中间态组合为 VO 代码
 */

import { IntermediateState, FieldDefinition } from '../core/intermediate-state';
import { filterNonRelationFields } from '../helpers/FieldParser';

export class TargetModelComposer {
  /**
   * 生成 Model VO 类型定义
   */
  composeVo(intermediateState: IntermediateState): string {
    const lines: string[] = [];
    const voName = intermediateState.metadata.voName;

    // 检查是否为 WithoutRelations 类型
    if (intermediateState.metadata.className.includes('WithoutRelations')) {
      return this.composeWithoutRelationsVo(intermediateState);
    }

    // 标准 Model VO
    lines.push(`export type ${voName} = {`);

    const fieldsArray = Array.from(intermediateState.fields.values());
    const nonRelationFields = this.filterNonRelationFieldsFromMap(fieldsArray);

    for (const field of nonRelationFields) {
      const fieldLine = this.composeField(field);
      lines.push(`  ${fieldLine}`);
    }

    lines.push('};');

    return lines.join('\n');
  }

  /**
   * 生成 WithoutRelations VO
   */
  private composeWithoutRelationsVo(intermediateState: IntermediateState): string {
    const lines: string[] = [];
    const baseName = intermediateState.metadata.className
      .replace('Dto', '')
      .replace('Model', '')
      .replace('WithoutRelations', '');
    const voName = `${baseName}WithoutRelationsVo`;

    lines.push(`export type ${voName} = {`);

    const fieldsArray = Array.from(intermediateState.fields.values());
    const nonRelationFields = this.filterNonRelationFieldsFromMap(fieldsArray);

    for (const field of nonRelationFields) {
      const fieldLine = this.composeField(field);
      lines.push(`  ${fieldLine}`);
    }

    lines.push('} & BaseEntityVo;');

    return lines.join('\n');
  }

  /**
   * 组合单个字段
   */
  private composeField(field: FieldDefinition): string {
    const optional = field.optional ? '?' : '';
    const voType = this.convertDtoTypeToVo(field.type);
    return `${field.name}${optional}: ${voType};`;
  }

  /**
   * 转换 DTO 类型到 VO 类型
   */
  private convertDtoTypeToVo(dtoType: string): string {
    return dtoType.replace(/(\w+)Dto\b/g, '$1Vo');
  }

  /**
   * 过滤非关系字段
   */
  private filterNonRelationFieldsFromMap(fields: FieldDefinition[]): FieldDefinition[] {
    return filterNonRelationFields(fields);
  }
}
