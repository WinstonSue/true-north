import { Flex, Button } from '@sue/design-web-react';
import { TodoVo } from '@true-north/vo';
import { TodoDetailProvider, useTodoDetailContext } from '../context';
import TodoEditorMain from './TodoEditorMain';
import TodoEditorHeader from './TodoEditorHeader';

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
      <Flex vertical container="full">
        <Flex container="fixed" className="w-full">
          <TodoEditorHeader />
        </Flex>
        <Flex container="fill">
          <TodoEditorMain />
        </Flex>
        <Flex container="fixed" className="w-full">
          <Footer onClose={props.onClose} />
        </Flex>
      </Flex>
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
