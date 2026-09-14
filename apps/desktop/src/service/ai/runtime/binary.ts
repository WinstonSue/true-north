import fs from 'fs';
import os from 'os';
import path from 'path';

const resolvedPathCache = new Map<string, string>();

export function extraSearchDirs(adapterDirs: string[] = []): string[] {
  const home = os.homedir();
  const dirs = [
    '/usr/local/bin',
    '/opt/homebrew/bin',
    '/Applications/ChatGPT.app/Contents/Resources',
    path.join(home, 'Applications', 'ChatGPT.app', 'Contents', 'Resources'),
    '/Applications/Codex.app/Contents/Resources',
    path.join(home, 'Applications', 'Codex.app', 'Contents', 'Resources'),
    path.join(home, '.local', 'bin'),
    path.join(home, '.npm-global', 'bin'),
    path.join(home, '.cursor', 'bin'),
    path.join(home, '.codex', 'bin'),
    ...adapterDirs,
  ];
  if (process.platform === 'win32') {
    const localApp = process.env.LOCALAPPDATA;
    const roaming = process.env.APPDATA;
    if (localApp) {
      dirs.push(path.join(localApp, 'Programs', 'cursor'));
      dirs.push(path.join(localApp, 'cursor'));
    }
    if (roaming) {
      dirs.push(path.join(roaming, 'npm'));
      dirs.push(path.join(roaming, 'npm', 'bin'));
    }
    dirs.push(path.join(home, 'AppData', 'Roaming', 'npm'));
    dirs.push('C:\\Program Files\\nodejs');
    dirs.push('C:\\Program Files\\Git\\usr\\bin');
  }
  return dirs;
}

function pathDirs(adapterDirs: string[] = []): string[] {
  const fromEnv = (process.env.PATH || '')
    .split(path.delimiter)
    .map((item) => item.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const dir of [...fromEnv, ...extraSearchDirs(adapterDirs)]) {
    const normalized = path.resolve(dir);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    ordered.push(normalized);
  }
  return ordered;
}

function candidateNames(bin: string): string[] {
  if (process.platform !== 'win32') return [bin];
  if (path.extname(bin)) return [bin];
  return [`${bin}.exe`, `${bin}.cmd`, bin];
}

export function isRunnable(file: string): boolean {
  try {
    const stat = fs.statSync(file);
    if (!stat.isFile()) return false;
    fs.accessSync(file, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

export function resolveOverridePath(override: string): string | undefined {
  if (!path.isAbsolute(override)) return undefined;
  return isRunnable(override) ? override : undefined;
}

export function resolveBinary(binaries: string[], adapterDirs: string[] = []): string | undefined {
  const cacheKey = `${binaries.join('|')}::${adapterDirs.join('|')}`;
  const cached = resolvedPathCache.get(cacheKey);
  if (cached && isRunnable(cached)) return cached;

  for (const dir of pathDirs(adapterDirs)) {
    for (const bin of binaries) {
      for (const name of candidateNames(bin)) {
        const candidate = path.join(dir, name);
        if (isRunnable(candidate)) {
          resolvedPathCache.set(cacheKey, candidate);
          return candidate;
        }
      }
    }
  }
  return undefined;
}

export function clearBinaryCache() {
  resolvedPathCache.clear();
}
