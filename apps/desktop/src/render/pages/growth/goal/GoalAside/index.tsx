import React, { useState } from 'react';
import clsx from 'clsx';
import { Button } from '@sue/design-web-react';
import { IconPlus } from '@true-north/components-ui';
import { Divider } from '@sue/design-web-react';
import { FlexibleContainer } from '@true-north/components-ui';
import GoalFilters from './GoalFilters';
import GoalTree from './GoalTree';
import { useGoalContext } from '../context';
import { useGoalDetail } from '../../components/GoalDetail';

const { Fixed, Shrink } = FlexibleContainer;

export default function GoalAside() {
  const { refreshData } = useGoalContext();
  const { openCreateDrawer } = useGoalDetail();

  return (
    <FlexibleContainer className={clsx('py-3', 'gap-3')}>
      {/* 头部工具栏 */}
      <Fixed className={clsx('px-4', 'flex flex-col gap-3')}>
        <GoalFilters />
      </Fixed>

      <Divider className={'!m-0'} />

      <Shrink className={clsx('px-4', 'overflow-y-auto')}>
        <GoalTree />
      </Shrink>

      <Fixed className={clsx('px-4')}>
        <Button
          className={'w-full'}
          type="primary"
          icon={<IconPlus />}
          onClick={() =>
            openCreateDrawer({
              title: '新建目标',
              contentProps: {
                afterSubmit: refreshData,
              },
            })
          }
        >
          新建
        </Button>
      </Fixed>
    </FlexibleContainer>
  );
}
