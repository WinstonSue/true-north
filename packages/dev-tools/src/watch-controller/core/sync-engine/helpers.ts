import { IntermediateState } from '../intermediate-state';
import { SyncAction } from './types';
import { DiffResult } from '../../../../types';

/**
 * 根据差异结果生成同步操作
 */
export function generateSyncActions(diffResult: DiffResult, source: IntermediateState): SyncAction[] {
  const actions: SyncAction[] = [];

  for (const change of diffResult.changes) {
    switch (change.changeType) {
      case 'constructor_changed':
        actions.push({
          type: 'update_constructor',
          data: source.constructor,
          description: '更新构造函数',
        });
        break;

      case 'imports_changed':
        actions.push({
          type: 'update_imports',
          data: source.imports,
          description: '更新导入声明',
        });
        break;
    }
  }

  for (const change of diffResult.methodChanges) {
    switch (change.changeType) {
      case 'method_added':
        if (change.methodName) {
          const method = source.methods.get(change.methodName);
          if (method) {
            actions.push({
              type: 'add_method',
              methodName: change.methodName,
              data: method,
              description: `添加方法 ${change.methodName}`,
            });
          }
        }
        break;

      case 'method_removed':
        actions.push({
          type: 'remove_method',
          methodName: change.methodName,
          data: null,
          description: `移除方法 ${change.methodName}`,
        });
        break;

      case 'method_return_type_changed':
      case 'method_parameters_changed':
      case 'method_decorators_changed':
      case 'method_body_changed':
        if (change.methodName) {
          const method = source.methods.get(change.methodName);
          if (method) {
            actions.push({
              type: 'update_method',
              methodName: change.methodName,
              data: method,
              description: `更新方法 ${change.methodName}`,
            });
          }
        }
        break;
    }
  }

  return actions;
}
