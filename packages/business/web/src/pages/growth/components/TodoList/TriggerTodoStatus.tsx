import { Checkbox, DatePicker, Radio } from '@arco-design/web-react';
import styles from './style.module.less';
import { TodoService } from '@true-north/web-service';
import { TodoVo } from '@true-north/vo';
import { openModal } from '@/hooks/OpenModal';
import ConformDoneTime from './ConformDoneTime';
import { useRef, useState } from 'react';

export default function TriggerTodoStatus(props: {
  todo: TodoVo;
  onChange: () => Promise<void>;
}) {
  const { todo } = props;

  async function restore() {
    await TodoService.restore(todo.relatedType, todo.id);
    await props.onChange();
  }

  const doneAt = useRef<string | null>(null);

  return (
    <div
      className={`w-8 h-8 flex items-center ${styles['custom-checkbox-wrapper']}`}
    >
      <Checkbox
        checked={todo.status === 'done'}
        onChange={async () => {
          if (todo.status !== 'todo') {
            await restore();
            return;
          }
          if (new Date(todo.planDate) < new Date()) {
            openModal({
              title: '确认完成时间',
              content: (
                <ConformDoneTime
                  todo={todo}
                  onChangeDoneTime={(time) => {
                    doneAt.current = time.format('YYYY-MM-DD HH:mm:ss');
                  }}
                />
              ),
              onCancel: async () => {},
              onOk: async () => {
                await TodoService.done(todo.relatedType, todo.id, {
                  doneAt: doneAt.current,
                });
                await props.onChange();
              },
            });
            return;
          }
          await TodoService.done(todo.relatedType, todo.id);
          await props.onChange();
        }}
      />
    </div>
  );
}
