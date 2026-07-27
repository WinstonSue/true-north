import { FlexibleContainer } from '@true-north/components-ui';
import {
  GoalDetailProvider,
  useGoalDetailContext,
  GoalDetailContextProps,
} from './context';
import GoalForm from './GoalForm';
import { Button } from '@sue/design-web-react';
import { GoalService, GoalMapping } from '@true-north/web-service';

const { Shrink, Fixed } = FlexibleContainer;

export type GoalCreatorProps = {
  size?: GoalDetailContextProps['size'];
  initialFormData?: GoalDetailContextProps['initialFormData'];
  afterSubmit?: GoalDetailContextProps['afterSubmit'];
  onClose?: () => Promise<void>;
};

export default function GoalCreator(props: GoalCreatorProps) {
  return (
    <GoalDetailProvider
      initialFormData={props.initialFormData}
      size={props.size}
      afterSubmit={props.afterSubmit}
      onClose={props.onClose}
    >
      <FlexibleContainer>
        <Shrink>
          <GoalForm />
        </Shrink>
        <Fixed>
          <Footer />
        </Fixed>
      </FlexibleContainer>
    </GoalDetailProvider>
  );
}

function Footer() {
  const { goalFormData, onSubmit, onClose } = useGoalDetailContext();

  async function handleCreate() {
    await GoalService.create(GoalMapping.formDataToCreateVo(goalFormData));
  }

  return (
    <div className="flex justify-end gap-2">
      <Button onClick={() => onClose?.()}>取消</Button>
      <Button
        type="primary"
        onClick={async () => {
          if (!goalFormData.name) {
            return;
          }
          await handleCreate();
          await onSubmit();
          onClose?.();
        }}
      >
        确认
      </Button>
    </div>
  );
}
