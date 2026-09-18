import { Checkbox, Modal } from '@sue/design-web-react';
import styles from './style.module.less';
import { TodoService } from '../../../../client';
import { TodoVo } from '@true-north/vo';
import DoneTimeConfirm from './DoneTimeConfirm';
import { useRef } from 'react';
import { emitTodoChanged } from '../../../shared/events';
import { TodoStatus } from '@true-north/enum';
import { useOpenPendingWorkflows } from '../../../integrations/workflow-association';

export default function TriggerTodoStatus(props: {
  todo: TodoVo;
  onChange: () => Promise<void>;
}) {
  const { todo } = props;
  const isActive = todo.status === TodoStatus.TODO;
  const doneAt = useRef<string | null>(null);
  const openPending = useOpenPendingWorkflows();

  async function complete() {
    if (
      new Date(todo.planDate + ' ' + (todo.planEndTime || '23:59:59')) <
      new Date()
    ) {
      Modal.confirm({
        icon: null,
        closable: true,
        title: '确认完成时间',
        content: (
          <DoneTimeConfirm
            todo={todo}
            onDoneTime={(time) => {
              doneAt.current = time.format('YYYY-MM-DD HH:mm:ss');
            }}
          />
        ),
        onCancel: async () => {},
        onOk: async () => {
          await TodoService.done(todo.relatedType, todo.id, {
            doneAt: doneAt.current,
          });
          emitTodoChanged();
          await openPending();
          await props.onChange();
        },
      });
      return;
    }
    await TodoService.done(todo.relatedType, todo.id);
    emitTodoChanged();
    await openPending();
    await props.onChange();
  }

  return (
    <div
      className={`w-8 h-8 flex items-center ${styles['custom-checkbox-wrapper']}`}
    >
      <Checkbox
        checked={todo.status === TodoStatus.DONE}
        disabled={!isActive}
        onChange={async () => {
          if (!isActive) return;
          await complete();
        }}
      />
    </div>
  );
}
