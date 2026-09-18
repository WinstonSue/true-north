import { useEffect, useState } from 'react';
import { Button, Flex, Form, message } from '@sue/design-web-react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { DEFAULT_GROWTH_NOTIFY_SETTINGS, type GrowthNotifySettings } from '@true-north/vo';
import { NotifyController } from '../../../client';
import { GrowthPage } from '../../ui/GrowthPage';
import { GlobalNotifyFields } from '../../shared/notify/NotifyRuleFields';

export default function NotifyFeature() {
  const [settings, setSettings] = useState<GrowthNotifySettings>(DEFAULT_GROWTH_NOTIFY_SETTINGS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void NotifyController.getSettings()
      .then((next) => setSettings(next || DEFAULT_GROWTH_NOTIFY_SETTINGS))
      .catch((error) => console.error(error));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const saved = await NotifyController.putSettings(settings);
      setSettings(saved);
      message.success('已保存通知规则');
    } catch (error) {
      console.error(error);
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <GrowthPage title="通知规则">
      <ProductSurface id={productRef('growth.notify.view.settings')}>
        <Form layout="vertical" style={{ padding: 20, maxWidth: 720 }}>
          <Flex vertical gap={16}>
            <p style={{ margin: 0, color: 'var(--sue-color-text-secondary)' }}>
              默认规则用于所有未单独设置的待办、任务与习惯。过期项每天按时刻提醒；当天待办还会在计划开始时间提醒；习惯只在当天打卡时刻提醒。
            </p>
            <GlobalNotifyFields value={settings} onChange={setSettings} />
            <Button type="primary" loading={saving} onClick={() => void save()} style={{ alignSelf: 'flex-start' }}>
              保存
            </Button>
          </Flex>
        </Form>
      </ProductSurface>
    </GrowthPage>
  );
}
