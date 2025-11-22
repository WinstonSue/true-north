/**
 * Filter DTO 辅助函数
 */

/**
 * 判断是否为 Filter DTO
 */
export function isFilterDto(className: string): boolean {
  return className.includes('Filter');
}

/**
 * 获取 Filter 基础名称
 */
export function getFilterBaseName(className: string): string {
  return className.replace('Dto', '').replace('Filter', '');
}
