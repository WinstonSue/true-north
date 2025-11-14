/**
 * 代码恢复工具
 * 基于中间态中挂载的 AST 数据进行代码恢复
 */

import { IntermediateState } from '../intermediate-state/types';
import { ASTClassInfo } from './ast-types';

export interface ASTComposerOptions {
  /** 是否保留原始格式 */
  preserveFormatting?: boolean;
  /** 是否保留注释 */
  preserveComments?: boolean;
  /** 缩进字符 */
  indentChar?: string;
  /** 缩进大小 */
  indentSize?: number;
}

/**
 * 代码恢复器
 * 从中间态的 AST 数据恢复源代码
 */
export class ASTComposer {
  private defaultOptions: Required<ASTComposerOptions> = {
    preserveFormatting: true,
    preserveComments: true,
    indentChar: ' ',
    indentSize: 2,
  };

  /**
   * 从 AST 生成代码
   */
  generateCodeFromAST(astData: ASTClassInfo, options?: ASTComposerOptions): string {
    const opts = { ...this.defaultOptions, ...options };
    const lines: string[] = [];
    const indent = opts.indentChar.repeat(opts.indentSize);

    // 生成导入语句
    astData.imports.forEach((importDecl) => {
      lines.push(this.generateImportStatement(importDecl));
    });

    if (astData.imports.length > 0) {
      lines.push(''); // 空行分隔
    }

    // 生成类声明开始
    const classDecorators = astData.decorators.map((d) => this.generateDecorator(d)).join('\n');

    if (classDecorators) {
      lines.push(classDecorators);
    }

    const exportKeyword = astData.isDefaultExport ? 'export default class' : 'export class';
    lines.push(`${exportKeyword} ${astData.className} {`);

    // 生成构造函数
    if (astData.constructor) {
      lines.push('');
      lines.push(indent + this.generateConstructor(astData.constructor, indent));
    }

    // 生成方法
    astData.methods.forEach((method) => {
      lines.push('');
      lines.push(indent + this.generateMethod(method, indent));
    });

    lines.push('}');

    return lines.join('\n');
  }

  /**
   * 生成导入语句
   */
  private generateImportStatement(importDecl: any): string {
    const { specifiers, source, importType } = importDecl;

    if (importType === 'default') {
      const defaultImport = specifiers.find((s: any) => s.imported === 'default');
      return `import ${defaultImport?.local} from '${source}';`;
    }

    if (importType === 'namespace') {
      const namespaceImport = specifiers.find((s: any) => s.imported === '*');
      return `import * as ${namespaceImport?.local} from '${source}';`;
    }

    if (importType === 'type') {
      // type import
      const namedImports = specifiers
        .filter((s: any) => s.imported !== 'default' && s.imported !== '*')
        .map((s: any) => (s.imported === s.local ? s.imported : `${s.imported} as ${s.local}`))
        .join(', ');
      return `import type { ${namedImports} } from '${source}';`;
    }

    // named imports
    const namedImports = specifiers
      .filter((s: any) => s.imported !== 'default' && s.imported !== '*')
      .map((s: any) => (s.imported === s.local ? s.imported : `${s.imported} as ${s.local}`))
      .join(', ');

    return `import { ${namedImports} } from '${source}';`;
  }

  /**
   * 生成装饰器
   */
  private generateDecorator(decorator: any): string {
    if (decorator.arguments.length === 0) {
      return `@${decorator.name}`;
    }

    const args = decorator.arguments.map((arg: any) => arg.rawText).join(', ');

    return `@${decorator.name}(${args})`;
  }

  /**
   * 生成构造函数
   */
  private generateConstructor(constructor: any, _indent: string): string {
    const params = constructor.parameters
      .map((p: any) => {
        const modifiers = p.modifiers.length > 0 ? p.modifiers.join(' ') + ' ' : '';
        return `${modifiers}${p.name}: ${p.type}`;
      })
      .join(', ');

    return `constructor(${params}) {}`;
  }

  /**
   * 生成方法
   */
  private generateMethod(method: any, indent: string): string {
    const lines: string[] = [];

    // 方法装饰器
    method.decorators.forEach((decorator: any) => {
      lines.push(this.generateDecorator(decorator));
    });

    // 方法签名
    const params = method.parameters
      .map((p: any) => {
        const decorators = p.decorators.map((d: any) => this.generateDecorator(d)).join(' ');
        const optional = p.optional ? '?' : '';
        const typeStr = p.showType !== false ? `: ${p.type}` : '';
        return decorators ? `${decorators} ${p.name}${optional}${typeStr}` : `${p.name}${optional}${typeStr}`;
      })
      .join(', ');

    // 生成方法修饰符
    const modifiers = method.modifiers ? method.modifiers.join(' ') + ' ' : '';
    
    // 生成返回类型
    const returnTypeStr = method.showReturnType !== false ? `: ${method.returnType}` : '';
    
    const methodSignature = `${modifiers}${method.name}(${params})${returnTypeStr} {`;
    lines.push(methodSignature);

    // 方法体
    if (method.bodyText) {
      const bodyLines = method.bodyText.split('\n');
      bodyLines.forEach((line: string) => {
        lines.push(indent + line);
      });
    }

    lines.push('}');

    return lines.join('\n' + indent);
  }

  /**
   * 比较两个中间态的差异
   */
  compareIntermediateStates(
    state1: IntermediateState,
    state2: IntermediateState
  ): {
    hasChanges: boolean;
    changes: string[];
  } {
    const changes: string[] = [];

    // 比较类名
    if (state1.metadata.className !== state2.metadata.className) {
      changes.push(`类名变更: ${state1.metadata.className} -> ${state2.metadata.className}`);
    }

    // 比较方法数量
    if (state1.methods.size !== state2.methods.size) {
      changes.push(`方法数量变更: ${state1.methods.size} -> ${state2.methods.size}`);
    }

    // 比较具体方法
    for (const [methodName, method1] of state1.methods) {
      const method2 = state2.methods.get(methodName);
      if (!method2) {
        changes.push(`方法删除: ${methodName}`);
      } else if (method1.bodyText !== method2.bodyText) {
        changes.push(`方法修改: ${methodName}`);
      }
    }

    for (const [methodName] of state2.methods) {
      if (!state1.methods.has(methodName)) {
        changes.push(`方法新增: ${methodName}`);
      }
    }

    return {
      hasChanges: changes.length > 0,
      changes,
    };
  }

  /**
   * 创建中间态快照
   */
  createSnapshot(intermediateState: IntermediateState): {
    id: string;
    timestamp: number;
    data: IntermediateState;
  } {
    return {
      id: `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      data: JSON.parse(
        JSON.stringify(intermediateState, (_key, value) => {
          // 处理 Map 类型的序列化
          if (value instanceof Map) {
            return Object.fromEntries(value);
          }
          return value;
        })
      ),
    };
  }
}
