import { MethodDefinition } from '../intermediate-state';
import { MethodChangeType } from '../../../../types';

/**
 * 检测变更类型 - 通用实现
 */
export function detectMethodChangeType(
  sourceMethod: MethodDefinition,
  targetMethod: MethodDefinition,
  options: {
    ignore?: string[];
  } = {}
): MethodChangeType {
  const { ignore } = options;

  // 比较装饰器
  if (
    !ignore?.includes('decorators') &&
    (sourceMethod.verb !== targetMethod.verb || sourceMethod.path !== targetMethod.path)
  ) {
    return 'method_decorators_changed';
  }

  // 比较参数
  if (!ignore?.includes('parameters') && parametersChanged(sourceMethod.parameters, targetMethod.parameters)) {
    return 'method_parameters_changed';
  }

  // 比较方法签名
  if (!ignore?.includes('signature') && sourceMethod.returnType !== targetMethod.returnType) {
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

/**
 * 生成变更详情 - 通用实现
 */
export function generateChangeDetails(
  sourceMethod: MethodDefinition,
  targetMethod: MethodDefinition,
  changeType: MethodChangeType
): string {
  switch (changeType) {
    case 'method_decorators_changed':
      return `Decorators changed: ${targetMethod.verb}('${targetMethod.path}') -> ${sourceMethod.verb}('${sourceMethod.path}')`;
    case 'method_parameters_changed':
      return `Parameters changed: ${targetMethod.parameters.length} -> ${sourceMethod.parameters.length} parameters`;
    case 'method_signature_changed':
      return `Return type changed: ${targetMethod.returnType} -> ${sourceMethod.returnType}`;
    default:
      return 'Method changed';
  }
}
