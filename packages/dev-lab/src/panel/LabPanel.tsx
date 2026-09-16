import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Button, ConfigProvider, Empty, Flex, Select, Tabs, Tag, theme as sueTheme } from '@sue/design-web-react';
import { Check, Copy, X } from 'lucide-react';
import zhCN from '@sue/design-web-react/locale/zh_CN';
import {
  getLabPanelBridge,
  isLabFrameMessage,
  isLabTheme,
  labFrameChannel,
  type LabFrameMessage,
  type LabTheme,
} from '../protocol';
import type { TraceEntry, TraceSpan } from '../types';
import { copyText, toCopyJson } from './copy';
import {
  collectTypeOptions,
  entryStatus,
  filterEntries,
  STATUS_FILTER_OPTIONS,
  type TraceStatus,
} from './filters';

type LabToolId = 'request';

function formatDuration(ms?: number): string {
  if (ms == null) return '…';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatTime(ts: number): string {
  const date = new Date(ts);
  const pad = (value: number, size = 2) => String(value).padStart(size, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
}

function pretty(value: unknown): string {
  if (value == null) return '—';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function rowTitle(entry: TraceEntry): string {
  if (entry.kind === 'ipc') return entry.path || 'IPC';
  return entry.summary || entry.kind;
}

function statusClass(entry: TraceEntry): string {
  return `is-${entryStatus(entry)}`;
}

function applyLabDocumentTheme(theme: LabTheme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    document.body.removeAttribute('data-theme');
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
}

export function LabApp() {
  const [theme, setTheme] = useState<LabTheme>('light');
  const sueThemeConfig = useMemo(
    () => ({
      algorithm: theme === 'dark' ? sueTheme.darkAlgorithm : sueTheme.defaultAlgorithm,
    }),
    [theme],
  );

  useEffect(() => {
    applyLabDocumentTheme(theme);
  }, [theme]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) return;
      if (!isLabFrameMessage(event.data) || event.data.type !== labFrameChannel.setTheme) return;
      if (isLabTheme(event.data.theme)) setTheme(event.data.theme);
    };
    window.addEventListener('message', onMessage);
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: labFrameChannel.ready } satisfies LabFrameMessage, '*');
    }
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <ConfigProvider locale={zhCN} theme={sueThemeConfig}>
      <LabShell />
    </ConfigProvider>
  );
}

function LabShell() {
  const [tool, setTool] = useState<LabToolId>('request');
  const [entries, setEntries] = useState<TraceEntry[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<TraceStatus | 'all'>('all');

  useEffect(() => {
    const api = getLabPanelBridge();
    if (!api) return undefined;
    void api.snapshot().then(setEntries);
    return api.onUpdate(setEntries);
  }, []);

  const ordered = useMemo(() => [...entries].reverse(), [entries]);
  const typeOptions = useMemo(() => collectTypeOptions(ordered), [ordered]);
  const filtered = useMemo(
    () => filterEntries(ordered, { type: typeFilter, status: statusFilter }),
    [ordered, typeFilter, statusFilter],
  );

  useEffect(() => {
    if (typeFilter !== 'all' && typeOptions.every((option) => option.value !== typeFilter)) {
      setTypeFilter('all');
    }
  }, [typeFilter, typeOptions]);

  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedEntryId(null);
      return;
    }
    setSelectedEntryId((current) =>
      current && filtered.some((entry) => entry.id === current) ? current : filtered[0].id,
    );
  }, [filtered]);

  const selected = filtered.find((entry) => entry.id === selectedEntryId);

  const clearEntries = () => {
    void getLabPanelBridge()?.clear().then((next) => {
      if (Array.isArray(next)) setEntries(next);
      else setEntries([]);
    });
  };

  return (
    <Flex vertical container="full" className="labPanel" aria-label="Lab">
      <Flex container="fixed" className="labHeader" align="center" gap={8}>
        <Tabs
          className="labTabs"
          size="small"
          activeKey={tool}
          tabBarStyle={{ marginBottom: 0 }}
          onChange={(key) => setTool(key as LabToolId)}
          tabBarExtraContent={
            <Button size="small" onClick={clearEntries}>
              清空
            </Button>
          }
          items={[{ key: 'request', label: '请求' }]}
        />
        <Button
          type="text"
          className="labHeaderClose"
          title="关闭 Lab"
          aria-label="关闭 Lab"
          icon={<X size={16} />}
          onClick={() => getLabPanelBridge()?.sendSetVisible(false)}
        />
      </Flex>
      {tool === 'request' ? (
        <RequestView
          hasEntries={ordered.length > 0}
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          typeOptions={typeOptions}
          onTypeFilter={(value) => setTypeFilter(value ?? 'all')}
          onStatusFilter={(value) => setStatusFilter(value ?? 'all')}
          ordered={filtered}
          selectedEntryId={selectedEntryId}
          selected={selected}
          onSelect={setSelectedEntryId}
        />
      ) : null}
    </Flex>
  );
}

function RequestView({
  hasEntries,
  typeFilter,
  statusFilter,
  typeOptions,
  onTypeFilter,
  onStatusFilter,
  ordered,
  selectedEntryId,
  selected,
  onSelect,
}: {
  hasEntries: boolean;
  typeFilter: string;
  statusFilter: TraceStatus | 'all';
  typeOptions: { value: string; label: string }[];
  onTypeFilter: (value?: string) => void;
  onStatusFilter: (value?: TraceStatus) => void;
  ordered: TraceEntry[];
  selectedEntryId: string | null;
  selected: TraceEntry | undefined;
  onSelect: (id: string) => void;
}) {
  return (
    <Flex vertical container="fill" className="labBody">
      <Flex container="fixed" className="labFilters" align="center" gap={8} wrap>
        <Select
          size="small"
          allowClear
          placeholder="请求类型"
          aria-label="请求类型"
          className="labFilterSelect"
          value={typeFilter === 'all' ? undefined : typeFilter}
          onChange={onTypeFilter}
          options={typeOptions}
        />
        <Select
          size="small"
          allowClear
          placeholder="返回状态"
          aria-label="返回状态"
          className="labFilterSelect"
          value={statusFilter === 'all' ? undefined : statusFilter}
          onChange={onStatusFilter}
          options={[...STATUS_FILTER_OPTIONS]}
        />
      </Flex>
      <Flex container="fill" className="labSplit">
        <Flex vertical container="fixed" className="labList">
          {ordered.length === 0 ? (
            <Empty description={hasEntries ? '没有匹配的请求' : '还没有捕获到请求'} />
          ) : (
            ordered.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={`labRow ${entry.id === selectedEntryId ? 'labRowSelected' : ''}`}
                onClick={() => onSelect(entry.id)}
              >
                <i className={`labStatus ${statusClass(entry)}`} />
                {entry.kind === 'ipc' ? <span className="labMethod">{entry.method}</span> : (
                  <span className="labMethod">{entry.kind}</span>
                )}
                <span className="labPath">{rowTitle(entry)}</span>
                <span className="labMeta">{formatDuration(entry.durationMs)}</span>
              </button>
            ))
          )}
        </Flex>
        <Flex vertical container="fill" className="labDetailPane">
          {selected ? <EntryDetail entry={selected} /> : <Empty description="选择一条请求查看详情" />}
        </Flex>
      </Flex>
    </Flex>
  );
}

function CopyButton({ value, label }: { value: unknown; label?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const title = state === 'copied' ? '已复制' : state === 'failed' ? '复制失败' : (label ?? '复制');

  return (
    <Button
      type="text"
      size="small"
      className={label ? 'labCopyAll' : 'labCopy'}
      title={title}
      aria-label={title}
      icon={state === 'copied' ? <Check size={14} /> : <Copy size={14} />}
      onClick={() => {
        void copyText(toCopyJson(value))
          .then(() => setState('copied'))
          .catch(() => setState('failed'))
          .finally(() => {
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => setState('idle'), 1500);
          });
      }}
    >
      {label}
    </Button>
  );
}

function DetailBlock({ title, value, children }: { title: string; value: unknown; children: ReactNode }) {
  return (
    <dl className="labBlock">
      <dt>
        <span>{title}</span>
        <CopyButton value={value} />
      </dt>
      <dd>{children}</dd>
    </dl>
  );
}

function EntryDetail({ entry }: { entry: TraceEntry }) {
  return (
    <div className="labDetail">
      <div className="labDetailHead">
        {entry.kind === 'ipc' ? <Tag>{entry.method}</Tag> : <Tag>{entry.kind}</Tag>}
        <span className="labPath">{rowTitle(entry)}</span>
        <span className="labMeta">
          {formatDuration(entry.durationMs)} · {formatTime(entry.startedAt)}
        </span>
        <CopyButton value={entry} label="复制全部" />
      </div>
      {entry.streamId ? (
        <DetailBlock title="streamId" value={entry.streamId}>
          <div className="labPre">{entry.streamId}</div>
        </DetailBlock>
      ) : null}
      {entry.conversationId ? (
        <DetailBlock title="conversationId" value={entry.conversationId}>
          <div className="labPre">{entry.conversationId}</div>
        </DetailBlock>
      ) : null}
      {entry.kind === 'ipc' ? (
        <>
          <DetailBlock title="params" value={entry.params}>
            <pre className="labPre">{pretty(entry.params)}</pre>
          </DetailBlock>
          <DetailBlock title="response" value={entry.response}>
            <pre className="labPre">{pretty(entry.response)}</pre>
          </DetailBlock>
        </>
      ) : null}
      {entry.error ? (
        <DetailBlock title="error" value={entry.error}>
          <p className="labError">{entry.error}</p>
        </DetailBlock>
      ) : null}
      {entry.spans.map((span) => (
        <SpanCard key={span.id} span={span} />
      ))}
    </div>
  );
}

function SpanCard({ span }: { span: TraceSpan }) {
  return (
    <div className="labSpan">
      <div className="labSpanHead">
        <span className="labKind">{span.kind}</span>
        <span className="labPath">{span.summary}</span>
        <span className="labMeta">{formatDuration(span.durationMs)}</span>
        <CopyButton value={span} />
      </div>
      {span.error ? <p className="labError">{span.error}</p> : null}
      {span.detail != null ? <pre className="labPre">{pretty(span.detail)}</pre> : null}
    </div>
  );
}
