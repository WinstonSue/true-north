import { Checkbox, Modal } from '@arco-design/web-react';
import styles from './style.module.less';
import { TaskService } from '@true-north/web-service';
import { TaskVo } from '@true-north/vo';

export default function TriggerStatusCheckbox(props: {
  todo: {
    status: TaskVo['status'];
    id: string;
  };
  onChange: () => Promise<void>;
}) {
  const { todo } = props;

  async function restore() {
    await TaskService.restore(todo.id, { silent: false });
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
          const { list: todoSubTaskList } = await TaskService.findByFilter({
            parentId: todo.id,
          });

          if (todoSubTaskList.length === 0) {
            // TODO: 需要实现批量完成功能
            throw new Error('批量完成功能需要重新实现');
            await props.onChange();
            return;
          }

          Modal.confirm({
            title: '完成任务',
            content: `完成任务后，将自动完成其所有子任务。`,
            onOk: async () => {
              // TODO: 需要实现批量完成功能
              throw new Error('批量完成功能需要重新实现');
            },
          });
        }}
      />
    </div>
  );
}
