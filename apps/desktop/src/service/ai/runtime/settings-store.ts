import { createRequire } from 'node:module';
import fs from 'fs';
import path from 'path';
import {
  agentSettingsOf,
  emptySettings,
  parseLegacySelection,
  parseRuntimeSettings,
  type RuntimeSettingsRecord,
} from './settings-schema.ts';
import { RUNTIME_AGENT_IDS } from './registry.ts';

const SETTINGS_FILE = 'ai-runtime-settings.json';
const LEGACY_SELECTION_FILE = 'ai-runtime-selection.json';

let dataDirOverride: string | undefined;

export function setRuntimeDataDir(dir?: string) {
  dataDirOverride = dir;
}

function userDataDir(): string {
  if (dataDirOverride) return dataDirOverride;
  const require = createRequire(import.meta.url);
  const electron = require('electron') as { app?: { getPath?: (name: string) => string } };
  const dir = electron.app?.getPath?.('userData');
  if (!dir) throw new Error('runtime data dir not configured');
  return dir;
}

function settingsPath(): string {
  return path.join(userDataDir(), SETTINGS_FILE);
}

function legacySelectionPath(): string {
  return path.join(userDataDir(), LEGACY_SELECTION_FILE);
}

function readJson(file: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as unknown;
  } catch {
    return undefined;
  }
}

function persist(settings: RuntimeSettingsRecord): RuntimeSettingsRecord {
  fs.writeFileSync(settingsPath(), `${JSON.stringify(settings, null, 2)}\n`, 'utf8');
  return settings;
}

export function readRuntimeSettings(): RuntimeSettingsRecord {
  const existing = readJson(settingsPath());
  if (existing !== undefined) {
    return parseRuntimeSettings(existing, RUNTIME_AGENT_IDS);
  }
  const migrated = emptySettings();
  migrated.defaultRuntimeId = parseLegacySelection(readJson(legacySelectionPath()));
  return persist(parseRuntimeSettings(migrated, RUNTIME_AGENT_IDS));
}

export function writeRuntimeSettings(settings: RuntimeSettingsRecord): RuntimeSettingsRecord {
  return persist(parseRuntimeSettings(settings, RUNTIME_AGENT_IDS));
}

export function readRuntimeId(): string | null {
  return readRuntimeSettings().defaultRuntimeId;
}

export function writeRuntimeId(runtimeId: string | null): string | null {
  const current = readRuntimeSettings();
  current.defaultRuntimeId = runtimeId && runtimeId.trim() ? runtimeId.trim() : null;
  return writeRuntimeSettings(current).defaultRuntimeId;
}

export function readAgentSettings(id: string) {
  return agentSettingsOf(readRuntimeSettings(), id);
}
