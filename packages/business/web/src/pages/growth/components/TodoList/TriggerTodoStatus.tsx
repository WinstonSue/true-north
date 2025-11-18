import { Checkbox, DatePicker, Radio } from '@arco-design/web-react';
import styles from './style.module.less';
import { TodoService } from '@true-north/web-service';
import { TodoVo } from '@true-north/vo';
import { openModal } from '@/hooks/OpenModal';
import dayjs from 'dayjs';
import ConformDoneTime from './ConformDoneTime';

export default function TriggerTodoStatus(props: {
  todo: TodoVo;
  onChange: () => Promise<void>;
}) {
  const { todo } = props;

  async function restore() {
    await TodoService.restoreWithRepeat(todo.id);
    await props.onChange();
  }

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
                <ConformDoneTime todo={todo} onChangeDoneTime={(time) => {}} />
              ),
              onCancel: async () => {},
              onOk: async () => {},
            });
            return;
          }
          await TodoService.doneWithRepeatBatch({
            todoWithRepeatList: [
              {
                id: todo.id,
                relatedType: todo.relatedType,
              },
            ],
          });
          await props.onChange();
        }}
      />
    </div>
  );
}
