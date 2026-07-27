import type { HTMLAttributes } from 'react';
import type {
  ModalFuncProps,
  TableColumnProps,
  FormRule,
} from '@sue/design-web-react';

/** Arco ConfirmProps */
export type ConfirmProps = ModalFuncProps;

/** Arco Table ColumnProps */
export type ColumnProps<T = any> = TableColumnProps<T>;

/** Arco Form RulesProps */
export type RulesProps = FormRule;

/** Arco Layout.Footer props */
export type FooterProps = HTMLAttributes<HTMLElement> & {
  className?: string;
};
