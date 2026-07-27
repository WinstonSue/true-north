import React from 'react';
import { Button } from '@sue/design-web-react';
import { Result } from '@true-north/components-ui';
import locale from './locale';
import useLocale from '@/utils/useLocale';
import styles from './style/index.module.less';

function Exception500() {
  const t = useLocale(locale);

  return (
    <div className={styles.wrapper}>
      <Result
        className={styles.result}
        status="500"
        subTitle={t['exception.result.500.description']}
        extra={
          <Button key="back" type="primary">
            {t['exception.result.500.back']}
          </Button>
        }
      />
    </div>
  );
}

export default Exception500;
