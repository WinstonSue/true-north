import { Card, Form, Input, Button } from '@sue/design-web-react';

import React from 'react';
import useLocale from '@/utils/useLocale';
import locale from './locale';

export default function StudioInformation() {
  const t = useLocale(locale);
  return (
    <Card>
      <h6 className="text-title-1 font-medium" style={{ marginTop: 0, marginBottom: 16 }}>
        {t['monitor.title.studioInfo']}
      </h6>
      <Form layout="vertical">
        <Form.Item label={t['monitor.studioInfo.label.studioTitle']} required>
          <Input
            placeholder={`admin${t['monitor.studioInfo.placeholder.studioTitle']}`} />

        </Form.Item>
        <Form.Item
          label={t['monitor.studioInfo.label.onlineNotification']}
          required>

          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label={t['monitor.studioInfo.label.studioCategory']}
          required>

          <Input.Search />
        </Form.Item>
        <Form.Item
          label={t['monitor.studioInfo.label.studioCategory']}
          required>

          <Input.Search />
        </Form.Item>
      </Form>
      <Button type="primary">更新</Button>
    </Card>);

}