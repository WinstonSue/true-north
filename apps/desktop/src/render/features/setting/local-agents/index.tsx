import { useCallback, useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Input, message } from '@sue/design-web-react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import type { RuntimeAgentManagementVo, RuntimeSettingsVo } from '@true-north/vo';
import { AiService } from '@true-north/web-service';
import useLocale from '@/utils/useLocale';
import locale from '../locale';
import styles from '../style.module.less';

function statusText(agent: RuntimeAgentManagementVo, t: Record<string, string>) {
  if (!agent.enabled) return t['setting.agents.status.disabled'];
  if (agent.available) {
    return agent.version
      ? `${t['setting.agents.status.ready']} · ${agent.version}`
      : t['setting.agents.status.ready'];
  }
  return agent.unavailableReason || t['setting.agents.status.unavailable'];
}

function LocalAgents() {
  const t = useLocale(locale);
  const [settings, setSettings] = useState<RuntimeSettingsVo | null>(null);
  const [draftOverrides, setDraftOverrides] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const applySettings = useCallback((next: RuntimeSettingsVo) => {
    setSettings(next);
    const drafts: Record<string, string> = {};
    for (const agent of next.agents) {
      drafts[agent.id] = agent.pathOverride || '';
    }
    setDraftOverrides(drafts);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await AiService.getRuntimeSettings();
    setLoading(false);
    if (result.ok === false) {
      message.error(result.message);
      return;
    }
    applySettings(result.data);
  }, [applySettings]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const persist = useCallback(
    async (body: Parameters<typeof AiService.putRuntimeSettings>[0]) => {
      setSaving(true);
      const result = await AiService.putRuntimeSettings(body);
      setSaving(false);
      if (result.ok === false) {
        message.error(result.message);
        return;
      }
      applySettings(result.data);
    },
    [applySettings]
  );

  return (
    <ProductSurface id={productRef('setting.view.local-agents')}>
      <Flex vertical className={styles.content} gap={24}>
        <Flex align="center" justify="space-between" gap={16}>
          <h1 className={styles.title}>{t['setting.agents']}</h1>
          <Button size="small" onClick={() => void refresh()} disabled={loading || saving}>
            {t['setting.agents.refresh']}
          </Button>
        </Flex>
        <div className={styles.lead}>{t['setting.agents.lead']}</div>
        <Flex vertical className={styles.group} gap={0}>
          {(settings?.agents || []).map((agent) => (
            <Flex key={agent.id} vertical className={styles.agentCard} gap={12}>
              <Flex align="center" justify="space-between" gap={16}>
                <Flex align="center" gap={12}>
                  <div className={styles.rowLabel}>{agent.name}</div>
                  {agent.isDefault ? (
                    <span className={styles.badge}>{t['setting.agents.default.badge']}</span>
                  ) : null}
                </Flex>
                <Checkbox
                  checked={agent.enabled}
                  disabled={saving}
                  onChange={(event) => {
                    void persist({ agents: [{ id: agent.id, enabled: event.target.checked }] });
                  }}
                >
                  {t['setting.agents.enabled']}
                </Checkbox>
              </Flex>
              <div className={styles.status}>{statusText(agent, t)}</div>
              <div className={styles.meta}>
                {t['setting.agents.autoPath']}: {agent.autoDetectedPath || t['setting.agents.notFound']}
              </div>
              <Flex align="center" gap={8} className={styles.pathRow}>
                <Input
                  value={draftOverrides[agent.id] ?? ''}
                  placeholder={t['setting.agents.pathPlaceholder']}
                  disabled={saving}
                  onChange={(event) => {
                    const value = event.target.value;
                    setDraftOverrides((prev) => ({ ...prev, [agent.id]: value }));
                  }}
                />
                <Button
                  size="small"
                  disabled={saving}
                  onClick={() => {
                    void persist({
                      agents: [{ id: agent.id, pathOverride: draftOverrides[agent.id] ?? '' }],
                    });
                  }}
                >
                  {t['setting.agents.applyPath']}
                </Button>
                <Button
                  size="small"
                  disabled={saving || !agent.pathOverride}
                  onClick={() => {
                    void persist({ agents: [{ id: agent.id, pathOverride: null }] });
                  }}
                >
                  {t['setting.agents.resetPath']}
                </Button>
              </Flex>
              <div>
                <Button
                  size="small"
                  type={agent.isDefault ? 'primary' : 'default'}
                  disabled={saving || !agent.enabled || agent.isDefault}
                  onClick={() => {
                    void persist({ defaultRuntimeId: agent.id });
                  }}
                >
                  {t['setting.agents.setDefault']}
                </Button>
              </div>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </ProductSurface>
  );
}

export default LocalAgents;
