import { Checkbox, Modal } from '@arco-design/web-react';
import styles from './style.module.less';
import { GoalService } from '@true-north/web-service';
import { GoalVo } from '@true-north/vo';

export default function TriggerStatusCheckbox(props: {
  goal: {
    status: GoalVo['status'];
    id: string;
  };
  onChange: () => Promise<void>;
}) {
  const { goal } = props;

  async function restore() {
    await GoalService.restore(goal.id);
    await props.onChange();
  }

  return (
    <div
      className={`w-8 h-8 flex items-center ${styles['custom-checkbox-wrapper']}`}
    >
      <Checkbox
        checked={goal.status === 'done'}
        onChange={async () => {
          if (goal.status !== 'todo') {
            await restore();
            return;
          }
          const { list: children } = await GoalService.findByFilter({
            parentId: goal.id,
          });

          if (children.length === 0) {
            // TODO: 需要实现批量完成功能
            throw new Error('批量完成功能需要重新实现');
            await props.onChange();
            return;
          }

          Modal.confirm({
            title: '完成目标',
            content: `完成目标后，将自动完成其所有子目标。`,
            onOk: async () => {
              // TODO: 需要实现批量完成功能
              throw new Error('批量完成功能需要重新实现');
              await props.onChange();
            },
          });
        }}
      />
    </div>
  );
}
