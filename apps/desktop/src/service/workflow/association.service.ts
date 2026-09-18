import { workflowStore } from './storage';
import { WorkflowAssociation } from './entities';
import { workflowDefinitionService } from './definition.service';

export type AssociationOwner = {
  ownerPluginId: string;
  ownerKind: string;
  ownerId: string;
};

function toDto(entity: WorkflowAssociation) {
  return {
    id: entity.id,
    ownerPluginId: entity.ownerPluginId,
    ownerKind: entity.ownerKind,
    ownerId: entity.ownerId,
    definitionId: entity.definitionId,
    versionPolicy: entity.versionPolicy,
    pinnedVersion: entity.pinnedVersion,
    enabled: entity.enabled,
  };
}

export class WorkflowAssociationService {
  private repo() {
    return workflowStore().getRepository(WorkflowAssociation);
  }

  async list(filter?: Partial<AssociationOwner> & { definitionId?: string }) {
    const list = await this.repo().find({
      where: {
        ...(filter?.ownerPluginId ? { ownerPluginId: filter.ownerPluginId } : {}),
        ...(filter?.ownerKind ? { ownerKind: filter.ownerKind } : {}),
        ...(filter?.ownerId ? { ownerId: filter.ownerId } : {}),
        ...(filter?.definitionId ? { definitionId: filter.definitionId } : {}),
      },
      order: { updatedAt: 'DESC' },
    });
    return list.map(toDto);
  }

  async findByOwner(owner: AssociationOwner) {
    const entity = await this.repo().findOne({
      where: owner,
      withDeleted: true,
    });
    if (!entity || entity.deletedAt) return null;
    return entity;
  }

  async upsert(input: AssociationOwner & {
    definitionId: string | null;
    versionPolicy?: 'latest_published' | 'pinned';
    pinnedVersion?: number;
    enabled?: boolean;
  }) {
    const existing = await this.repo().findOne({
      where: {
        ownerPluginId: input.ownerPluginId,
        ownerKind: input.ownerKind,
        ownerId: input.ownerId,
      },
      withDeleted: true,
    });
    if (!input.definitionId) {
      if (existing && !existing.deletedAt) await this.repo().softRemove(existing);
      return null;
    }
    const definition = await workflowDefinitionService.get(input.definitionId);
    if (!definition) throw new Error('Workflow definition not found');
    const entity = existing || this.repo().create(input);
    entity.ownerPluginId = input.ownerPluginId;
    entity.ownerKind = input.ownerKind;
    entity.ownerId = input.ownerId;
    entity.definitionId = input.definitionId;
    entity.versionPolicy = input.versionPolicy || 'latest_published';
    entity.pinnedVersion = input.pinnedVersion;
    entity.enabled = input.enabled !== false;
    if (existing?.deletedAt) {
      await this.repo().restore(existing.id);
      existing.deletedAt = undefined;
    }
    return toDto(await this.repo().save(entity));
  }

  async resolvePublished(association: WorkflowAssociation) {
    const version =
      association.versionPolicy === 'pinned' ? association.pinnedVersion : undefined;
    return workflowDefinitionService.publishedGraph(association.definitionId, version);
  }

  async copy(from: AssociationOwner, to: AssociationOwner) {
    const source = await this.findByOwner(from);
    if (!source) return null;
    return this.upsert({
      ...to,
      definitionId: source.definitionId,
      versionPolicy: source.versionPolicy,
      pinnedVersion: source.pinnedVersion,
      enabled: source.enabled,
    });
  }
}

export const workflowAssociationService = new WorkflowAssociationService();
