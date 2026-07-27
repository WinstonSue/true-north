import React from 'react';
import clsx from 'clsx';
import styles from './flexible-container.module.css';

type ContainerProps = {
  direction?: 'vertical' | 'horizontal';
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function Container(props: ContainerProps) {
  const { direction = 'horizontal', className, children, ...rest } = props;
  return (
    <div
      className={clsx(
        styles.container,
        direction === 'vertical' && styles.containerVertical,
        direction === 'horizontal' && styles.containerHorizontal,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

function ContainerFixed(props: ContainerProps) {
  const { direction, className, children, ...rest } = props;
  return (
    <div
      className={clsx(
        styles.containerFixed,
        'container-fixed',
        direction === 'vertical' && [styles.container, styles.containerVertical],
        direction === 'horizontal' && [styles.container, styles.containerHorizontal],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

function ContainerShrink(
  props: {
    absolute?: boolean;
    overflowY?: 'hidden' | 'auto';
  } & ContainerProps,
) {
  const { direction, className, children, absolute, overflowY, ...rest } = props;
  const shrinkClass = clsx(
    styles.containerShrink,
    'container-shrink',
    absolute && 'relative',
    !absolute && [
      direction === 'vertical' && [styles.container, styles.containerVertical],
      direction === 'horizontal' && [styles.container, styles.containerHorizontal],
    ],
    className,
  );

  if (absolute) {
    return (
      <div className={shrinkClass} {...rest}>
        <div
          className={clsx('absolute w-full h-full', [
            direction === 'vertical' && [styles.container, styles.containerVertical],
            direction === 'horizontal' && [styles.container, styles.containerHorizontal],
          ])}
          style={{ overflowY }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={shrinkClass} {...rest}>
      {children}
    </div>
  );
}

const FlexibleContainer = Object.assign(Container, {
  Fixed: ContainerFixed,
  Shrink: ContainerShrink,
});

export default FlexibleContainer;
export { FlexibleContainer as PageFlex };
