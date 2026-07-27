import { Card, Avatar, Space, Row, Col, EllipsisOutlined } from '@sue/design-web-react';

import React from 'react';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';

interface StudioProps {
  userInfo: {
    name?: string;
    avatar?: string;
  };
}

export default function Studio(props: StudioProps) {
  const t = useLocale(locale);
  const { userInfo } = props;
  return (
    <Card>
      <Row>
        <Col span={16}>
          <h6 className="text-title-1 font-medium"
          style={{ marginTop: 0, marginBottom: 16 }}>

            {t['monitor.title.studioPreview']}
          </h6>
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          <EllipsisOutlined />
        </Col>
      </Row>
      <div className={styles['studio-wrapper']}>
        <img
          src="http://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/c788fc704d32cf3b1136c7d45afc2669.png~tplv-uwbnlip3yd-webp.webp"
          className={styles['studio-preview']} />

        <div className={styles['studio-bar']}>
          {userInfo &&
          <div>
              <Space size={12}>
                <Avatar size={24}>
                  <img src={userInfo.avatar} />
                </Avatar>
                <span>
                  {userInfo.name}
                  {t['monitor.studioPreview.studio']}
                </span>
              </Space>
            </div>
          }
          <span className="text-text-3">
            3,6000 {t['monitor.studioPreview.watching']}
          </span>
        </div>
      </div>
    </Card>);

}