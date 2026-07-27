import { FlexibleContainer } from '@true-north/components-ui';
import { TodoVo } from '@true-north/vo';
import { TodoDetailProvider, useTodoDetailContext } from '../context';
import TodoEditorMain from './TodoEditorMain';
import TodoEditorHeader from './TodoEditorHeader';
import { Button } from '@sue/design-web-react';

const { Fixed, Shrink } = FlexibleContainer;

export type TodoEditorProps = {
  todo: TodoVo;
  onClose?: () => void;
  afterSubmit: () => Promise<void>;
};

export default function TodoEditor(props: TodoEditorProps) {
  return (
    <TodoDetailProvider
      todo={props.todo}
      mode="editor"
      afterSubmit={props.afterSubmit}
    >
      <FlexibleContainer>
        <Fixed>
          <TodoEditorHeader />
        </Fixed>
        <Shrink>
          <TodoEditorMain />
        </Shrink>
        <Fixed>
          <Footer onClose={props.onClose} />
        </Fixed>
      </FlexibleContainer>
    </TodoDetailProvider>
  );
}

function Footer(props: { onClose?: () => void }) {
  const { onSubmit } = useTodoDetailContext();
  return (
    <div className="flex justify-end gap-2">
      <Button onClick={() => props.onClose?.()}>取消</Button>
      <Button
        type="primary"
        onClick={async () => {
          await onSubmit();
          props.onClose?.();
        }}
      >
        确认
      </Button>
    </div>
  );
}
