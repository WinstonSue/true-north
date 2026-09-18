import { Drawer } from '@sue/design-web-react';
import { TodoRelatedType } from '@true-north/enum';
import type { AiWorkspaceSuggestionVo, GoalVo, TaskVo } from '@true-north/vo';
import { drawerShellStyles } from '../../ui';
import { GoalCreator } from '../../domains/goal/form';
import { TaskCreator } from '../../domains/task/form';
import { TodoCreator } from '../../domains/todo/detail';
import { CreateHabit } from '../../domains/habit/components/CreateHabit';
import {
  KIND_CREATE_TITLE,
  suggestionToGoalForm,
  suggestionToHabitValues,
  suggestionToTaskForm,
  suggestionToTodoForm,
} from './suggestion-form';
import styles from './style.module.less';

type Props = {
  suggestion: AiWorkspaceSuggestionVo | null;
  source: 'goal' | 'task';
  parent: GoalVo | TaskVo;
  onClose: () => void;
  onCreated: () => Promise<void>;
};

export function DecomposeEditDrawer({
  suggestion,
  source,
  parent,
  onClose,
  onCreated,
}: Props) {
  if (!suggestion) return null;
  const kind = suggestion.kind;
  const close = async () => onClose();
  const afterSubmit = async () => {
    await onCreated();
  };

  return (
    <Drawer
      open
      title={KIND_CREATE_TITLE[kind] || '新建'}
      onClose={onClose}
      size={800}
      destroyOnHidden
      styles={drawerShellStyles}
    >
      <div className={styles.editDrawer}>
        {kind === 'goal' && source === 'goal' ? (
          <GoalCreator
            initialFormData={suggestionToGoalForm(suggestion, parent as GoalVo)}
            afterSubmit={afterSubmit}
            onClose={close}
          />
        ) : null}
        {kind === 'task' ? (
          <TaskCreator
            initialFormData={suggestionToTaskForm(suggestion, parent, source)}
            afterSubmit={afterSubmit}
            onClose={close}
          />
        ) : null}
        {kind === 'todo' ? (
          <TodoCreator
            initialFormData={suggestionToTodoForm(
              suggestion,
              parent.id,
              source === 'task' ? TodoRelatedType.TASK : TodoRelatedType.GOAL,
            )}
            afterSubmit={afterSubmit}
            onClose={close}
          />
        ) : null}
        {kind === 'habit' && source === 'goal' ? (
          <CreateHabit
            key={suggestion.id}
            goals={[parent as GoalVo]}
            initialValues={suggestionToHabitValues(suggestion, parent.id)}
            onSuccess={() => {
              void afterSubmit().then(() => onClose());
            }}
            onCancel={onClose}
          />
        ) : null}
      </div>
    </Drawer>
  );
}
