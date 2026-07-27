import React from 'react';
import { Button } from '@sue/design-web-react';
import { Typography, Result } from '@true-north/components-ui';
import { IconLink } from '@true-north/components-ui';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';

function Success() {
  const t = useLocale(locale);

  return (
    <div>
      <div className={styles.wrapper}>
        <Result
          className={styles.result}
          status="error"
          title={t['error.result.title']}
          subTitle={t['error.result.subTitle']}
          extra={[
            <Button key="again" type="secondary" style={{ marginRight: 16 }}>
              {t['error.result.goBack']}
            </Button>,
            <Button key="back" type="primary">
              {t['error.result.retry']}
            </Button>,
          ]}
        />
        <div className={styles['details-wrapper']}>
          <Typography.Title heading={6} style={{ marginTop: 0 }}>
            {t['error.detailTitle']}
          </Typography.Title>
          <Typography.Paragraph style={{ marginBottom: 0 }}>
            <ol>
              <li>
                {t['error.detailLine.record']}
                <Typography.Link>
                  <IconLink />
                  {t['error.detailLine.record.link']}
                </Typography.Link>
              </li>
              <li>
                {t['error.detailLine.auth']}
                <Typography.Link>{t['error.detailLine.auth.link']}</Typography.Link>
              </li>
            </ol>
          </Typography.Paragraph>
        </div>
      </div>
    </div>
  );
}

export default Success;
