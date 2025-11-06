import { MethodDefinition } from '../intermediate-state';
import { MethodChangeType } from '../../../../types';

/**
 * 检测变更类型 - 通用实现
 */
export function detectMethodChangeType(sourceMethod: MethodDefinition, targetMethod: MethodDefinition): MethodChangeType {
  // 比较装饰器
  if (sourceMethod.verb !== targetMethod.verb || sourceMethod.path !== targetMethod.path) {
    return 'method_decorators_changed';
  }

  // 比较参数
  if (parametersChanged(sourceMethod.parameters, targetMethod.parameters)) {
    return 'method_parameters_changed';
  }

  // 比较方法签名
  if (sourceMethod.returnType !== targetMethod.returnType) {
    return 'method_signature_changed';
  }

  return 'method_no_change';
}

/**
 * 检查参数是否变更 - 通用实现
 */
export function parametersChanged(sourceParams: any[], targetParams: any[]): boolean {
  if (sourceParams.length !== targetParams.length) {
    return true;
  }

  for (let i = 0; i < sourceParams.length; i++) {
    const source = sourceParams[i];
    const target = targetParams[i];

    if (
      source.name !== target.name ||
      source.type !== target.type ||
      source.decorator !== target.decorator ||
      source.optional !== target.optional
    ) {
      return true;
    }
  }

  return false;
}
