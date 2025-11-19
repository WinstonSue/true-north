/**
 * Target Model Parser
 * 解析 Model DTO 到中间态
 */

import {
  IntermediateState,
  DtoMetadata,
  FieldDefinition,
  DecoratorInfo,
  ImportDeclaration,
  InheritanceInfo,
  BaseParser,
} from '../core/intermediate-state';
import { ASTClassInfo, ASTProperty, ASTImport } from '../core/ast';

export class TargetModelParser extends BaseParser {
  constructor(filePath: string) {
    super(filePath);
  }

  /**
   * 将 AST 结构转换为中间态
   * 包含 Model DTO 的业务转换规则
   */
  astToIntermediateState(astInfo: ASTClassInfo, filePath: string): IntermediateState {
    const metadata = this.parseMetadata(astInfo, filePath);
    const fields = this.parseFields(astInfo.properties);
    const imports = this.parseImports(astInfo.imports);
    const inheritance = this.parseInheritance(astInfo);

    return {
      metadata,
      fields,
      imports,
      astData: astInfo,
      inheritance,
    };
  }

  /**
   * 解析 DTO 元数据
   */
  private parseMetadata(astInfo: ASTClassInfo, filePath: string): DtoMetadata {
    this.validateClassName(astInfo.className);

    const voName = astInfo.className.replace('Dto', 'Vo');

    return {
      className: astInfo.className,
      dtoType: astInfo.dtoType,
      filePath,
      voName,
    };
  }

  /**
   * 解析字段
   */
  private parseFields(astProperties: ASTProperty[]): Map<string, FieldDefinition> {
    const fields = new Map<string, FieldDefinition>();

    for (const prop of astProperties) {
      this.validateFieldName(prop.name);

      const field: FieldDefinition = {
        name: prop.name,
        type: prop.type,
        optional: prop.optional,
        decorators: this.parseDecorators(prop.decorators),
        sourceLocation: prop.sourceLocation,
        hasInitializer: prop.hasInitializer,
        initializer: prop.initializer,
      };

      fields.set(prop.name, field);
    }

    return fields;
  }

  /**
   * 解析装饰器
   */
  private parseDecorators(astDecorators: Array<{ name: string; arguments: any[] }>): DecoratorInfo[] {
    return astDecorators.map((decorator) => ({
      name: decorator.name,
      args: decorator.arguments.map((arg) => arg.value || arg.rawText),
    }));
  }

  /**
   * 解析导入声明
   */
  private parseImports(astImports: ASTImport[]): ImportDeclaration[] {
    return astImports.map((astImport) => ({
      specifiers: astImport.specifiers,
      source: astImport.source,
      importType: astImport.importType,
    }));
  }

  /**
   * 解析继承信息
   */
  private parseInheritance(astInfo: ASTClassInfo): InheritanceInfo | undefined {
    if (!astInfo.extends) {
      return {
        type: 'none',
      };
    }

    // 简单的 extends 处理
    return {
      type: 'extends',
      baseClass: astInfo.extends.className,
      fullExpression: astInfo.extends.fullText,
    };
  }
}
