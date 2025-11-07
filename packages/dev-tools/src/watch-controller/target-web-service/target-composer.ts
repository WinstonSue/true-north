/**
 * Web Service 代码生成器
 * 专注于根据 Server Controller 生成对应的 Web Service 方法
 */

import { IntermediateState, MethodDefinition } from '../core/intermediate-state/types';
import { SyncAction } from '../core/sync-engine';

export class TargetWebServiceComposer {
  targetState: IntermediateState;
  sourceState: IntermediateState;

  constructor(targetState: IntermediateState, sourceState: IntermediateState) {
    this.targetState = targetState;
    this.sourceState = sourceState;
  }
  /**
   * 应用同步操作到目标代码
   */
  applySyncActions(targetCode: string, _actions: SyncAction[]): string {
    let updatedCode = targetCode;

    // 重新生成整个类体，保持源码方法顺序
    updatedCode = this.regenerateClassBody(updatedCode, this.sourceState, this.targetState);

    return updatedCode;
  }

  /**
   * 重新生成类体，保持源码方法顺序
   */
  private regenerateClassBody(code: string, sourceState: IntermediateState, targetState: IntermediateState): string {
    const classBodyRange = this.findClassBodyRange(code, targetState.metadata.className);
    if (!classBodyRange) {
      return code;
    }

    // 保留类定义之前的部分
    const beforeClass = code.slice(0, classBodyRange.start);
    const afterClass = code.slice(classBodyRange.end);

    // 生成新的类体内容
    const classBodyLines: string[] = [];

    // 按源码顺序生成所有方法
    const sourceMethodNames = Array.from(sourceState.methods.keys());
    for (const methodName of sourceMethodNames) {
      const sourceMethod = sourceState.methods.get(methodName);
      if (sourceMethod) {
        const methodCode = this.generateWebServiceMethod(sourceMethod, targetState.metadata.className);
        classBodyLines.push(methodCode);
        classBodyLines.push('');
      }
    }

    // 移除最后一个空行
    if (classBodyLines[classBodyLines.length - 1] === '') {
      classBodyLines.pop();
    }

    const newClassBody = classBodyLines.join('\n');
    return beforeClass + '\n' + newClassBody + '\n' + afterClass;
  }

  /**
   * 生成 Web Service 方法代码
   */
  private generateWebServiceMethod(method: MethodDefinition, serviceClassName: string): string {
    const lines: string[] = [];

    // 生成 JSDoc 注释
    lines.push('  /**');
    lines.push(`   * ${method.decoratorOptions?.description || method.name}`);

    // 生成参数注释
    for (const param of method.parameters) {
      const paramDesc = this.getParameterDescription(param);
      lines.push(`   * @param ${param.name} ${paramDesc}`);
    }

    lines.push(`   * @returns 操作结果`);
    lines.push('   */');

    // 生成方法签名
    const params = this.generateMethodParameters(method);

    lines.push(`  static async ${method.name}(${params}) {`);

    // 生成方法体
    lines.push('    try {');

    // 生成 Controller 调用
    const controllerCall = this.generateControllerCall(method, serviceClassName);
    lines.push(`      ${controllerCall}`);

    // 生成成功消息（如果需要）
    if (this.needsSuccessMessage(method)) {
      lines.push('      if (!options.silent) {');
      lines.push(`        Message.success('${this.getSuccessMessage(method)}');`);
      lines.push('      }');
    }

    lines.push('      return res;');
    lines.push('    } catch (error: unknown) {');
    lines.push('      Message.error(error);');
    lines.push('    }');
    lines.push('  }');

    return lines.join('\n');
  }

  /**
   * 生成方法参数
   */
  private generateMethodParameters(method: MethodDefinition): string {
    const params: string[] = [];

    for (const param of method.parameters) {
      if (param.decorator === 'Param') {
        // Path 参数
        params.push(`${param.name}: string`);
      } else if (param.decorator === 'Body') {
        // Body 参数
        const voType = this.convertDtoTypeToVoType(param.type);
        params.push(`${param.name}: ${voType}`);
      } else if (param.decorator === 'Query') {
        // Query 参数
        const voType = this.convertDtoTypeToVoType(param.type);
        params.push(`${param.name}${param.optional ? '?' : ''}: ${voType}`);
      }
    }

    // 添加 options 参数（如果方法需要）
    if (this.needsOptionsParameter(method)) {
      params.push('options: MethodOptions');
    }

    return params.join(', ');
  }

  /**
   * 生成 Controller 调用代码
   */
  private generateControllerCall(method: MethodDefinition, serviceClassName: string): string {
    const controllerName = serviceClassName.replace('Service', 'Controller');
    const callParams: string[] = [];

    for (const param of method.parameters) {
      callParams.push(param.name);
    }

    const callParamsStr = callParams.join(', ');

    if (method.returnType.includes('boolean') || method.verb === 'Delete') {
      return `const res = await ${controllerName}.${method.name}(${callParamsStr});`;
    } else {
      return `const res = await ${controllerName}.${method.name}(${callParamsStr});`;
    }
  }

  /**
   * 转换 DTO 类型为 VO 类型
   */
  private convertDtoTypeToVoType(dtoType: string): string {
    // 移除泛型参数
    const baseType = dtoType.replace(/<.*>/, '');

    // 转换常见的 DTO 类型
    if (baseType.includes('FilterDto')) {
      return baseType.replace('FilterDto', 'FilterVo');
    } else if (baseType.includes('PageFilterDto')) {
      return baseType.replace('PageFilterDto', 'PageFilterVo');
    } else if (baseType.includes('CreateDto')) {
      return baseType.replace('CreateDto', 'CreateVo');
    } else if (baseType.includes('UpdateDto')) {
      return baseType.replace('UpdateDto', 'UpdateVo');
    } else if (baseType.includes('Dto')) {
      return baseType.replace('Dto', 'Vo');
    }

    return dtoType;
  }

  /**
   * 获取参数描述
   */
  private getParameterDescription(param: any): string {
    if (param.decorator === 'Param') {
      return `${param.name}ID`;
    } else if (param.decorator === 'Body') {
      return '请求体数据';
    } else if (param.decorator === 'Query') {
      return '查询参数';
    }
    return '参数';
  }

  /**
   * 判断是否需要成功消息
   */
  private needsSuccessMessage(method: MethodDefinition): boolean {
    const mutatingVerbs = ['Post', 'Put', 'Delete', 'Patch'];
    return mutatingVerbs.includes(method.verb);
  }

  /**
   * 判断是否需要 options 参数
   */
  private needsOptionsParameter(method: MethodDefinition): boolean {
    return this.needsSuccessMessage(method);
  }

  /**
   * 获取成功消息
   */
  private getSuccessMessage(method: MethodDefinition): string {
    switch (method.verb) {
      case 'Post':
        return '创建成功';
      case 'Put':
      case 'Patch':
        return '操作成功';
      case 'Delete':
        return '删除成功';
      default:
        return '操作成功';
    }
  }

  /**
   * 查找类体范围
   */
  private findClassBodyRange(code: string, className: string): { start: number; end: number } | null {
    const classRegex = new RegExp(`export\\s+default\\s+class\\s+${className}\\s*{`, 'g');
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
}
