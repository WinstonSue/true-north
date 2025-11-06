export interface MethodChange {
  methodName: string;
  changeType: MethodChangeType;
  sourceMethod: MethodInfo;
  targetMethod?: MethodInfo;
  description: string;
}

export type MethodChangeType =
  | 'method_signature_changed'
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

export interface MethodDetailsResult {
  className: string;
  sourcePath: string;
  targetPath: string;
  needsSync: boolean;
  methodChanges: MethodChange[];
  summary: {
    totalMethods: number;
    changedMethods: number;
    addedMethods: number;
    removedMethods: number;
  };
  error?: string;
}
