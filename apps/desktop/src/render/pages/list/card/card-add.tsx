import React from 'react';
import { Card, PlusOutlined } from '@sue/design-web-react';
import cs from 'clsx';

import styles from './style/index.module.less';

interface AddCardProps {
  description?: string;
}
function AddCard(props: AddCardProps) {
  return (
    <Card
      className={cs(styles['card-block'], styles['add-card'])}
      title={null}
      bordered={true}
      size="small"
    >
      <div className={styles.content}>
        <div className={styles['add-icon']}>
          <PlusOutlined />
        </div>
        <div className={styles.description}>{props.description}</div>
      </div>
    </Card>
  );
}

export default AddCard;
