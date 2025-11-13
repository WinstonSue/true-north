import { MethodDefinition } from '../intermediate-state';
import { MethodChangeType, MethodChange } from '../../../../types';
import { isEqual } from 'lodash-es';

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
  if (
    !ignore?.includes('parameters') &&
    parametersChanged(sourceMethod.parameters, targetMethod.parameters, { ignore })
  ) {
    return 'method_parameters_changed';
  }

  // 比较方法签名
  if (!ignore?.includes('returnType') && sourceMethod.returnType !== targetMethod.returnType) {
    return 'method_return_type_changed';
  }

  return 'method_no_change';
}

/**
 * 检查参数是否变更 - 通用实现
 */
export function parametersChanged(
  sourceParams: any[],
  targetParams: any[],
  options: {
    ignore?: string[];
  } = {}
): boolean {
  const { ignore } = options;

  if (sourceParams.length !== targetParams.length) {
    return true;
  }

  for (let i = 0; i < sourceParams.length; i++) {
    const source = sourceParams[i];
    const target = targetParams[i];

    if (
      source.name !== target.name ||
      source.type !== target.type ||
      (!ignore?.includes('decorators') &&
        (!isEqual(source.decorator, target.decorator) || source.optional !== target.optional))
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
      let result = 'Parameters changed: ';
      for (let i = 0; i < Math.max(targetMethod.parameters.length, sourceMethod.parameters.length); i++) {
        const targetParam = targetMethod.parameters[i];
        const sourceParam = sourceMethod.parameters[i];
        if (targetParam.name !== sourceParam.name || targetParam.type !== sourceParam.type) {
          result += `\n${targetParam.name || 'unknown'}:${targetParam.type || 'unknown'} -> ${sourceParam.name || 'unknown'}:${sourceParam.type || 'unknown'}`;
        }
      }
      return result;
    case 'method_return_type_changed':
      return `Return type changed: ${targetMethod.returnType} -> ${sourceMethod.returnType}`;
    default:
      return 'Method changed';
  }
}

/**
 * 生成详细统计摘要 - 通用实现
 */
export function generateDiffResultSummary(methodChanges: MethodChange[]) {
  const returnTypeChanges = methodChanges.filter((c) => c.changeType === 'method_return_type_changed').length;
  const parameterChanges = methodChanges.filter((c) => c.changeType === 'method_parameters_changed').length;
  const decoratorChanges = methodChanges.filter((c) => c.changeType === 'method_decorators_changed').length;

  return {
    totalMethods: methodChanges.length,
    changedMethods: methodChanges.filter((c) => c.changeType !== 'method_added' && c.changeType !== 'method_removed')
      .length,
    addedMethods: methodChanges.filter((c) => c.changeType === 'method_added').length,
    removedMethods: methodChanges.filter((c) => c.changeType === 'method_removed').length,
    returnTypeChanges,
    parameterChanges,
    decoratorChanges,
  };
}
