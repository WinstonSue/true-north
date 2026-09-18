import { request } from '../request';

export default class WorkflowController {
  static async catalog() {
    return request<{
      events: Array<Record<string, unknown>>;
      commands: Array<Record<string, unknown>>;
      interactions: Array<Record<string, unknown>>;
      workspaces: Array<Record<string, unknown>>;
      templates: Array<Record<string, unknown>>;
    }>({ method: 'get' })('/workflow/catalog');
  }

  static async definitions() {
    return request<{ list: Array<Record<string, unknown>> }>({ method: 'get' })('/workflow/definitions');
  }

  static async createDefinition(body: { title: string; description?: string; graph?: unknown; sourceTemplateKey?: string }) {
    return request<Record<string, unknown>>({ method: 'post' })('/workflow/definitions', body);
  }

  static async definition(id: string) {
    return request<Record<string, unknown>>({ method: 'get' })(`/workflow/definitions/${id}`);
  }

  static async updateDefinition(id: string, body: { title?: string; description?: string; graph?: unknown }) {
    return request<Record<string, unknown>>({ method: 'put' })(`/workflow/definitions/${id}`, body);
  }

  static async publishDefinition(id: string) {
    return request<Record<string, unknown>>({ method: 'post' })(`/workflow/definitions/${id}/publish`);
  }

  static async associations(query?: { ownerPluginId?: string; ownerKind?: string; ownerId?: string; definitionId?: string }) {
    return request<{ list: Array<Record<string, unknown>> }>({ method: 'get' })('/workflow/associations', query);
  }

  static async upsertAssociation(body: Record<string, unknown>) {
    return request<Record<string, unknown> | null>({ method: 'put' })('/workflow/associations', body);
  }

  static async plans(query?: { status?: string; associationId?: string; definitionId?: string }) {
    return request<{ list: Array<Record<string, unknown>> }>({ method: 'get' })('/workflow/plans', query);
  }

  static async plan(id: string) {
    return request<Record<string, unknown>>({ method: 'get' })(`/workflow/plans/${id}`);
  }

  static async workspaces() {
    return request<{ list: Array<Record<string, unknown>> }>({ method: 'get' })('/workflow/workspaces');
  }

  static async workspace(id: string) {
    return request<Record<string, unknown>>({ method: 'get' })(`/workflow/workspaces/${id}`);
  }

  static async patchWorkspace(id: string, body: Record<string, unknown>) {
    return request<{ state: Record<string, unknown> }>({ method: 'put' })(`/workflow/workspaces/${id}`, body);
  }

  static async rollbackPreview(query: { ownerPluginId: string; ownerKind: string; ownerId: string }) {
    return request<{ needsConfirm: boolean; plans: Array<Record<string, unknown>> }>({ method: 'get' })(
      '/workflow/rollback/preview',
      query,
    );
  }

  static async rollbackPlan(id: string, body?: { confirmed?: boolean }) {
    return request<Record<string, unknown>>({ method: 'post' })(`/workflow/plans/${id}/rollback`, body);
  }

  static async detachPlan(id: string) {
    return request<Record<string, unknown>>({ method: 'post' })(`/workflow/plans/${id}/detach`);
  }

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
