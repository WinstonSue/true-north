import React from 'react';
import { Card, Tag, Space, Descriptions } from '@sue/design-web-react';

import useLocale from '@/utils/useLocale';
import locale from './locale';

export default function StudioStatus() {
  const t = useLocale(locale);
  const dataStatus = [
  {
    label:
    <span>
          <span style={{ paddingRight: 8 }}>
            {t['monitor.studioStatus.mainstream']}
          </span>
          {t['monitor.studioStatus.bitRate']}
        </span>,

    value: '6 Mbps'
  },
  {
    label: t['monitor.studioStatus.frameRate'],
    value: '60'
  },
  {
    label:
    <span>
          <span style={{ paddingRight: 8 }}>
            {t['monitor.studioStatus.hotStandby']}
          </span>
          {t['monitor.studioStatus.bitRate']}
        </span>,

    value: '6 Mbps'
  },
  {
    label: t['monitor.studioStatus.frameRate'],
    value: '60'
  },
  {
    label:
    <span>
          <span style={{ paddingRight: 8 }}>
            {t['monitor.studioStatus.coldStandby']}
          </span>
          {t['monitor.studioStatus.bitRate']}
        </span>,

    value: '6 Mbps'
  },
  {
    label: t['monitor.studioStatus.frameRate'],
    value: '60'
  }];

  const dataPicture = [
  {
    label: t['monitor.studioStatus.line'],
    value: '热备'
  },
  {
    label: 'CDN',
    value: 'KS'
  },
  {
    label: t['monitor.studioStatus.play'],
    value: 'FLV'
  },
  {
    label: t['monitor.studioStatus.pictureQuality'],
    value: '原画'
  }];

  return (
    <Card>
      <Space align="start">
        <h6 className="text-title-1 font-medium"
        style={{ marginTop: 0, marginBottom: 16 }}>

          {t['monitor.studioStatus.title.studioStatus']}
        </h6>
        <Tag color="green">{t['monitor.studioStatus.smooth']}</Tag>
      </Space>
      <Descriptions
        colon=": "
        layout="horizontal"
        data={dataStatus}
        column={2} />

      <h6 className="text-title-1 font-medium" style={{ marginBottom: 16 }}>
        {t['monitor.studioStatus.title.pictureInfo']}
      </h6>
      <Descriptions
        colon=": "
        layout="horizontal"
        data={dataPicture}
        column={2} />

    </Card>);

}