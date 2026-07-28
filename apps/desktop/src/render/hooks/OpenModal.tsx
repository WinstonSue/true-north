import { Modal, type ModalFuncProps } from '@sue/design-web-react';

export function openModal(modalOption: ModalFuncProps = {}) {
  return Modal.confirm({
    icon: null,
    closable: true,
    ...modalOption,
  });
}
