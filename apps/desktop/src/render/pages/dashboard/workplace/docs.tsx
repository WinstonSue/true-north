import React from 'react';
import { Card } from '@sue/design-web-react';

import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/docs.module.less';
const links = {
  react: 'https://arco.design/react/docs/start',
  vue: 'https://arco.design/vue/docs/start',
  designLab: 'https://arco.design/themes',
  materialMarket: 'https://arco.design/material/'
};
function QuickOperation() {
  const t = useLocale(locale);
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h6 className="text-title-1 font-medium">{t['workplace.docs']}</h6>
        <a style={{ color: "var(--color-primary-6)" }}>{t['workplace.seeMore']}</a>
      </div>
      <div className={styles.docs}>
        {Object.entries(links).map(([key, value]) =>
        <a key={key} href={value} target="_blank" className={styles.link} style={{ color: "var(--color-primary-6)" }}>
            {t[`workplace.${key}`]}
          </a>
        )}
      </div>
    </Card>);

}
export default QuickOperation;