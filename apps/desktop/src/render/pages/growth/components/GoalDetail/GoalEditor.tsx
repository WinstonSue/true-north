import { FlexibleContainer } from '@true-north/components-ui';
import {
  GoalDetailProvider,
  GoalDetailContextProps,
  useGoalDetailContext,
} from './context';
import GoalForm from './GoalForm';
import { Button } from '@sue/design-web-react';
import { GoalService, GoalMapping } from '@true-north/web-service';
import GoalForeign from './GoalForeign';

const { Shrink, Fixed } = FlexibleContainer;

export type GoalEditorProps = {
  goalId: string;
  size?: GoalDetailContextProps['size'];
  readonly?: boolean;
  onClose?: () => Promise<void>;
  afterSubmit?: GoalDetailContextProps['afterSubmit'];
};

export default function GoalEditor(props: GoalEditorProps) {
  return (
    <GoalDetailProvider
      size={props.size}
      goalId={props.goalId}
      readonly={props.readonly}
      onClose={props.onClose}
      afterSubmit={props.afterSubmit}
    >
      <FlexibleContainer className="gap-2">
        <Fixed className="border-b border-border-2">
          <GoalForm />
        </Fixed>
        <GoalForeign goalId={props.goalId} />
        <Fixed>
          <GoalEditorFooter />
        </Fixed>
      </FlexibleContainer>
    </GoalDetailProvider>
  );
}

export function GoalEditorFooter() {
  const { onSubmit, onClose, currentGoal, goalFormData } =
    useGoalDetailContext();

  async function handleUpdate() {
    await GoalService.update(
      currentGoal.id,
      GoalMapping.formDataToUpdateVo(goalFormData),
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <Button onClick={() => onClose?.()}>取消</Button>
      <Button
        type="primary"
        onClick={async () => {
          await handleUpdate();
          await onSubmit();
          onClose?.();
        }}
      >
        确认
      </Button>
    </div>
  );
}
