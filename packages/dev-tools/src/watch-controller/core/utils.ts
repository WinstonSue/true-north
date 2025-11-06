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

/**
 * 对象解析工具类
 */
export class ObjectParser {
  static parseObjectLiteral(text: string): Record<string, any> {
    if (!text?.trim()) {
      return {};
    }

    try {
      // 尝试 JSON 解析（将单引号替换为双引号）
      const jsonText = text.replace(/'/g, '"');
      return JSON.parse(jsonText);
    } catch (jsonError) {
      try {
        // 尝试简单的键值对解析
        return this.parseSimpleObject(text);
      } catch (parseError) {
        console.warn('对象解析失败:', text, parseError);
        return {};
      }
    }
  }

  private static parseSimpleObject(text: string): Record<string, any> {
    const result: Record<string, any> = {};
    const content = text.replace(/^\s*\{\s*|\s*\}\s*$/g, '');
    
    if (!content) {
      return result;
    }

    const pairs = content.split(',');
    
    for (const pair of pairs) {
      const colonIndex = pair.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = pair.slice(0, colonIndex).trim().replace(/['"]/g, '');
      const valueStr = pair.slice(colonIndex + 1).trim();
      
      let value: any = valueStr;
      
      if ((valueStr.startsWith('"') && valueStr.endsWith('"')) ||
          (valueStr.startsWith("'") && valueStr.endsWith("'"))) {
        value = valueStr.slice(1, -1);
      } else if (/^\d+$/.test(valueStr)) {
        value = parseInt(valueStr, 10);
      } else if (valueStr === 'true') {
        value = true;
      } else if (valueStr === 'false') {
        value = false;
      }
      
      result[key] = value;
    }
    
    return result;
  }
}

/**
 * 验证工具类
 */
export class ValidationUtils {
  static validateInput(code: string, filePath: string) {
    if (!code?.trim()) {
      return { success: false, error: `Empty code provided for file: ${filePath}` };
    }
    if (!filePath) {
      return { success: false, error: 'File path is required' };
    }
    return { success: true, data: { code, filePath } };
  }

  static validateClassName(className: string) {
    if (!className?.trim()) {
      return { success: false, error: 'Class name is required' };
    }
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(className)) {
      return { success: false, error: 'Invalid class name format' };
    }
    return null;
  }

  static validateMethodName(methodName: string) {
    if (!methodName?.trim()) {
      return { success: false, error: 'Method name is required' };
    }
    if (!/^[a-z][a-zA-Z0-9]*$/.test(methodName)) {
      return { success: false, error: 'Invalid method name format' };
    }
    return null;
  }
}

/**
 * 错误处理工具类
 */
export class ErrorHandler {
  static handleASTError(error: unknown, filePath: string) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      context: `AST 解析错误: ${filePath}`
    };
  }

  static handleSyncError(error: unknown, operation: string) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      context: `同步错误: ${operation}`
    };
  }

  static handleFileError(error: unknown, filePath: string) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      context: `文件操作错误: ${filePath}`
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
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

/**
 * 日志工具类
 */
export class Logger {
  static createContextLogger(context: string) {
    return {
      debug: (message: string, data?: any) => console.log(`[DEBUG][${context}] ${message}`, data || ''),
      info: (message: string, data?: any) => console.log(`[INFO][${context}] ${message}`, data || ''),
      warn: (message: string, data?: any) => console.warn(`[WARN][${context}] ${message}`, data || ''),
      error: (message: string, error?: any) => console.error(`[ERROR][${context}] ${message}`, error || '')
    };
  }

  static error(message: string, error?: any, options?: { context?: string }) {
    const context = options?.context || '';
    console.error(`[ERROR]${context ? `[${context}]` : ''} ${message}`, error || '');
  }
}
