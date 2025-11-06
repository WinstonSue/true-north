/**
 * 日志工具类
 */
export class Logger {
  static createContextLogger(context: string) {
    return {
      debug: (message: string, data?: any) => console.log(`[DEBUG][${context}] ${message}`, data || ''),
      info: (message: string, data?: any) => console.log(`[INFO][${context}] ${message}`, data || ''),
      warn: (message: string, data?: any) => console.warn(`[WARN][${context}] ${message}`, data || ''),
      error: (message: string, error?: any) => console.error(`[ERROR][${context}] ${message}`, error || ''),
    };
  }

  static error(message: string, error?: any, options?: { context?: string }) {
    const context = options?.context || '';
    console.error(`[ERROR]${context ? `[${context}]` : ''} ${message}`, error || '');
  }
}
