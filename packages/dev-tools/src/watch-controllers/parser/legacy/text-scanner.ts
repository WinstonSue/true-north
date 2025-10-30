/**
 * 文本扫描和定位工具
 * 提供括号匹配、字符串识别、代码块边界检测等功能
 */

/**
 * 从指定的括号位置开始，找到对应方法体的开始大括号位置
 * 支持嵌套括号、泛型、数组等复杂语法
 */
export function findMethodBodyOpenBraceIndex(body: string, parenIndex: number): number {
  let i = parenIndex;
  let paren = 1; // we're on '('
  let angle = 0;
  let square = 0;
  let braceType = 0;
  let inLineComment = false;
  let inBlockComment = false;
  let inString: false | '"' | "'" | '`' = false;
  let escaped = false;
  
  while (i < body.length) {
    i++;
    const ch = body[i];
    const prev = body[i - 1];
    
    // 处理行注释
    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    
    // 处理块注释
    if (inBlockComment) {
      if (prev === '*' && ch === '/') inBlockComment = false;
      continue;
    }
    
    // 检测注释开始
    if (!inString) {
      if (prev === '/' && ch === '/') {
        inLineComment = true;
        continue;
      }
      if (prev === '/' && ch === '*') {
        inBlockComment = true;
        continue;
      }
    }
    
    // 处理字符串
    if (inString) {
      if (!escaped && ch === inString) inString = false;
      escaped = !escaped && ch === '\\';
      continue;
    } else if (ch === '"' || ch === "'" || ch === '`') {
      inString = ch as '"' | "'" | '`';
      escaped = false;
      continue;
    }
    
    // 处理括号匹配
    if (ch === '(') {
      paren++;
      continue;
    }
    if (ch === ')') {
      paren--;
      if (paren < 0) paren = 0;
      continue;
    }
    
    // 当括号匹配完成后，处理其他符号
    if (paren === 0) {
      if (ch === '<') {
        angle++;
        continue;
      }
      if (ch === '>') {
        if (angle > 0) angle--;
        continue;
      }
      if (ch === '[') {
        square++;
        continue;
      }
      if (ch === ']') {
        if (square > 0) square--;
        continue;
      }
      if (ch === '{') {
        if (braceType === 0 && angle === 0 && square === 0) return i;
        braceType++;
        continue;
      }
      if (ch === '}') {
        if (braceType > 0) braceType--;
        continue;
      }
    }
  }
  return -1;
}

/**
 * 查找所有顶级方法块的位置
 * 返回方法名和其在代码中的起始、结束位置
 */
export function findAllTopLevelMethodBlocks(body: string): Array<{ name: string; start: number; end: number }> {
  const results: Array<{ name: string; start: number; end: number }> = [];
  const sigRe = /(^|\n)\s*(?:public|private|protected)?\s*(?:async\s+)?([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/g;
  let m: RegExpExecArray | null;
  
  while ((m = sigRe.exec(body)) !== null) {
    const name = m[2];
    const parenPos = sigRe.lastIndex - 1;
    const bracePos = findMethodBodyOpenBraceIndex(body, parenPos);
    if (bracePos === -1) continue;
    
    // 检查是否在顶级作用域
    const prefix = body.slice(0, bracePos);
    let depth = 0;
    for (let i = 0; i < prefix.length; i++) {
      const ch = prefix[i];
      if (ch === '{') depth++;
      if (ch === '}') depth--;
    }
    if (depth !== 0) continue;
    
    // 找到方法体结束位置
    const endPos = findMatchingCloseBrace(body, bracePos);
    if (endPos === -1) continue;
    
    results.push({ name, start: bracePos, end: endPos });
  }
  return results;
}

/**
 * 找到与指定开括号匹配的闭括号位置
 */
export function findMatchingCloseBrace(body: string, openBracePos: number): number {
  let depth = 1;
  let inLineComment = false;
  let inBlockComment = false;
  let inString: false | '"' | "'" | '`' = false;
  let escaped = false;
  
  for (let i = openBracePos + 1; i < body.length; i++) {
    const ch = body[i];
    const prev = body[i - 1];
    
    // 处理注释
    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (prev === '*' && ch === '/') inBlockComment = false;
      continue;
    }
    if (!inString) {
      if (prev === '/' && ch === '/') {
        inLineComment = true;
        continue;
      }
      if (prev === '/' && ch === '*') {
        inBlockComment = true;
        continue;
      }
    }
    
    // 处理字符串
    if (inString) {
      if (!escaped && ch === inString) inString = false;
      escaped = !escaped && ch === '\\';
      continue;
    } else if (ch === '"' || ch === "'" || ch === '`') {
      inString = ch as '"' | "'" | '`';
      escaped = false;
      continue;
    }
    
    // 处理大括号
    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  
  return -1;
}
