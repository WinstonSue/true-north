import React, { useState } from 'react';
import clsx from 'clsx';
import { Button, Divider, Flex, PlusOutlined } from '@sue/design-web-react';

import GoalFilters from './GoalFilters';
import GoalTree from './GoalTree';
import { useGoalContext } from '../context';
import { useGoalDetail } from '../../components/GoalDetail';

export default function GoalAside() {
  const { refreshData } = useGoalContext();
  const { openCreateDrawer } = useGoalDetail();

  return (
    <Flex vertical container="full" className={clsx('py-3', 'gap-3')}>
      {/* 头部工具栏 */}
      <Flex
        container="fixed"
        className={clsx('w-full', 'px-4', 'flex flex-col gap-3')}
      >
        <GoalFilters />
      </Flex>

      <Divider className={'!m-0'} />

      <Flex container="fill" className={clsx('px-4', 'overflow-y-auto')}>
        <GoalTree />
      </Flex>

      <Flex container="fixed" className={clsx('w-full', 'px-4')}>
        <Button
          className={'w-full'}
          type="primary"
          icon={<PlusOutlined />}
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
      </Flex>
    </Flex>
  );
}
