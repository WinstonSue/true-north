/**
 * 同步工具函数
 */

/**
 * 转换 DTO 类型到 VO 类型
 */
export function convertDtoTypeToVo(dtoType: string): string {
  return dtoType.replace(/(\w+)Dto\b/g, '$1Vo');
}

/**
 * 转换 DTO 类名到 VO 类名
 */
export function convertDtoNameToVo(dtoName: string): string {
  return dtoName.replace('Dto', 'Vo');
}

/**
 * 获取基础名称（移除 Dto 后缀）
 */
export function getBaseName(className: string): string {
  return className.replace('Dto', '');
}
