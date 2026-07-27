import { Modal } from '@sue/design-web-react';
import type { ConfirmProps } from '@true-north/components-ui';

export function openModal(modalOption: ConfirmProps = {}) {
  return Modal.confirm({
    icon: null,
    closable: true,
    ...modalOption,
  });
}
