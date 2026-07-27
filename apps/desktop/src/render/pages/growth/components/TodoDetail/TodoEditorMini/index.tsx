import { Flex } from '@sue/design-web-react';
import { TodoVo } from '@true-north/vo';
import { TodoDetailProvider } from '../context';
import TodoEditorMain from './TodoEditorMain';
import TodoEditorHeader from './TodoEditorHeader';

export type TodoEditorSimpleProps = {
  todo: TodoVo;
  onClose?: () => void;
  afterSubmit: () => Promise<void>;
};

export default function TodoEditorMini(props: TodoEditorSimpleProps) {
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
      </Flex>
    </TodoDetailProvider>
  );
}
