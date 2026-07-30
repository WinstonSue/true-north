import { Drawer, Popover } from '@sue/design-web-react';
import { useState } from 'react';
import TodoEditor, { TodoEditorProps } from './TodoEditor';
import TodoCreatorMini, { TodoCreatorMiniProps } from './TodoCreatorMini';
import TodoCreator, { TodoCreatorProps } from './TodoCreator';

export { TodoEditor, TodoCreator, TodoCreatorMini };

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

  const [createPopoverVisible, setCreatePopoverVisible] = useState(false);

  const CreatePopover = ({
    children,
    creatorProps,
  }: {
    children: React.ReactNode;
    creatorProps: TodoCreatorMiniProps;
  }) => {
    return (
      <Popover
        trigger="click"
        open={createPopoverVisible}
        onOpenChange={(visible) => {
          setCreatePopoverVisible(visible);
        }}
        placement="bottomLeft"
        style={{
          maxWidth: 'unset',
        }}
        content={
          <div className="w-[400px] p-2">
            <TodoCreatorMini
              {...creatorProps}
              onClose={async () => {
                await creatorProps.onClose?.();
                setCreatePopoverVisible(false);
              }}
            />
          </div>
        }
      >
        <span
          className="cursor-pointer"
          onClick={() => setCreatePopoverVisible(true)}
        >
          {children}
        </span>
      </Popover>
    );
  };

  return {
    openEditDrawer,
    openCreateDrawer,
    CreatePopover,
    createPopoverVisible,
  };
}
