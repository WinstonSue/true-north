/**
 * DTO AST Composer
 * 将 AST 结构组合回代码
 */

import { ASTClassInfo, ASTProperty, ASTImport } from './ast-types';

/**
 * AST Composer
 * 用于从 AST 结构生成 VO 代码
 */
export class ASTComposer {
  /**
   * 从 AST 生成 VO 类型定义
   */
  composeVoType(astInfo: ASTClassInfo, voName: string): string {
    const lines: string[] = [];

    // 生成类型定义
    lines.push(`export type ${voName} = {`);

    for (const property of astInfo.properties) {
      const line = this.composeProperty(property);
      if (line) {
        lines.push(`  ${line}`);
      }
    }

    lines.push('};');

    return lines.join('\n');
  }

  /**
   * 组合属性定义
   */
  private composeProperty(property: ASTProperty): string {
    const optional = property.optional ? '?' : '';
    // 转换 DTO 类型为 VO 类型
    const voType = this.convertDtoTypeToVo(property.type);
    return `${property.name}${optional}: ${voType};`;
  }

  /**
   * 转换 DTO 类型到 VO 类型
   */
  private convertDtoTypeToVo(dtoType: string): string {
    // 简化的类型转换，将 XxxDto 转换为 XxxVo
    return dtoType.replace(/(\w+)Dto\b/g, '$1Vo');
  }

  /**
   * 组合导入语句
   */
  composeImports(imports: ASTImport[]): string {
    const lines: string[] = [];

    for (const importDecl of imports) {
      const specifiersText = this.composeImportSpecifiers(importDecl);
      lines.push(`import ${specifiersText} from '${importDecl.source}';`);
    }

    return lines.join('\n');
  }

  /**
   * 组合导入标识符
   */
  private composeImportSpecifiers(importDecl: ASTImport): string {
    if (importDecl.importType === 'default') {
      return importDecl.specifiers[0].local;
    }

    if (importDecl.importType === 'namespace') {
      return `* as ${importDecl.specifiers[0].local}`;
    }

    // Named imports
    const named = importDecl.specifiers
      .map((spec) => {
        if (spec.imported === spec.local) {
          return spec.imported;
        }
        return `${spec.imported} as ${spec.local}`;
      })
      .join(', ');

    return `{ ${named} }`;
  }
}
