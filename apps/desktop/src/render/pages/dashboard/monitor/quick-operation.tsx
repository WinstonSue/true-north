import React from 'react';
import {
  Button,
  Card,
  Space,
  RightOutlined,
  SwapOutlined,
} from '@sue/design-web-react';
import { StopOutlined, TagsOutlined } from '@ant-design/icons';
import useLocale from '@/utils/useLocale';
import locale from './locale';

export default function QuickOperation() {
  const t = useLocale(locale);
  return (
    <Card>
      <h6 className="text-title-1 font-medium" style={{ marginTop: 0, marginBottom: 16 }}>
        {t['monitor.title.quickOperation']}
      </h6>
      <Space direction="vertical" style={{ width: '100%' }} size={10}>
        <Button long icon={<TagsOutlined />}>
          {t['monitor.quickOperation.changeClarity']}
        </Button>
        <Button long icon={<SwapOutlined />}>
          {t['monitor.quickOperation.switchStream']}
        </Button>
        <Button long icon={<StopOutlined />}>
          {t['monitor.quickOperation.removeClarity']}
        </Button>
        <Button long icon={<RightOutlined />}>
          {t['monitor.quickOperation.pushFlowGasket']}
        </Button>
      </Space>
    </Card>);

}