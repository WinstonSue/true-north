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
