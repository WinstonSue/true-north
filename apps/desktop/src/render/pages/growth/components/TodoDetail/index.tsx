import { Drawer } from '@sue/design-web-react';
import TodoEditor, { TodoEditorProps } from './TodoEditor';
import TodoCreator, { TodoCreatorProps } from './TodoCreator';

export { TodoEditor, TodoCreator };

type DrawerOptions = Omit<Parameters<typeof Drawer.open>[0], 'content'>;

export function useTodoDetail() {
  const openEditDrawer = (
    props: {
      contentProps: TodoEditorProps;
    } & DrawerOptions,
  ) => {
    const { contentProps, ...rest } = props;
    const instance = Drawer.open({
      ...rest,
      title: '编辑待办',
      size: 800,
      content: (
        <TodoEditor
          {...contentProps}
          onClose={async () => {
            instance.destroy();
          }}
        />
      ),
    });
  };

  const openCreateDrawer = (
    props: {
      contentProps: TodoCreatorProps;
    } & DrawerOptions,
  ) => {
    const { contentProps, ...rest } = props;
    const instance = Drawer.open({
      ...rest,
      title: '新建待办',
      size: 800,
      content: (
        <TodoCreator
          {...contentProps}
          onClose={async () => {
            instance.destroy();
          }}
        />
      ),
    });
  };

  return {
    openEditDrawer,
    openCreateDrawer,
  };
}
