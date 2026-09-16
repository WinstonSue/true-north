import dayjs from 'dayjs';
import type { CommandResult, WorkflowCommandContext } from '@true-north/plugin-contract';
import type { WorkflowCommandHandler } from '@true-north/plugin-sdk';
import { runPluginCommand, revisionOf } from '@true-north/plugin-sdk/main';
import { TodoStatus } from '@true-north/enum';
import { store } from '../../storage';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto';
import { todoService } from './todo.service';
import { decideCompleteTodo, parseTodoId, todoUri } from './workflow-cas';

export const createTodoCommand: WorkflowCommandHandler = {
  async execute(input, ctx: WorkflowCommandContext): Promise<CommandResult> {
    return store().runInTransaction(async (tx) =>
      runPluginCommand(tx.manager, ctx.idempotencyKey, input, async () => {
        const body = (input || {}) as Record<string, unknown>;
        const dto = new CreateTodoDto();
        dto.importCreateVo({
          name: String(body.title || body.name || ''),
          description: body.note ? String(body.note) : undefined,
          planDate: String(body.planned || body.planDate || dayjs().format('YYYY-MM-DD')),
          status: TodoStatus.TODO,
        });
        const todo = await todoService.create(dto, { manager: tx.manager });
        const entity = await tx.manager.getRepository(Todo).findOneBy({ id: todo.id });
        if (entity && (entity.revision == null || entity.revision < 1)) {
          entity.revision = 1;
          await tx.manager.getRepository(Todo).save(entity);
        }
        const revision = revisionOf(entity?.revision || 1);
        const uri = todoUri(todo.id);
        return {
          status: 'applied',
          resource: { uri, revision },
          output: { id: todo.id, name: todo.name },
          events: [{ localId: 'todoCreated', payload: { title: todo.name }, source: { uri, revision } }],
        };
      }),
    );
  },
};

export const completeTodoCommand: WorkflowCommandHandler = {
  async execute(input, ctx: WorkflowCommandContext): Promise<CommandResult> {
    const body = (input || {}) as { uri?: string; expectedRevision?: string };
    return store().runInTransaction(async (tx) =>
      runPluginCommand(tx.manager, ctx.idempotencyKey, input, async () => {
        const id = parseTodoId(body.uri);
        const repo = tx.manager.getRepository(Todo);
        const current = id ? await repo.findOneBy({ id }) : null;
        const decision = decideCompleteTodo(current, body);
        if (!('proceed' in decision)) return decision;
        if (!current) return { status: 'notFound', uri: body.uri };
        current.status = TodoStatus.DONE;
        current.doneAt = new Date();
        current.revision = Number(decision.actual) + 1;
        await repo.save(current);
        const revision = revisionOf(current.revision);
        const uri = todoUri(decision.id);
        return {
          status: 'applied',
          resource: { uri, revision },
          events: [{ localId: 'todoCompleted', payload: { title: current.name }, source: { uri, revision } }],
        };
      }),
    );
  },
};
