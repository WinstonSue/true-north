import type { RuntimeAgentManagementVo, RuntimeAgentVo } from '@true-north/vo';
import { clearBinaryCache, resolveBinary, resolveOverridePath } from './binary';
import { resolveDefaultRuntimeId } from './preferred-agent';
import { readAgentSettings, readRuntimeSettings } from './settings-store';
import { listAdapters } from './adapters';
import type { RuntimeAdapter } from './adapters/types';
import type { RuntimeProbeResult } from './types';

const probeCache = new Map<string, RuntimeProbeResult>();

function cacheKey(adapter: RuntimeAdapter, enabled: boolean, pathOverride: string | null): string {
  return `${adapter.id}|${enabled ? '1' : '0'}|${pathOverride || ''}`;
}

export function invalidateProbeCache() {
  probeCache.clear();
  clearBinaryCache();
}

export function toRuntimeAgentVo(result: RuntimeProbeResult): RuntimeAgentVo {
  return {
    id: result.id,
    name: result.name,
    available: result.available,
    authenticated: result.authenticated,
    unavailableReason: result.unavailableReason,
  };
}

export function toRuntimeAgentManagementVo(
  result: RuntimeProbeResult,
  defaultRuntimeId: string | null
): RuntimeAgentManagementVo {
  return {
    id: result.id,
    name: result.name,
    enabled: result.enabled,
    available: result.available,
    authenticated: result.authenticated,
    version: result.version,
    resolvedPath: result.resolvedPath,
    autoDetectedPath: result.autoDetectedPath,
    pathOverride: result.pathOverride,
    unavailableReason: result.unavailableReason,
    isDefault: defaultRuntimeId === result.id,
  };
}

async function probeAdapter(adapter: RuntimeAdapter): Promise<RuntimeProbeResult> {
  const settings = readAgentSettings(adapter.id);
  const key = cacheKey(adapter, settings.enabled, settings.pathOverride);
  const cached = probeCache.get(key);
  if (cached) return cached;

  const extraDirs = adapter.extraSearchDirs?.() || [];
  const autoDetectedPath = resolveBinary(adapter.binaries, extraDirs);
  let resolvedPath: string | undefined;
  let unavailableReason: string | undefined;

  if (settings.pathOverride) {
    resolvedPath = resolveOverridePath(settings.pathOverride);
    if (!resolvedPath) {
      unavailableReason = '覆盖路径无效';
    }
  } else {
    resolvedPath = autoDetectedPath;
    if (!resolvedPath) unavailableReason = adapter.unavailableInstallReason();
  }

  let authenticated = false;
  let version: string | undefined;
  if (resolvedPath) {
    try {
      version = (await adapter.probeVersion?.(resolvedPath)) || undefined;
    } catch {
      version = undefined;
    }
    try {
      authenticated = await adapter.probeAuth(resolvedPath);
    } catch {
      authenticated = false;
    }
    if (!authenticated && !unavailableReason) unavailableReason = '未登录';
  }

  const available = Boolean(settings.enabled && resolvedPath && authenticated);
  const result: RuntimeProbeResult = {
    id: adapter.id,
    name: adapter.name,
    enabled: settings.enabled,
    available,
    authenticated,
    version,
    resolvedPath,
    autoDetectedPath,
    pathOverride: settings.pathOverride,
    unavailableReason: settings.enabled
      ? unavailableReason
      : unavailableReason || '已在设置中关闭',
  };
  if (!settings.enabled) {
    result.available = false;
    result.unavailableReason = '已在设置中关闭';
  }
  probeCache.set(key, result);
  return result;
}

export async function probeAllAgents(): Promise<RuntimeProbeResult[]> {
  return Promise.all(listAdapters().map((adapter) => probeAdapter(adapter)));
}

export function currentDefaultRuntimeId(): string {
  return resolveDefaultRuntimeId(readRuntimeSettings().defaultRuntimeId);
}
