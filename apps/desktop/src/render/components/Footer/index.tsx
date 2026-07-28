import { Layout } from '@sue/design-web-react';
import type { HTMLAttributes } from 'react';

import cs from 'clsx';
import styles from './style/index.module.less';

function Footer(props: HTMLAttributes<HTMLElement> = {}) {
  const { className, ...restProps } = props;
  return (
    <Layout.Footer className={cs(styles.footer, className)} {...restProps}>
      True North
    </Layout.Footer>
  );
}

export default Footer;
