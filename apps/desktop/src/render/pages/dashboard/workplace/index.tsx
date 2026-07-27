import React from 'react';
import { Space } from '@sue/design-web-react';
import { Grid } from '@true-north/components-ui';
import Overview from './overview';
import PopularContents from './popular-contents';
import ContentPercentage from './content-percentage';
import Shortcuts from './shortcuts';
import Announcement from './announcement';
import Carousel from './carousel';
import Docs from './docs';
import styles from './style/index.module.less';
import './mock';

const { Row, Col } = Grid;

const gutter = 16;

function Workplace() {
  return (
    <div className={styles.wrapper}>
      <Space size={16} direction="vertical" className={styles.left}>
        <Overview />
        <Row gutter={gutter}>
          <Col span={12}>
            <PopularContents />
          </Col>
          <Col span={12}>
            <ContentPercentage />
          </Col>
        </Row>
      </Space>
      <Space className={styles.right} size={16} direction="vertical">
        <Shortcuts />
        <Carousel />
        <Announcement />
        <Docs />
      </Space>
    </div>
  );
}

export default Workplace;
