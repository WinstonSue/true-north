import { MethodChange, CommonChange } from './Method';

export interface ControllerSyncStatus {
  className: string;
  sourcePath: string;
  targetPath: string;
  needsSync: boolean;
  changeCount: number;
  lastChecked: string;
  error?: string;
  changes: CommonChange[];
  methodChanges: MethodChange[];
  summary: {
    totalMethods: number;
    changedMethods: number;
    addedMethods: number;
    removedMethods: number;
    returnTypeChanges: number;
    parameterChanges: number;
    decoratorChanges: number;
  };
}
