import { log } from '../utils';
import {
  collectAllMethodNames,
  getMethodOccurrences,
  parseDesktopMethodNames,
  getClassBodyRange,
  getServerMethodDecorators,
  parseServerMethodNames,
} from '../parser';
import { MethodDecoratorInfo } from '../types';

export function ensureConstructorArgs(content: string, className: string, serviceConstNames: string[]): string {
  const baseName = className.replace(/Controller$/, '');
  const callRe = new RegExp(`new\\s+_${baseName}Controller\\s*\\(([^)]*)\\)`, 'ms');
  if (!callRe.test(content)) return content;
  return content.replace(callRe, `new _${baseName}Controller(${serviceConstNames.join(', ')})`);
}

export function genMethodWrapper(
  decoratorInfo: MethodDecoratorInfo,
  options: { includeDescription?: boolean } = {}
): string {
  const { name, verb, path: p, description, fullSignature } = decoratorInfo;
  const { includeDescription = false } = options;
  const indent = '  ';
  const lines: string[] = [];

  // 生成装饰器（默认不包含描述）
  if (includeDescription && description) {
    lines.push(`${indent}@${verb}("${p}", { description: "${description}" })`);
  } else {
    lines.push(`${indent}@${verb}("${p}")`);
  }

  // 从 fullSignature 中提取方法签名（去掉装饰器部分）
  if (fullSignature) {
    // fullSignature 包含完整的方法定义，需要提取方法签名部分
    // 使用多行模式的正则表达式来匹配方法签名
    const methodMatch = fullSignature.match(/async\s+(\w+)\s*\(([^)]*(?:\([^)]*\)[^)]*)*)\)\s*:\s*([^{]+)/s);
    if (methodMatch) {
      const [, methodName, params, returnType] = methodMatch;
      
      // 提取参数名（去掉装饰器和类型）
      const paramNames: string[] = [];
      if (params.trim()) {
        // 更精确地解析参数，处理嵌套的泛型类型和装饰器
        const paramList = params.split(',').map(p => p.trim());
        paramList.forEach(param => {
          // 匹配参数名：@Decorator() paramName: Type 或 paramName: Type
          // 支持复杂的类型如 ResponseListVo<TodoVO.TodoWithoutRelationsVo>
          const nameMatch = param.match(/(?:@\w+(?:\([^)]*\))?\s+)?(\w+)(?:\?)?:/);
          if (nameMatch) {
            paramNames.push(nameMatch[1]);
          }
        });
      }

      // 重新构建方法签名
      const methodSignature = `async ${methodName}(${params}): ${returnType.trim()}`;
      
      lines.push(`${indent}${methodSignature} {`);
      lines.push(`${indent}  return this.controller.${name}(${paramNames.join(', ')});`);
      lines.push(`${indent}}`);
    } else {
      // 尝试匹配没有返回类型的方法
      const simpleMethodMatch = fullSignature.match(/async\s+(\w+)\s*\(([^)]*(?:\([^)]*\)[^)]*)*)\)/s);
      if (simpleMethodMatch) {
        const [, methodName, params] = simpleMethodMatch;
        
        // 提取参数名
        const paramNames: string[] = [];
        if (params.trim()) {
          const paramList = params.split(',').map(p => p.trim());
          paramList.forEach(param => {
            const nameMatch = param.match(/(?:@\w+(?:\([^)]*\))?\s+)?(\w+)(?:\?)?:/);
            if (nameMatch) {
              paramNames.push(nameMatch[1]);
            }
          });
        }

        const methodSignature = `async ${methodName}(${params})`;
        
        lines.push(`${indent}${methodSignature} {`);
        lines.push(`${indent}  return this.controller.${name}(${paramNames.join(', ')});`);
        lines.push(`${indent}}`);
      } else {
        // 回退到原来的逻辑
        lines.push(`${indent}async ${name}() {`);
        lines.push(`${indent}  return this.controller.${name}();`);
        lines.push(`${indent}}`);
      }
    }
  } else {
    // 回退到原来的逻辑
    lines.push(`${indent}async ${name}() {`);
    lines.push(`${indent}  return this.controller.${name}();`);
    lines.push(`${indent}}`);
  }
  
  return lines.join('\n');
}

export function removeExtraGeneratedMethods(
  targetContent: string,
  className: string,
  sourceMethodSet: Set<string>
): string {
  const range = getClassBodyRange(targetContent, className);
  if (!range) return targetContent;
  let body = targetContent.slice(range.start, range.end);
  const head = targetContent.slice(0, range.start);
  const tail = targetContent.slice(range.end);

  const nameSet = collectAllMethodNames(body);
  try {
    log('Collected method names:', className, Array.from(nameSet));
  } catch {}

  for (const name of nameSet) {
    if (name === 'constructor') continue;
    if (!sourceMethodSet.has(name)) {
      const occ = getMethodOccurrences(body, name);
      if (occ.length) {
        try {
          log('Removing non-server method:', className, name, 'x', occ.length);
        } catch {}
        occ
          .sort((a, b) => b.start - a.start)
          .forEach(({ start, end }) => {
            body = body.slice(0, start) + body.slice(end);
          });
      }
    }
  }

  for (const name of nameSet) {
    if (name === 'constructor') continue;
    if (!sourceMethodSet.has(name)) continue;
    const occ = getMethodOccurrences(body, name);
    if (occ.length > 1) {
      try {
        log('Removing duplicate methods:', className, name, 'remove', occ.length - 1);
      } catch {}
      occ
        .slice(1)
        .sort((a, b) => b.start - a.start)
        .forEach(({ start, end }) => {
          body = body.slice(0, start) + body.slice(end);
        });
    }
  }

  return head + body + tail;
}

export function syncMissingMethods(targetContent: string, className: string, sourceContent: string): string {
  // 使用AST解析器获取server方法装饰器信息
  const sourceMethodDecorators = getServerMethodDecorators(sourceContent, className);
  const sourceMethods = Array.from(sourceMethodDecorators.keys());
  try {
    log('Server methods parsed for', className, sourceMethods);
  } catch {}

  // 使用AST解析器进行精确的方法级比对和清理
  let next = removeExtraGeneratedMethodsAST(targetContent, className, new Set(sourceMethods));

  const existing = parseDesktopMethodNames(next, className);
  const missing = sourceMethods.filter((n) => !existing.has(n));
  if (missing.length === 0) return next;

  const range = getClassBodyRange(next, className);
  if (!range) return next;
  const before = next.slice(0, range.end);
  const after = next.slice(range.end + 1);

  const newMethods = missing
    .map((name) => {
      const decoratorInfo = sourceMethodDecorators.get(name);
      if (!decoratorInfo) return null;
      return genMethodWrapper(decoratorInfo);
    })
    .filter(Boolean);

  if (newMethods.length === 0) return next;

  const insertion = '\n' + newMethods.join('\n\n') + '\n';
  return before + insertion + '}' + after;
}

// 使用AST解析器的方法清理函数
function removeExtraGeneratedMethodsAST(
  targetContent: string,
  className: string,
  sourceMethodSet: Set<string>
): string {
  const range = getClassBodyRange(targetContent, className);
  if (!range) return targetContent;
  let body = targetContent.slice(range.start, range.end);
  const head = targetContent.slice(0, range.start);
  const tail = targetContent.slice(range.end);

  // 使用传统方法获取desktop文件中的所有方法名（因为AST解析器主要针对server文件）
  const nameSet = collectAllMethodNames(body);
  try {
    log('Collected method names:', className, Array.from(nameSet));
  } catch {}

  // 删除不在server中的方法
  for (const name of nameSet) {
    if (name === 'constructor') continue;
    if (!sourceMethodSet.has(name)) {
      const occ = getMethodOccurrences(body, name);
      if (occ.length) {
        try {
          log('Removing non-server method:', className, name, 'x', occ.length);
        } catch {}
        occ
          .sort((a, b) => b.start - a.start)
          .forEach(({ start, end }) => {
            body = body.slice(0, start) + body.slice(end);
          });
      }
    }
  }

  // 删除重复方法
  for (const name of nameSet) {
    if (name === 'constructor') continue;
    if (!sourceMethodSet.has(name)) continue;
    const occ = getMethodOccurrences(body, name);
    if (occ.length > 1) {
      try {
        log('Removing duplicate methods:', className, name, 'remove', occ.length - 1);
      } catch {}
      occ
        .slice(1)
        .sort((a, b) => b.start - a.start)
        .forEach(({ start, end }) => {
          body = body.slice(0, start) + body.slice(end);
        });
    }
  }

  return head + body + tail;
}
