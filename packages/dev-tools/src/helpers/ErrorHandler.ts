/**
 * 错误处理工具类
 */
export class ErrorHandler {
  static handleASTError(error: unknown, filePath: string) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      context: `AST 解析错误: ${filePath}`,
    };
  }

  static handleSyncError(error: unknown, operation: string) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      context: `同步错误: ${operation}`,
    };
  }

  static handleFileError(error: unknown, filePath: string) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      context: `文件操作错误: ${filePath}`,
    };
  }

  static isSuccess<T>(result: { success: boolean; data?: T; error?: string }): result is { success: true; data: T } {
    return result.success === true;
  }

  static success<T>(data: T) {
    return { success: true as const, data };
  }

  static async safeExecute<T>(
    fn: () => Promise<T> | T,
    _context?: string
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const result = await fn();
      return this.success(result);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
