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

      if (
        (valueStr.startsWith('"') && valueStr.endsWith('"')) ||
        (valueStr.startsWith("'") && valueStr.endsWith("'"))
      ) {
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
