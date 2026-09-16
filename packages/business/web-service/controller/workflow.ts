import { request } from '../request';

export default class WorkflowController {
  static async events(query?: { pluginId?: string; keyword?: string; from?: string; to?: string; uri?: string }) {
    return request<{ list: Array<Record<string, unknown>> }>({ method: 'get' })('/workflow/events', query);
  }

  static async runCommand(body: { pluginId: string; localId: string; input?: unknown; idempotencyKey?: string }) {
    return request<Record<string, unknown>>({ method: 'post' })('/workflow/commands/run', body);
  }

  static async pending() {
    return request<{ list: Array<Record<string, unknown>> }>({ method: 'get' })('/workflow/pending');
  }

  static async interact(id: string, body: Record<string, unknown>) {
    return request<Record<string, unknown>>({ method: 'post' })(`/workflow/edges/${id}/interact`, body);
  }

  static async conflicts() {
    return request<{ list: Array<Record<string, unknown>> }>({ method: 'get' })('/workflow/conflicts');
  }

  static async resolve(
    id: string,
    body: { ticketRevision: number; action: string; expectedRevision?: string; interactionInput?: Record<string, unknown> },
  ) {
    return request<Record<string, unknown>>({ method: 'put' })(`/workflow/conflicts/${id}/resolve`, body);
  }
}
