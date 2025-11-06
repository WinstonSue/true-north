/**
 * 从文件路径提取类名 - 工具方法
 */
export function extractClassNameFromPath(relativePath: string): string {
  const fileName = relativePath.split('/').pop() || '';
  const baseName = fileName.replace(/.controller\.(ts|js)$/, '');
  return (
    baseName
      .split(/[-_]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Controller'
  );
}
