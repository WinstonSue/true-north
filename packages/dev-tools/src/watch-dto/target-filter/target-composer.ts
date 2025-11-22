/**
 * Filter DTO Composer
 */

import { IntermediateState } from '../core/intermediate-state';

export class TargetFilterComposer {
  composeVo(intermediateState: IntermediateState): string {
    const lines: string[] = [];
    const voName = intermediateState.metadata.voName;

    lines.push(`export type ${voName} = {`);

    for (const field of intermediateState.fields.values()) {
      const optional = field.optional ? '?' : '';
      const voType = this.convertDtoTypeToVo(field.type);
      lines.push(`  ${field.name}${optional}: ${voType};`);
    }

    lines.push('};');

    return lines.join('\n');
  }

  private convertDtoTypeToVo(dtoType: string): string {
    return dtoType.replace(/(\w+)Dto\b/g, '$1Vo');
  }
}
