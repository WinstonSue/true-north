'use client';

import type { ReactNode } from 'react';
import type { TodoFormData } from '../../../../client';
import type { TodoVo } from '@true-north/vo';
import { RendererPlatformProvider, useRendererPlatform } from '@true-north/plugin-sdk/renderer';
import { drawerShellStyles } from '../../../ui';
import { openGrowthDrawer } from '../../../runtime/drawer';
import { TodoDetailProvider, type TodoSubmitCreate } from './context';
import TodoForm from './TodoForm';

export type TodoEditorProps = {
  todo: TodoVo;
  onClose?: () => void;
  afterSubmit: () => Promise<void>;
};

export type TodoCreatorProps = {
  initialFormData?: Partial<TodoFormData>;
  onClose?: () => Promise<void>;
  afterSubmit?: () => Promise<void>;
  submitCreate?: TodoSubmitCreate;
};

export function TodoEditor(props: TodoEditorProps) {
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

export function TodoCreator(props: TodoCreatorProps) {
  return (
    <TodoDetailProvider
      mode="creator"
      initialFormData={props.initialFormData}
      afterSubmit={props.afterSubmit}
      submitCreate={props.submitCreate}
    >
      <TodoForm onClose={props.onClose} />
    </TodoDetailProvider>
  );
}

export { formatPlanTime, isPlanRange } from './planTime';

type DrawerOptions = Omit<Parameters<typeof openGrowthDrawer>[0], 'content'>;

export function useTodoDetail() {
  const platform = useRendererPlatform();
  const wrap = (content: ReactNode) => (
    <RendererPlatformProvider platform={platform}>{content}</RendererPlatformProvider>
  );

  const openEditDrawer = (
    props: {
      contentProps: TodoEditorProps;
    } & DrawerOptions,
  ) => {
    const { contentProps, ...rest } = props;
    const instance = openGrowthDrawer({
      ...rest,
      title: '编辑待办',
      size: 800,
      styles: drawerShellStyles,
      content: wrap(
        <TodoEditor
          {...contentProps}
          onClose={async () => {
            instance.destroy();
          }}
        />,
      ),
    });
  };

  const openCreateDrawer = (
    props: {
      contentProps: TodoCreatorProps;
    } & DrawerOptions,
  ) => {
    const { contentProps, ...rest } = props;
    const instance = openGrowthDrawer({
      ...rest,
      title: '新建待办',
      size: 800,
      styles: drawerShellStyles,
      content: wrap(
        <TodoCreator
          {...contentProps}
          onClose={async () => {
            instance.destroy();
          }}
        />,
      ),
    });
  };

  return {
    openEditDrawer,
    openCreateDrawer,
  };
}
