import type { ConflictAction } from '@true-north/plugin-contract';
import { CONFLICT_ACTIONS } from '@true-north/plugin-contract';

export const CONFLICT_TOOL_ALLOWLIST = new Set(['workflow.proposeConflictResolution']);

export type ConflictProposalInput = {
  ticketId: string;
  ticketRevision: number;
  resourceRevision?: string;
  action: ConflictAction;
};

export type ConflictProposalTicket = {
  id: string;
  status: string;
  ticketRevision: number;
  allowedActions?: string[] | null;
  actualRevision?: string | null;
};

export type ConflictProposalCheck =
  | { ok: true }
  | { ok: false; reason: string; stale?: boolean };

export function isConflictAllowedToolName(name: string, options?: { readOnly?: boolean }): boolean {
  if (CONFLICT_TOOL_ALLOWLIST.has(name) || name.endsWith('.proposeConflictResolution')) {
    return true;
  }
  return Boolean(options?.readOnly);
}

export function evaluateConflictProposal(
  input: ConflictProposalInput,
  boundTicketId: string | undefined,
  ticket: ConflictProposalTicket | null,
): ConflictProposalCheck {
  if (!boundTicketId) {
    return { ok: false, reason: '冲突排查工具只能在冲突工单会话中使用' };
  }
  if (input.ticketId !== boundTicketId) {
    return { ok: false, reason: '只能为当前会话绑定的冲突工单提出建议' };
  }
  if (!ticket) {
    return { ok: false, reason: '冲突工单不存在' };
  }
  if (ticket.status !== 'open') {
    return { ok: false, reason: '冲突工单已关闭' };
  }
  if (ticket.ticketRevision !== input.ticketRevision) {
    return { ok: false, stale: true, reason: '工单 revision 已变化，请重新读取工单' };
  }
  const allowed = ticket.allowedActions?.length ? ticket.allowedActions : [...CONFLICT_ACTIONS];
  if (!allowed.includes(input.action)) {
    return { ok: false, reason: '该动作不在工单允许范围内' };
  }
  if (
    input.resourceRevision &&
    ticket.actualRevision &&
    input.resourceRevision !== ticket.actualRevision
  ) {
    return { ok: false, stale: true, reason: '资源 revision 已变化，请重新读取相关资源' };
  }
  return { ok: true };
}
