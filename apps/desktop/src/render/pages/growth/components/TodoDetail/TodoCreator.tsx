'use client';

import type { TodoFormData } from '@true-north/web-service';
import { TodoDetailProvider } from './context';
import TodoForm from './TodoForm';

export type TodoCreatorProps = {
  initialFormData?: Partial<TodoFormData>;
  onClose?: () => Promise<void>;
  afterSubmit?: () => Promise<void>;
};

export default function TodoCreator(props: TodoCreatorProps) {
  return (
    <TodoDetailProvider
      mode="creator"
      initialFormData={props.initialFormData}
      afterSubmit={props.afterSubmit}
    >
      <TodoForm onClose={props.onClose} />
    </TodoDetailProvider>
  );
}
