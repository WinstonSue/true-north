'use client';

import { TodoVo } from '@true-north/vo';
import { TodoDetailProvider } from '../context';
import TodoForm from '../TodoForm';

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
      <TodoForm onClose={props.onClose} />
    </TodoDetailProvider>
  );
}
