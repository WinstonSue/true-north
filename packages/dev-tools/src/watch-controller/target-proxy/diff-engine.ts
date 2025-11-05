/**
 * Desktop 控制器差异比对引擎
 * 专门处理 Server Controller 到 Desktop Controller 的差异比对
 */

import { DiffEngine } from '../core';
import { MethodDefinition } from '../core/intermediate-state';

export class ControllerProxyDiffEngine extends DiffEngine {
  /**
   * Desktop 控制器特有的方法比较逻辑
   */
  protected compareMethod(source: MethodDefinition, target: MethodDefinition): string[] {
    const changes: string[] = [];

    // 比较 HTTP 动词
    if (source.verb !== target.verb) {
      changes.push(`HTTP动词从 ${target.verb} 改为 ${source.verb}`);
    }

    // 比较路径
    if (source.path !== target.path) {
      changes.push(`路径从 ${target.path} 改为 ${source.path}`);
    }

    // 比较参数
    const paramChanges = this.compareParameters(source.parameters, target.parameters);
    if (paramChanges.length > 0) {
      changes.push(`参数变更: ${paramChanges.join(', ')}`);
    }

    // 比较返回类型
    if (source.returnType !== target.returnType) {
      changes.push(`返回类型从 ${target.returnType} 改为 ${source.returnType}`);
    }

    // 智能比较方法体：检查 Target 是否已经是正确的代理调用
    if (!this.isCorrectProxyCall(source, target)) {
      changes.push('方法体需要更新为代理调用');
    }

    // 比较装饰器选项
    if (!this.deepEqual(source.decoratorOptions, target.decoratorOptions)) {
      changes.push('装饰器选项已修改');
    }

    return changes;
  }

  /**
   * 检查 Target 方法是否已经是正确的代理调用
   */
  private isCorrectProxyCall(source: MethodDefinition, target: MethodDefinition): boolean {
    // 检查 Target 方法体是否包含正确的代理调用模式
    const expectedCall = `return this.controller.${source.name}(`;

    // 如果 Target 方法体包含期望的代理调用，认为是正确的
    if (target.bodyText.includes(expectedCall)) {
      // 进一步检查参数是否匹配
      const sourceParamNames = source.parameters.map((p) => p.name);
      const expectedParams = sourceParamNames.join(', ');
      const fullExpectedCall = `return this.controller.${source.name}(${expectedParams});`;

      return target.bodyText.includes(fullExpectedCall);
    }

    return false;
  }
}
