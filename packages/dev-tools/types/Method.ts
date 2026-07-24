export interface MethodChange {
  methodName: string;
  changeType: MethodChangeType;
  sourceMethod: MethodInfo;
  targetMethod?: MethodInfo;
  description: string;
}

export type MethodChangeType =
  | 'method_return_type_changed'
  | 'method_parameters_changed'
  | 'method_decorators_changed'
  | 'method_body_changed'
  | 'method_no_change'
  | 'method_added'
  | 'method_removed';

export interface MethodInfo {
  name: string;
  signature: string;
  returnType: string;
  parameters: Array<{
    name: string;
    type: string;
    decorator?: string;
    decoratorArgs?: string;
  }>;
  decorators: Array<{
    name: string;
    args: string;
  }>;
  body: string;
}

export interface CommonChange {
  /** 变更类型 */
  changeType: 'constructor_changed' | 'imports_changed';

  /** 旧值 */
  oldValue?: any;
  /** 新值 */
  newValue?: any;
  /** 变更描述 */
  description: string;
}
