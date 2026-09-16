import { workflowStore } from './storage';
import { WorkflowConflictTicket } from './entities';
import { conflictResourceUri } from '../../plugin/host-ids';

export async function getConflictTicket(ticketId: string) {
  return workflowStore().getRepository(WorkflowConflictTicket).findOneBy({ id: ticketId });
}

export function toTicketEvidence(ticket: WorkflowConflictTicket) {
  return {
    ticketId: ticket.id,
    ticketRevision: ticket.ticketRevision,
    planId: ticket.planId,
    edgeId: ticket.edgeId,
    attemptId: ticket.attemptId,
    commandId: ticket.commandId,
    targetUri: ticket.targetUri,
    expectedRevision: ticket.expectedRevision,
    actualRevision: ticket.actualRevision,
    resultStatus: ticket.resultStatus,
    reasonCode: ticket.reasonCode,
    reason: ticket.reason,
    succeededPredecessors: ticket.succeededPredecessors || [],
    relatedUris: ticket.relatedUris || [],
    allowedActions: ticket.allowedActions || [],
    diagnostic: ticket.diagnostic || {},
    status: ticket.status,
    uri: conflictResourceUri(ticket.id),
  };
}
