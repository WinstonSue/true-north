import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CatalogIssue } from '@true-north/plugin-contract';

export function resolvePluginPackageRoot(packageName: string, fromUrl: string): string {
  let dir = fromUrl.startsWith('file:') ? path.dirname(fileURLToPath(fromUrl)) : path.dirname(fromUrl);
  while (true) {
    const pkgFile = path.join(dir, 'package.json');
    if (fs.existsSync(pkgFile)) {
      try {
        const name = JSON.parse(fs.readFileSync(pkgFile, 'utf8')).name;
        if (name === packageName) return dir;
      } catch {
        // keep walking
      }
    }
    const nested = path.join(dir, 'node_modules', packageName, 'package.json');
    if (fs.existsSync(nested)) return path.dirname(fs.realpathSync(nested));
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(`Cannot resolve package root for ${packageName}`);
}

export function resolveSkillRoots(
  packageRoot: string,
  skills: Record<string, { root: string }> | undefined,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(skills || {}).map(([localId, spec]) => [localId, path.resolve(packageRoot, spec.root)]),
  );
}

export function validateSkillRoots(
  pluginId: string,
  skillRoots: Record<string, string>,
): CatalogIssue[] {
  const issues: CatalogIssue[] = [];
  for (const [localId, root] of Object.entries(skillRoots)) {
    const skillFile = path.join(root, 'SKILL.md');
    if (!fs.existsSync(skillFile)) {
      issues.push({
        code: 'reconcile',
        pluginId,
        message: `Plugin ${pluginId} skill "${localId}" is missing SKILL.md at ${skillFile}`,
      });
      continue;
    }
    const body = fs.readFileSync(skillFile, 'utf8');
    if (!body.trim()) {
      issues.push({
        code: 'reconcile',
        pluginId,
        message: `Plugin ${pluginId} skill "${localId}" has an empty SKILL.md`,
      });
    }
  }
  return issues;
}
