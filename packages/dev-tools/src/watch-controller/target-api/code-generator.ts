/**
 * API 控制器代码生成器
 * 专门处理 API Controller 的代码生成和同步
 */

import { IntermediateState, SyncAction, MethodDefinition } from '../core/intermediate-state';

export class ControllerApiCodeGenerator {
  /**
   * 应用同步操作到 API 控制器代码
   */
  applySyncActions(
    targetCode: string,
    actions: SyncAction[],
    targetState: IntermediateState,
    sourceState: IntermediateState
  ): string {
    let updatedCode = targetCode;

    // 处理方法的增删改
    for (const action of actions) {
      switch (action.type) {
        case 'add_method':
          updatedCode = this.addMethod(updatedCode, action.data as MethodDefinition, targetState, sourceState);
          break;
        case 'remove_method':
          if (action.methodName) {
            updatedCode = this.removeMethod(updatedCode, action.methodName);
          }
          break;
        case 'update_method':
          if (action.methodName) {
            updatedCode = this.updateMethod(updatedCode, action.methodName, action.data as MethodDefinition, targetState, sourceState);
          }
          break;
      }
    }

    return updatedCode;
  }

  /**
   * 添加新的 API 方法
   */
  private addMethod(code: string, method: MethodDefinition, targetState: IntermediateState, sourceState: IntermediateState): string {
    const classBodyRange = this.findClassBodyRange(code, targetState.metadata.className);
    if (!classBodyRange) {
      return code;
    }

    // 修复：classBodyRange.end 是闭合大括号的位置，需要在它之前插入方法
    const beforeClosingBrace = code.slice(0, classBodyRange.end);
    const closingBraceAndAfter = code.slice(classBodyRange.end);

    // 生成 API 方法代码
    const methodCode = this.generateApiMethod(method, sourceState);
    
    // 在类的闭合大括号之前添加新方法
    return beforeClosingBrace + '\n' + methodCode + '\n' + closingBraceAndAfter;
  }

  /**
   * 移除 API 方法
   */
  private removeMethod(code: string, methodName: string): string {
    const methodRange = this.findMethodRange(code, methodName);
    if (!methodRange) {
      return code;
    }

    const before = code.slice(0, methodRange.start);
    const after = code.slice(methodRange.end);
    
    return before + after;
  }

  /**
   * 更新 API 方法
   */
  private updateMethod(code: string, methodName: string, method: MethodDefinition, targetState: IntermediateState, sourceState: IntermediateState): string {
    // 先移除旧方法，再添加新方法
    let updatedCode = this.removeMethod(code, methodName);
    return this.addMethod(updatedCode, method, targetState, sourceState);
  }

  /**
   * 生成 API 方法代码
   */
  private generateApiMethod(method: MethodDefinition, sourceState: IntermediateState): string {
    const lines: string[] = [];
    const entityName = sourceState.metadata.className.replace('Controller', '');
    const entityCap = entityName.charAt(0).toUpperCase() + entityName.slice(1);

    // 生成方法名 - 直接使用源方法名
    const methodName = method.name;

    // 合并Controller基础路径和方法路径
    const basePath = sourceState.metadata.basePath || '';
    const fullPath = basePath ? `${basePath}${method.path}` : method.path;

    // 生成方法签名和请求调用
    let signature = `  static async ${methodName}(`;
    let requestCall = `request`;
    let pathStr = fullPath;
    let bodyParam = '';

    // 根据参数样式生成不同的方法签名和请求调用
    const httpMethod = method.verb.toLowerCase() === 'delete' ? 'remove' : method.verb.toLowerCase();

    // 使用从server controller提取的返回类型，移除Promise包装（因为API方法本身就是async）
    let returnType = method.returnType || 'any';
    if (returnType.startsWith('Promise<') && returnType.endsWith('>')) {
      returnType = returnType.slice(8, -1); // 移除 Promise< 和 >
    }
    const genericType = `<${returnType}>`;

    // 根据方法参数生成对应的 API 方法参数
    let paramStyle = this.detectParameterStyle(method);

    switch (paramStyle) {
      case 'none':
        signature += ') {';
        requestCall += `${genericType}({ method: "${httpMethod}" })`;
        break;
      case 'id':
        const idType = this.extractIdType(method) || 'string';
        signature += `id: ${idType}) {`;
        pathStr = pathStr.replace('/:id', '/${id}');
        requestCall += `${genericType}({ method: "${httpMethod}" })`;
        break;
      case 'id+body':
        const idType2 = this.extractIdType(method) || 'string';
        const bodyType = this.getDefaultBodyType(methodName, entityCap);
        signature += `id: ${idType2}, body: ${bodyType}) {`;
        pathStr = pathStr.replace('/:id', '/${id}');
        requestCall += `${genericType}({ method: "${httpMethod}" })`;
        bodyParam = ', body';
        break;
      case 'id+query':
        const idType3 = this.extractIdType(method) || 'string';
        const queryType2 = this.extractQueryType(method) || 'any';
        signature += `id: ${idType3}, params?: ${queryType2}) {`;
        pathStr = pathStr.replace('/:id', '/${id}');
        requestCall += `${genericType}({ method: "${httpMethod}" })`;
        bodyParam = ', params';
        break;
      case 'query':
        const queryType = this.extractQueryType(method) || this.getDefaultQueryType(methodName, entityCap);
        const queryParam = method.parameters.find(p => p.decorator === 'Query');
        const isQueryOptional = queryParam?.optional || false;
        signature += `params${isQueryOptional ? '?' : ''}: ${queryType}) {`;
        requestCall += `${genericType}({ method: "${httpMethod}" })`;
        bodyParam = ', params';
        break;
      case 'body':
        const bodyType2 = this.extractBodyType(method) || this.getDefaultBodyType(methodName, entityCap);
        signature += `body: ${bodyType2}) {`;
        requestCall += `${genericType}({ method: "${httpMethod}" })`;
        bodyParam = ', body';
        break;
      case 'query+body':
        const queryType3 = this.extractQueryType(method) || `${entityCap}VO.${entityCap}FilterVo`;
        const bodyType3 = this.extractBodyType(method) || 'any';
        signature += `query: ${queryType3}, body: ${bodyType3}) {`;
        requestCall += `${genericType}({ method: "${httpMethod}" })`;
        bodyParam = ', body';
        // 对于 query+body，需要特殊处理 URL 参数
        pathStr = `${pathStr}?\${new URLSearchParams(query as any).toString()}`;
        break;
    }

    lines.push(signature);
    lines.push(`    return ${requestCall}(\`${pathStr}\`${bodyParam});`);
    lines.push('  }');

    return lines.join('\n');
  }

  /**
   * 检测参数样式
   */
  private detectParameterStyle(method: MethodDefinition): 'none' | 'id' | 'id+body' | 'id+query' | 'query' | 'body' | 'query+body' {
    if (method.parameters.length === 0) {
      return 'none';
    }

    const hasId = method.parameters.some(p => p.decorator === 'Param' && p.name === 'id');
    const hasBody = method.parameters.some(p => p.decorator === 'Body');
    const hasQuery = method.parameters.some(p => p.decorator === 'Query');

    if (hasId && hasBody) {
      return 'id+body';
    } else if (hasId && hasQuery) {
      return 'id+query';
    } else if (hasQuery && hasBody) {
      return 'query+body';
    } else if (hasId) {
      return 'id';
    } else if (hasQuery) {
      return 'query';
    } else if (hasBody) {
      return 'body';
    }

    return 'none';
  }

  /**
   * 提取 ID 类型
   */
  private extractIdType(method: MethodDefinition): string | null {
    const idParam = method.parameters.find(p => p.decorator === 'Param' && p.name === 'id');
    return idParam ? idParam.type : null;
  }

  /**
   * 提取 Query 类型
   */
  private extractQueryType(method: MethodDefinition): string | null {
    const queryParam = method.parameters.find(p => p.decorator === 'Query');
    return queryParam ? queryParam.type : null;
  }

  /**
   * 提取 Body 类型
   */
  private extractBodyType(method: MethodDefinition): string | null {
    const bodyParam = method.parameters.find(p => p.decorator === 'Body');
    return bodyParam ? bodyParam.type : null;
  }

  /**
   * 根据方法名和实体名生成默认的 body 类型
   */
  private getDefaultBodyType(methodName: string, entityCap: string): string {
    switch (methodName) {
      case 'create':
        return `${entityCap}VO.Create${entityCap}Vo`;
      case 'update':
      case 'updateWithRepeat':
        return `${entityCap}VO.Update${entityCap}Vo`;
      case 'doneBatch':
      case 'doneWithRepeatBatch':
        return `${entityCap}VO.${entityCap}ListFilterVo`;
      default:
        return 'any';
    }
  }

  /**
   * 根据方法名和实体名生成默认的 query 类型
   */
  private getDefaultQueryType(methodName: string, entityCap: string): string {
    switch (methodName) {
      case 'page':
        return `${entityCap}VO.${entityCap}PageFilterVo`;
      case 'list':
      case 'listMixRepeat':
        return `${entityCap}VO.${entityCap}ListFilterVo`;
      case 'findByFilter':
        return `${entityCap}VO.${entityCap}FilterVo`;
      default:
        return 'any';
    }
  }

  /**
   * 查找类体范围
   */
  private findClassBodyRange(code: string, className: string): { start: number; end: number } | null {
    const classRegex = new RegExp(`export\\s+(?:default\\s+)?class\\s+${className}\\s*{`, 'g');
    const match = classRegex.exec(code);

    if (!match) {
      return null;
    }

    const startBrace = code.indexOf('{', match.index);
    if (startBrace === -1) {
      return null;
    }

    // 找到匹配的闭合大括号
    let braceCount = 1;
    let i = startBrace + 1;

    while (i < code.length && braceCount > 0) {
      if (code[i] === '{') {
        braceCount++;
      } else if (code[i] === '}') {
        braceCount--;
      }
      i++;
    }

    return {
      start: startBrace + 1,
      end: i - 1,
    };
  }

  /**
   * 查找方法范围
   */
  private findMethodRange(code: string, methodName: string): { start: number; end: number } | null {
    // 查找静态方法
    const methodRegex = new RegExp(`static\\s+async\\s+${methodName}\\s*\\(`, 'g');
    const match = methodRegex.exec(code);

    if (!match) {
      return null;
    }

    // 找到方法开始位置（包括前面的空行）
    let start = match.index;
    const lines = code.substring(0, start).split('\n');
    
    // 向前查找到非空行为止
    let lineIndex = lines.length - 1;
    while (lineIndex > 0 && lines[lineIndex - 1].trim() === '') {
      lineIndex--;
    }

    // 重新计算开始位置
    if (lineIndex === 0) {
      start = 0;
    } else {
      start = lines.slice(0, lineIndex).join('\n').length + 1;
    }

    // 找到方法体结束
    const methodBodyStart = code.indexOf('{', match.index);
    if (methodBodyStart === -1) return null;

    let braceCount = 1;
    let i = methodBodyStart + 1;

    while (i < code.length && braceCount > 0) {
      if (code[i] === '{') {
        braceCount++;
      } else if (code[i] === '}') {
        braceCount--;
      }
      i++;
    }

    // 包含方法后的空行
    while (i < code.length && (code[i] === '\n' || code[i] === '\r')) {
      i++;
    }

    return {
      start,
      end: i,
    };
  }
}
