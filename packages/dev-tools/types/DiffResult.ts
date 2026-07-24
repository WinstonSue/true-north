import { CommonChange, MethodChange } from './Method';

export interface DiffResult {
  className: string;
  needsSync: boolean;
  changes: CommonChange[];
  methodChanges: MethodChange[];
  error?: string;
}
