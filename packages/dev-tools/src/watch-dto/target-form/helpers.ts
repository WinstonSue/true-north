/**
 * Form DTO 辅助函数
 */

/**
 * 判断是否为 Create DTO
 */
export function isCreateDto(className: string): boolean {
  return className.startsWith('Create');
}

/**
 * 判断是否为 Update DTO
 */
export function isUpdateDto(className: string): boolean {
  return className.startsWith('Update');
}

/**
 * 获取 Form 基础名称
 */
export function getFormBaseName(className: string): string {
  return className.replace('Dto', '').replace('Create', '').replace('Update', '');
}
