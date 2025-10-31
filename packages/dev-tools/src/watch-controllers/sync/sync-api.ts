import { log } from '../utils';
import {
  parseApiMethodNames,
  getApiClassBodyRange,
  getMethodOccurrences,
  getServerMethodDecorators,
  parseControllerInfo,
} from '../parser';
import { MethodDecoratorInfo } from '../types';

// 生成 API 方法
export function genApiMethodWrapper(decoratorInfo: MethodDecoratorInfo, entityName: string, basePath?: string): string {
  const { name, verb, path, paramStyle, paramTypes, returnType } = decoratorInfo;
  const indent = '  ';
  const lines: string[] = [];

  // 生成方法名 - 基于实际方法信息
  const methodName = generateApiMethodName(name, entityName, verb, path);

  // 合并Controller基础路径和方法路径
  const fullPath = basePath ? `${basePath}${path}` : path;

  // 生成方法签名
  let signature = `${indent}static async ${methodName}(`;
  let requestCall = `request`;
  let pathStr = fullPath;
  let bodyParam = '';

  // 根据参数样式生成不同的方法签名和请求调用
  const httpMethod = verb.toLowerCase() === 'delete' ? 'remove' : verb.toLowerCase();

  // 生成具体的类型注解
  const entityCap = entityName.charAt(0).toUpperCase() + entityName.slice(1);

  // 使用从server controller提取的返回类型
  const genericType = returnType ? `<${returnType}>` : '';

  switch (paramStyle) {
    case 'none':
      signature += ') {';
      requestCall += `${genericType}({ method: "${httpMethod}" })`;
      break;
    case 'id':
      const idType = paramTypes?.idType || 'string';
      signature += `id: ${idType}) {`;
      pathStr = pathStr.replace('/:id', '/${id}');
      requestCall += `${genericType}({ method: "${httpMethod}" })`;
      break;
    case 'id+body':
      const idType2 = paramTypes?.idType || 'string';
      const bodyType = paramTypes?.bodyType || getDefaultBodyType(name, entityCap);
      signature += `id: ${idType2}, body: ${bodyType}) {`;
      pathStr = pathStr.replace('/:id', '/${id}');
      requestCall += `${genericType}({ method: "${httpMethod}" })`;
      bodyParam = ', body';
      break;
    case 'query':
      const queryType = paramTypes?.queryType || getDefaultQueryType(name, entityCap);
      signature += `params: ${queryType}) {`;
      requestCall += `${genericType}({ method: "${httpMethod}" })`;
      bodyParam = ', params';
      break;
    case 'body':
      const bodyType2 = paramTypes?.bodyType || getDefaultBodyType(name, entityCap);
      signature += `body: ${bodyType2}) {`;
      requestCall += `${genericType}({ method: "${httpMethod}" })`;
      bodyParam = ', body';
      break;
  }

  lines.push(signature);
  lines.push(`${indent}  return ${requestCall}(\`${pathStr}\`${bodyParam});`);
  lines.push(`${indent}}`);

  return lines.join('\n');
}

// 根据方法名和实体名生成默认的 body 类型
function getDefaultBodyType(methodName: string, entityCap: string): string {
  switch (methodName) {
    case 'create':
      return `${entityCap}VO.Create${entityCap}Vo`;
    case 'update':
      return `${entityCap}VO.Update${entityCap}Vo`;
    case 'doneBatch':
      return `${entityCap}VO.${entityCap}ListFiltersVo`;
    case 'doneBatch':
      return '{ includeIds?: string[] }';
    default:
      return 'any';
  }
}

// 根据方法名和实体名生成默认的 query 类型
function getDefaultQueryType(methodName: string, entityCap: string): string {
  switch (methodName) {
    case 'page':
      return `${entityCap}VO.${entityCap}PageFiltersVo`;
    case 'list':
      return `${entityCap}VO.${entityCap}ListFiltersVo`;
    default:
      return 'any';
  }
}

// 基于实际方法信息生成 API 方法名
function generateApiMethodName(sourceMethodName: string, entityName: string, verb: string, path: string): string {
  // 直接沿用来源代码 Controller 的方法名
  return sourceMethodName;
}

// 删除过时的API方法
function removeObsoleteApiMethods(
  apiContent: string,
  className: string,
  existingMethods: Set<string>,
  expectedMethods: Set<string>
): string {
  const range = getApiClassBodyRange(apiContent, className);
  if (!range) return apiContent;

  let body = apiContent.slice(range.start, range.end);
  const head = apiContent.slice(0, range.start);
  const tail = apiContent.slice(range.end);

  // 找出需要删除的方法（存在于existing但不在expected中）
  const methodsToRemove = Array.from(existingMethods).filter((method) => !expectedMethods.has(method));

  if (methodsToRemove.length === 0) return apiContent;

  // 删除过时的方法
  for (const methodName of methodsToRemove) {
    const occ = getMethodOccurrences(body, methodName);
    if (occ.length > 0) {
      try {
        log('Removing obsolete API method:', className, methodName, 'x', occ.length);
      } catch {}
      occ
        .sort((a, b) => b.start - a.start)
        .forEach(({ start, end }) => {
          body = body.slice(0, start) + body.slice(end);
        });
    }
  }

  return head + body + tail;
}

// 同步 API controller 方法（精确方法级同步）
export function syncApiMethods(
  apiContent: string,
  className: string,
  sourceContent: string,
  sourceClassName: string
): string {
  // 使用新的Controller信息解析
  const controllerInfo = parseControllerInfo(sourceContent, sourceClassName);
  if (!controllerInfo) {
    // 回退到原有方法
    const sourceMethodDecorators = getServerMethodDecorators(sourceContent, sourceClassName);
    return syncApiMethodsLegacy(apiContent, className, sourceMethodDecorators);
  }

  const sourceMethods = Array.from(controllerInfo.methods.keys());
  const entityName = className.replace('Controller', '');

  // 获取现有的 API 方法
  const existing = parseApiMethodNames(apiContent, className);

  // 生成期望的API方法映射 (sourceMethod -> expectedApiMethodName)
  const expectedApiMethods = new Map<string, string>();
  sourceMethods.forEach((sourceMethod) => {
    const decoratorInfo = controllerInfo.methods.get(sourceMethod);
    if (decoratorInfo) {
      const expectedApiMethodName = generateApiMethodName(
        sourceMethod,
        entityName,
        decoratorInfo.verb,
        decoratorInfo.path
      );
      expectedApiMethods.set(sourceMethod, expectedApiMethodName);
    }
  });

  const expectedApiMethodNames = new Set(expectedApiMethods.values());

  // 1. 清理旧方法：删除不在server中的API方法
  let cleanedContent = removeObsoleteApiMethods(apiContent, className, existing, expectedApiMethodNames);

  // 2. 添加新方法：找出缺失的方法并添加
  const missing = sourceMethods.filter((sourceMethod) => {
    const expectedApiMethodName = expectedApiMethods.get(sourceMethod);
    return expectedApiMethodName && !existing.has(expectedApiMethodName);
  });

  if (missing.length === 0) return cleanedContent;

  // 获取类体范围
  const range = getApiClassBodyRange(cleanedContent, className);
  if (!range) return cleanedContent;

  const before = cleanedContent.slice(0, range.end);
  const after = cleanedContent.slice(range.end);

  // 生成缺失的方法（使用Controller基础路径）
  const newMethods = missing
    .map((sourceMethod) => {
      const decoratorInfo = controllerInfo.methods.get(sourceMethod);
      if (!decoratorInfo) return null;

      const expectedApiMethodName = expectedApiMethods.get(sourceMethod);
      try {
        log('Adding API method:', className, expectedApiMethodName);
      } catch {}

      return genApiMethodWrapper(decoratorInfo, entityName, controllerInfo.basePath);
    })
    .filter(Boolean);

  if (newMethods.length === 0) return cleanedContent;

  // 增量添加新方法
  const insertion = '\n' + newMethods.join('\n\n') + '\n';

  return before + insertion + after;
}

// 回退方法：使用旧的同步逻辑
function syncApiMethodsLegacy(
  apiContent: string,
  className: string,
  sourceMethodDecorators: Map<string, MethodDecoratorInfo>
): string {
  const sourceMethods = Array.from(sourceMethodDecorators.keys());
  if (sourceMethods.length === 0) return apiContent;

  const entityName = className.replace('Controller', '');
  const existing = parseApiMethodNames(apiContent, className);
  const missing = sourceMethods.filter((sourceMethod) => {
    return !Array.from(existing).some((existingMethod: string) => existingMethod.includes(sourceMethod));
  });

  if (missing.length === 0) return apiContent;

  const range = getApiClassBodyRange(apiContent, className);
  if (!range) return apiContent;

  const head = apiContent.slice(0, range.end);
  const tail = apiContent.slice(range.end);

  const missingMethods = missing
    .map((methodName) => {
      const decoratorInfo = sourceMethodDecorators.get(methodName);
      return decoratorInfo ? genApiMethodWrapper(decoratorInfo, entityName) : '';
    })
    .filter(Boolean);

  const body = missingMethods.length > 0 ? '\n' + missingMethods.join('\n\n') + '\n' : '';
  return head + body + tail;
}
