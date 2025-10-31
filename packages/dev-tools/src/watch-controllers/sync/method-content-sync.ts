import { getClassBodyRange, getMethodOccurrences } from '../parser';

/**
 * 方法内容级别的同步信息
 */
export interface MethodContentInfo {
  name: string;
  signature: string;
  parameters: ParameterInfo[];
  decorators: DecoratorInfo[];
  body: string;
  hash: string; // 内容哈希，用于快速比对
}

export interface ParameterInfo {
  name: string;
  type: string;
  decorator?: string; // @Body, @Query, @Param 等
  decoratorArgs?: string;
}

export interface DecoratorInfo {
  name: string;
  args: string;
}

/**
 * 方法变更类型
 */
export enum MethodChangeType {
  SIGNATURE_CHANGED = 'signature_changed',
  PARAMETERS_CHANGED = 'parameters_changed', 
  DECORATORS_CHANGED = 'decorators_changed',
  BODY_CHANGED = 'body_changed',
  NO_CHANGE = 'no_change'
}

export interface MethodChange {
  methodName: string;
  changeType: MethodChangeType;
  sourceMethod: MethodContentInfo;
  targetMethod?: MethodContentInfo;
  details: string;
}

/**
 * 解析方法的详细内容信息
 */
export function parseMethodContent(content: string, className: string, methodName: string): MethodContentInfo | null {
  const range = getClassBodyRange(content, className);
  if (!range) return null;

  const body = content.slice(range.start, range.end);
  const occurrences = getMethodOccurrences(body, methodName);
  
  if (occurrences.length === 0) return null;
  
  // 取第一个匹配的方法
  const methodOccurrence = occurrences[0];
  const methodText = body.slice(methodOccurrence.start, methodOccurrence.end);
  
  return parseMethodText(methodText, methodName);
}

/**
 * 解析方法文本内容
 */
function parseMethodText(methodText: string, methodName: string): MethodContentInfo {
  const lines = methodText.split('\n');
  
  // 解析装饰器
  const decorators: DecoratorInfo[] = [];
  let methodStartLine = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const decoratorMatch = line.match(/^@([A-Za-z]+)\s*\((.+)\)\s*$/);
    
    if (decoratorMatch) {
      decorators.push({
        name: decoratorMatch[1],
        args: decoratorMatch[2]
      });
    } else if (line.includes(`${methodName}(`)) {
      methodStartLine = i;
      break;
    }
  }
  
  // 解析方法签名
  let signatureLine = lines[methodStartLine].trim();
  let nextLineIndex = methodStartLine + 1;
  
  // 处理多行方法签名
  while (nextLineIndex < lines.length && !signatureLine.includes('{')) {
    signatureLine += ' ' + lines[nextLineIndex].trim();
    nextLineIndex++;
  }
  
  // 提取方法体
  const bodyStartIndex = methodText.indexOf('{');
  const bodyEndIndex = methodText.lastIndexOf('}');
  const body = bodyStartIndex !== -1 && bodyEndIndex !== -1 
    ? methodText.slice(bodyStartIndex + 1, bodyEndIndex).trim()
    : '';
  
  // 解析参数
  const parameters = parseMethodParameters(signatureLine);
  
  // 生成内容哈希
  const hash = generateMethodHash(signatureLine, parameters, decorators, body);
  
  return {
    name: methodName,
    signature: signatureLine,
    parameters,
    decorators,
    body,
    hash
  };
}

/**
 * 解析方法参数
 */
function parseMethodParameters(signature: string): ParameterInfo[] {
  const parameters: ParameterInfo[] = [];
  
  // 提取参数部分
  const paramMatch = signature.match(/\(([^)]*)\)/);
  if (!paramMatch || !paramMatch[1].trim()) return parameters;
  
  const paramString = paramMatch[1];
  const paramParts = splitParameters(paramString);
  
  for (const part of paramParts) {
    const param = parseParameter(part.trim());
    if (param) parameters.push(param);
  }
  
  return parameters;
}

/**
 * 智能分割参数（处理泛型和嵌套类型）
 */
function splitParameters(paramString: string): string[] {
  const params: string[] = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < paramString.length; i++) {
    const char = paramString[i];
    
    if (!inString && (char === '"' || char === "'")) {
      inString = true;
      stringChar = char;
    } else if (inString && char === stringChar) {
      inString = false;
    } else if (!inString) {
      if (char === '<' || char === '{' || char === '(') {
        depth++;
      } else if (char === '>' || char === '}' || char === ')') {
        depth--;
      } else if (char === ',' && depth === 0) {
        params.push(current.trim());
        current = '';
        continue;
      }
    }
    
    current += char;
  }
  
  if (current.trim()) {
    params.push(current.trim());
  }
  
  return params;
}

/**
 * 解析单个参数
 */
function parseParameter(paramText: string): ParameterInfo | null {
  // 匹配装饰器参数：@Decorator('args') name: Type
  const decoratorMatch = paramText.match(/^@([A-Za-z]+)\s*\(([^)]*)\)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*:\s*(.+)$/);
  
  if (decoratorMatch) {
    return {
      name: decoratorMatch[3],
      type: decoratorMatch[4].trim(),
      decorator: decoratorMatch[1],
      decoratorArgs: decoratorMatch[2]
    };
  }
  
  // 匹配普通参数：name: Type
  const normalMatch = paramText.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\s*:\s*(.+)$/);
  
  if (normalMatch) {
    return {
      name: normalMatch[1],
      type: normalMatch[2].trim()
    };
  }
  
  return null;
}

/**
 * 生成方法内容哈希
 */
function generateMethodHash(signature: string, parameters: ParameterInfo[], decorators: DecoratorInfo[], body: string): string {
  const content = JSON.stringify({
    signature: signature.replace(/\s+/g, ' ').trim(),
    parameters,
    decorators,
    body: body.replace(/\s+/g, ' ').trim()
  });
  
  // 简单哈希算法
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  
  return hash.toString(16);
}

/**
 * 比对两个方法的内容差异
 */
export function compareMethodContent(
  sourceMethod: MethodContentInfo,
  targetMethod: MethodContentInfo | null
): MethodChange {
  if (!targetMethod) {
    return {
      methodName: sourceMethod.name,
      changeType: MethodChangeType.BODY_CHANGED,
      sourceMethod,
      details: 'Method not found in desktop controller'
    };
  }
  
  // 快速哈希比对
  if (sourceMethod.hash === targetMethod.hash) {
    return {
      methodName: sourceMethod.name,
      changeType: MethodChangeType.NO_CHANGE,
      sourceMethod,
      targetMethod,
      details: 'No changes detected'
    };
  }
  
  // 详细比对
  const changes: string[] = [];
  
  // 比对装饰器
  if (!compareDecorators(sourceMethod.decorators, targetMethod.decorators)) {
    changes.push('decorators changed');
  }
  
  // 比对参数
  if (!compareParameters(sourceMethod.parameters, targetMethod.parameters)) {
    changes.push('parameters changed');
  }
  
  // 比对方法体
  if (sourceMethod.body !== targetMethod.body) {
    changes.push('method body changed');
  }
  
  let changeType = MethodChangeType.BODY_CHANGED;
  if (changes.includes('decorators changed')) {
    changeType = MethodChangeType.DECORATORS_CHANGED;
  } else if (changes.includes('parameters changed')) {
    changeType = MethodChangeType.PARAMETERS_CHANGED;
  }
  
  return {
    methodName: sourceMethod.name,
    changeType,
    sourceMethod,
    targetMethod,
    details: changes.join(', ')
  };
}

/**
 * 比对装饰器
 */
function compareDecorators(server: DecoratorInfo[], desktop: DecoratorInfo[]): boolean {
  if (server.length !== desktop.length) return false;
  
  for (let i = 0; i < server.length; i++) {
    const s = server[i];
    const d = desktop[i];
    
    if (s.name !== d.name || s.args !== d.args) {
      return false;
    }
  }
  
  return true;
}

/**
 * 比对参数
 */
function compareParameters(server: ParameterInfo[], desktop: ParameterInfo[]): boolean {
  if (server.length !== desktop.length) return false;
  
  for (let i = 0; i < server.length; i++) {
    const s = server[i];
    const d = desktop[i];
    
    if (s.name !== d.name || 
        s.type !== d.type || 
        s.decorator !== d.decorator || 
        s.decoratorArgs !== d.decoratorArgs) {
      return false;
    }
  }
  
  return true;
}

/**
 * 检测所有方法的内容变更
 */
export function detectMethodContentChanges(
  sourceContent: string,
  targetContent: string,
  className: string,
  sourceMethods: string[]
): MethodChange[] {
  const changes: MethodChange[] = [];
  
  for (const methodName of sourceMethods) {
    const sourceMethod = parseMethodContent(sourceContent, className, methodName);
    if (!sourceMethod) continue;
    
    const targetMethod = parseMethodContent(targetContent, className, methodName);
    const change = compareMethodContent(sourceMethod, targetMethod);
    
    if (change.changeType !== MethodChangeType.NO_CHANGE) {
      changes.push(change);
    }
  }
  
  return changes;
}

/**
 * 同步方法内容变更
 */
export function syncMethodContentChanges(
  targetContent: string,
  className: string,
  changes: MethodChange[]
): string {
  let result = targetContent;
  
  // 按方法名分组，处理每个需要更新的方法
  for (const change of changes) {
    if (change.changeType === MethodChangeType.NO_CHANGE) continue;
    
    result = syncSingleMethodContent(result, className, change);
  }
  
  return result;
}

/**
 * 同步单个方法的内容
 */
function syncSingleMethodContent(
  targetContent: string,
  className: string,
  change: MethodChange
): string {
  const range = getClassBodyRange(targetContent, className);
  if (!range) return targetContent;
  
  const body = targetContent.slice(range.start, range.end);
  const occurrences = getMethodOccurrences(body, change.methodName);
  
  if (occurrences.length === 0) {
    // 方法不存在，添加新方法
    return addNewMethod(targetContent, className, change.sourceMethod);
  }
  
  // 替换现有方法
  const methodOccurrence = occurrences[0];
  const before = targetContent.slice(0, range.start + methodOccurrence.start);
  const after = targetContent.slice(range.start + methodOccurrence.end);
  
  const newMethodContent = generateDesktopMethodContent(change.sourceMethod);
  
  return before + newMethodContent + after;
}

/**
 * 添加新方法
 */
function addNewMethod(
  targetContent: string,
  className: string,
  sourceMethod: MethodContentInfo
): string {
  const range = getClassBodyRange(targetContent, className);
  if (!range) return targetContent;
  
  const before = targetContent.slice(0, range.end);
  const after = targetContent.slice(range.end);
  
  const newMethodContent = generateDesktopMethodContent(sourceMethod);
  const insertion = '\n' + newMethodContent + '\n';
  
  return before + insertion + '}' + after;
}

/**
 * 根据来源代码方法信息生成目标代码方法内容
 */
function generateDesktopMethodContent(sourceMethod: MethodContentInfo): string {
  // 转换装饰器
  const decorators = sourceMethod.decorators.map(d => `  @${d.name}(${d.args})`).join('\n');
  
  // 转换方法签名
  const desktopSignature = convertServerSignatureToDesktop(sourceMethod.signature, sourceMethod.parameters);
  
  // 生成方法体
  const methodBody = generateDesktopMethodBody(sourceMethod);
  
  return `${decorators}\n  ${desktopSignature} {\n${methodBody}\n  }`;
}

/**
 * 转换来源代码方法签名为目标代码签名
 */
function convertServerSignatureToDesktop(signature: string, parameters: ParameterInfo[]): string {
  // 提取方法名
  const methodNameMatch = signature.match(/async\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/);
  if (!methodNameMatch) return signature;
  
  const methodName = methodNameMatch[1];
  
  // 构建目标代码参数
  const targetParams = parameters.map(param => {
    if (param.decorator) {
      // 对于装饰器参数，需要正确处理参数名映射
      let decoratorArg = param.decoratorArgs || `"${param.name}"`;
      
      // 特殊处理 @Param('id') 的情况
      if (param.decorator === 'Param' && param.name === 'id') {
        decoratorArg = '"id"';
      }
      
      return `@${param.decorator}(${decoratorArg}) ${param.name}: ${param.type}`;
    }
    return `${param.name}: ${param.type}`;
  }).join(', ');
  
  return `async ${methodName}(${targetParams})`;
}

/**
 * 生成目标代码方法体
 */
function generateDesktopMethodBody(sourceMethod: MethodContentInfo): string {
  const methodName = sourceMethod.name;
  const parameters = sourceMethod.parameters;
  
  // 构建调用参数
  const callArgs: string[] = [];
  
  for (const param of parameters) {
    if (param.decorator === 'Param' && param.name === 'id') {
      callArgs.push('id');
    } else if (param.decorator === 'Body') {
      callArgs.push(param.name); // 使用实际参数名
    } else if (param.decorator === 'Query') {
      callArgs.push(param.name); // 使用实际参数名
    } else {
      callArgs.push(param.name);
    }
  }
  
  const callArgsStr = callArgs.join(', ');
  
  return `    return this.controller.${methodName}(${callArgsStr});`;
}
