import type { CommandResult, WorkflowCommandContext } from '@true-north/plugin-contract';
import type { WorkflowCommandHandler } from '@true-north/plugin-sdk';
import { runPluginCommand, revisionOf } from '@true-north/plugin-sdk/main';
import { TodoRelatedType, TodoStatus } from '@true-north/enum';
import type { CreateTodoVo } from '@true-north/vo';
import { store } from '../../storage';
import { Todo } from './todo.entity';
import { CreateTodoDto, CreateTodoRepeatDto } from './dto';
import { todoRepeatService, todoService } from './todo.service';
import { queueGrowthDueSync, untrackGrowthResource } from '../../context';
import { decideCompleteTodo, parseTodoId, todoUri } from './workflow-cas';
import { createTodoVoFromCommandInput } from './create-todo-input';

export { createTodoVoFromCommandInput };

export const createTodoCommand: WorkflowCommandHandler = {
  async execute(input, ctx: WorkflowCommandContext): Promise<CommandResult> {
    const result = await store().runInTransaction(async (tx) =>
      runPluginCommand(tx.manager, ctx.idempotencyKey, input, async () => {
        const body = (input || {}) as Record<string, unknown>;
        const vo = createTodoVoFromCommandInput(body);
        const system =
          vo.relatedType === TodoRelatedType.TASK || vo.relatedType === TodoRelatedType.HABIT;
        let todoId: string;
        let todoName: string;
        if (vo.repeatConfig) {
          const repeatDto = new CreateTodoRepeatDto();
          repeatDto.importCreateVo(vo as CreateTodoVo);
          const created = await todoRepeatService.create(repeatDto);
          todoId = created.id;
          todoName = created.name;
        } else {
          const dto = new CreateTodoDto();
          dto.importCreateVo(vo as CreateTodoVo);
          const todo = await todoService.create(dto, { manager: tx.manager, system });
          const entity = await tx.manager.getRepository(Todo).findOneBy({ id: todo.id });
          if (entity && (entity.revision == null || entity.revision < 1)) {
            entity.revision = 1;
            await tx.manager.getRepository(Todo).save(entity);
          }
          todoId = todo.id;
          todoName = todo.name;
        }
        const entity = await tx.manager.getRepository(Todo).findOneBy({ id: todoId });
        const revision = revisionOf(entity?.revision || 1);
        const uri = todoUri(todoId);
        return {
          status: 'applied' as const,
          resource: { uri, revision },
          output: { id: todoId, name: todoName },
          events: [{ localId: 'todoCreated', payload: { title: todoName }, source: { uri, revision } }],
        };
      }),
    );
    if (result.status === 'applied') queueGrowthDueSync();
    return result;
  },
};

export const completeTodoCommand: WorkflowCommandHandler = {
  async execute(input, ctx: WorkflowCommandContext): Promise<CommandResult> {
    const body = (input || {}) as { uri?: string; expectedRevision?: string };
    const result = await store().runInTransaction(async (tx) =>
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
          events: [{ localId: 'todoCompleted', payload: { todoId: current.id, title: current.name, occurredAt: current.doneAt.toISOString() }, source: { uri, revision } }],
        };
      }),
    );
    if (result.status === 'applied') {
      const id = parseTodoId(body.uri);
      if (id) await untrackGrowthResource('todo', id);
      queueGrowthDueSync();
    }
    return result;
  },
};
