import { Input } from '@sue/design-web-react';
import clsx from 'clsx';
import { useTodoDetailContext } from '../context';

const TextArea = Input.TextArea;

export default function TodoEditorMain() {
  const { todoFormData, setTodoFormData, onSubmit } = useTodoDetailContext();

  return todoFormData ? (
    <>
      <Input
        value={todoFormData.name}
        placeholder="准备做什么?"
        size="small"
        variant="borderless"
        className="!text-text-1 mb-1"
        onChange={(event) => {
          setTodoFormData({ name: event.target.value });
        }}
        onBlur={() => {
          onSubmit();
        }}
      />
      <TextArea
        autoSize={false}
        value={todoFormData.description}
        placeholder="描述一下"
        variant="borderless"
        className={clsx('!text-text-3 !text-body-1 mb-1')}
        onChange={(event) => {
          setTodoFormData({ description: event.target.value });
        }}
      />
    </>
  ) : null;
}
