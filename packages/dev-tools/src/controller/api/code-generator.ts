/**
 * 简化的代码生成器
 * 专注于目标代码控制器的代码同步
 */

import { IntermediateState, SyncAction, MethodDefinition, ConstructorDefinition } from '../core/intermediate-state';

export class ControllerApiCodeGenerator {
  /**
   * 应用同步操作到目标代码
   */
  applySyncActions(
    targetCode: string,
    actions: SyncAction[],
    targetState: IntermediateState,
    sourceState: IntermediateState
  ): string {
    let updatedCode = targetCode;

    // 先处理构造函数更新
    const constructorActions = actions.filter((a) => a.type === 'update_constructor');
    for (const action of constructorActions) {
      updatedCode = this.updateConstructor(updatedCode, action.data as ConstructorDefinition, targetState);
    }

    // 然后重新生成整个类体，保持源码方法顺序
    updatedCode = this.regenerateClassBody(updatedCode, sourceState, targetState);

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

    // 1. 保留构造函数实例化行
    const existingBody = code.slice(classBodyRange.start, classBodyRange.end);
    const instanceMatch = existingBody.match(/^\s*(private\s+readonly\s+controller\s*=\s*[^;]+;)/m);
    if (instanceMatch) {
      classBodyLines.push('  ' + instanceMatch[1]);
      classBodyLines.push('');
    }

    // 2. 按源码顺序生成所有方法
    const sourceMethodNames = Array.from(sourceState.methods.keys());
    for (const methodName of sourceMethodNames) {
      const sourceMethod = sourceState.methods.get(methodName);
      if (sourceMethod) {
        const methodCode = this.generateDesktopMethod(sourceMethod);
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
   * 更新构造函数
   */
  private updateConstructor(code: string, constructor: ConstructorDefinition, targetState: IntermediateState): string {
    // 查找控制器实例化行
    const instancePattern = /private\s+readonly\s+controller\s*=\s*new\s+[^;]+;/;
    const match = code.match(instancePattern);

    if (constructor.parameters.length > 0) {
      const serviceNames = constructor.parameters.map((p) => p.name);
      const newInstantiation = `  private readonly controller = new _${targetState.metadata.className}(${serviceNames.join(', ')});`;

      if (match) {
        // 更新现有的实例化行
        return code.replace(instancePattern, newInstantiation);
      } else {
        // 在类开头添加实例化行
        const classStart = code.indexOf('export class ' + targetState.metadata.className);
        if (classStart === -1) return code;

        const classBodyStart = code.indexOf('{', classStart) + 1;
        const before = code.slice(0, classBodyStart);
        const after = code.slice(classBodyStart);

        // 检查是否已经有内容，如果有则添加换行
        const hasContent = after.trim().length > 1; // 排除只有闭合大括号的情况
        const spacing = hasContent ? '\n' : '';

        return before + '\n' + newInstantiation + spacing + after;
      }
    }

    return code;
  }

  /**
   * 生成目标代码方法代码
   */
  private generateDesktopMethod(method: MethodDefinition): string {
    const lines: string[] = [];

    // 生成装饰器
    const { verb, path, decoratorOptions } = method;
    if (decoratorOptions && Object.keys(decoratorOptions).length > 0) {
      const optionsStr = JSON.stringify(decoratorOptions);
      lines.push(`  @${verb}('${path}', ${optionsStr})`);
    } else {
      lines.push(`  @${verb}('${path}')`);
    }

    // 生成方法签名
    const params = method.parameters
      .map((param) => {
        const { decorator, decoratorArgs, name, type, optional } = param;
        // 修复引号问题：检查 decoratorArgs 是否已经包含引号
        let decoratorStr;
        if (decoratorArgs && decoratorArgs.length > 0) {
          const arg = decoratorArgs[0];
          // 如果参数已经包含引号，直接使用；否则添加引号
          const argStr = arg.startsWith("'") && arg.endsWith("'") ? arg : `'${arg}'`;
          decoratorStr = `@${decorator}(${argStr})`;
        } else {
          decoratorStr = `@${decorator}()`;
        }
        const optionalStr = optional ? '?' : '';
        return `${decoratorStr} ${name}${optionalStr}: ${type}`;
      })
      .join(', ');

    // 处理返回类型，避免双重 Promise
    const returnType = method.returnType.startsWith('Promise<') ? method.returnType : `Promise<${method.returnType}>`;
    lines.push(`  async ${method.name}(${params}): ${returnType} {`);

    // 生成方法体 - 简单的代理调用
    const callParams = method.parameters.map((p) => p.name).join(', ');
    lines.push(`    return this.controller.${method.name}(${callParams});`);
    lines.push('  }');

    return lines.join('\n');
  }

  /**
   * 查找类体范围
   */
  private findClassBodyRange(code: string, className: string): { start: number; end: number } | null {
    const classRegex = new RegExp(`export\\s+class\\s+${className}\\s*{`, 'g');
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
   * 查找方法范围 - 最终修复版本
   */
  private findMethodRange(code: string, methodName: string): { start: number; end: number } | null {
    // 使用更简单但更可靠的方法：查找方法名，然后向前向后扩展
    const methodRegex = new RegExp(`async\\s+${methodName}\\s*\\(`, 'g');
    const match = methodRegex.exec(code);

    if (!match) {
      return null;
    }

    // 从匹配位置向前查找装饰器开始
    let start = match.index;
    const lines = code.substring(0, start).split('\n');

    // 向前查找到非装饰器、非空行为止
    let lineIndex = lines.length - 1;
    while (lineIndex > 0) {
      const prevLine = lines[lineIndex - 1].trim();
      if (prevLine.startsWith('@') || prevLine === '') {
        lineIndex--;
      } else {
        break;
      }
    }

    // 重新计算开始位置
    if (lineIndex === 0) {
      start = 0;
    } else {
      start = lines.slice(0, lineIndex).join('\n').length + 1; // +1 for the newline
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
