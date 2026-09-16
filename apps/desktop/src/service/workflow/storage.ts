import { getPluginHost } from '../../plugin/active-host';
import { HOST_WORKFLOW_STORE_ID } from '../../plugin/host-ids';

export function workflowStore() {
  return getPluginHost().storage.get(HOST_WORKFLOW_STORE_ID);
}
