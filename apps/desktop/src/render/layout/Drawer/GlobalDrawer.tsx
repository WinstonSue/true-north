import { Drawer } from '@sue/design-web-react';
import { useStore } from '@nanostores/react';
import { drawerQueueStore, closeDrawer } from './store';

const GlobalDrawer = () => {
  const drawerQueue = useStore(drawerQueueStore);

  return (
    <>
      {drawerQueue.map((drawerOption, index) => {
        const {
          content: DrawerContent,
          visible,
          width,
          size,
          onClose,
          onCancel,
          ...restProps
        } = drawerOption as typeof drawerOption & {
          width?: number | string;
          onCancel?: () => void;
        };
        return (
          <Drawer
            {...restProps}
            key={index}
            open={visible}
            size={size ?? width}
            footer={null}
            onClose={() => {
              onCancel?.();
              closeDrawer(index);
            }}
          >
            {visible && (
              <DrawerContent
                param={drawerOption.param}
                onConfirm={(data) => {
                  drawerOption.onConfirm?.(data);
                  closeDrawer(index);
                }}
                onClose={() => closeDrawer(index)}
              />
            )}
          </Drawer>
        );
      })}
    </>
  );
};

export default GlobalDrawer;
