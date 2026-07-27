'use client';

import { Flex } from '@sue/design-web-react';
import clsx from 'clsx';

export default function DefaultPage(props: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Flex
      vertical
      container="full"
      className="bg-bg-2 rounded-lg w-full h-full"
    >
      <Flex
        container="fixed"
        className="px-5 py-2 flex justify-between items-center border-b"
      >
        <div className="text-text-1 text-title-2 font-medium py-1">
          {props.title}
        </div>
      </Flex>

      <Flex
        container="fill"
        className={clsx('px-5 w-full h-full', 'flex flex-col gap-3')}
      >
        {props.children}
      </Flex>
    </Flex>
  );
}
