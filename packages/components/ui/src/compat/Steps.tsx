import React, { ReactNode } from 'react';
import { Flex } from '@sue/design-web-react';
import clsx from 'clsx';

export interface StepProps {
  title?: ReactNode;
  description?: ReactNode;
  status?: 'wait' | 'process' | 'finish' | 'error';
  icon?: ReactNode;
}

export interface StepsProps {
  current?: number;
  type?: 'default' | 'arrow' | 'dot' | 'navigation';
  lineless?: boolean;
  direction?: 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

function Step(_props: StepProps) {
  return null;
}

function Steps({ current = 0, className, style, children }: StepsProps) {
  const steps = React.Children.toArray(children).filter(Boolean) as React.ReactElement<StepProps>[];

  return (
    <Flex className={clsx('tn-steps', className)} style={style} gap={8} wrap="wrap">
      {steps.map((child, index) => {
        const { title, description } = child.props;
        const active = index === current;
        const done = index < current;
        return (
          <Flex key={index} vertical gap={4} style={{ minWidth: 120 }}>
            <Flex align="center" gap={8}>
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  background: active ? 'var(--color-primary-6, #165dff)' : done ? 'var(--color-primary-3, #94bfff)' : 'var(--color-fill-3, #f2f3f5)',
                  color: active || done ? '#fff' : 'var(--color-text-2)',
                }}
              >
                {index + 1}
              </span>
              <span style={{ fontWeight: active ? 600 : 400 }}>{title}</span>
            </Flex>
            {description && (
              <span style={{ fontSize: 12, color: 'var(--color-text-3)', paddingLeft: 32 }}>
                {description}
              </span>
            )}
          </Flex>
        );
      })}
    </Flex>
  );
}

Steps.Step = Step;

export { Steps };
