/**
 * Model DTO 辅助函数
 */

import { FieldDefinition } from '../core/intermediate-state';

/**
 * 判断是否为 WithoutRelations DTO
 */
export function isWithoutRelationsDto(className: string): boolean {
  return className.includes('WithoutRelations');
}

/**
 * 获取基础名称（移除 Dto、Model、WithoutRelations 后缀）
 */
export function getModelBaseName(className: string): string {
  return className
    .replace('Dto', '')
    .replace('Model', '')
    .replace('WithoutRelations', '');
}

/**
 * 检查字段是否为关系字段
 */
export function isRelationField(field: FieldDefinition): boolean {
  if (!field.decorators) return false;
  const relationDecorators = ['ManyToOne', 'OneToMany', 'ManyToMany', 'OneToOne'];
  return field.decorators.some((decorator) => relationDecorators.includes(decorator.name));
}
