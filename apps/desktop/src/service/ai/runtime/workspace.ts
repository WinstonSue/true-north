import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { app } from 'electron';
import { listAgentTools } from '../agent/tools';
import { allSkillRoots, getAgentInstructions } from '../extension-queries';
import { buildCodexSessionConfig } from './codex-config';

export function buildAgentsMd(): string {
  const tools = listAgentTools();
  const names = tools.map((tool) => tool.name).join('、');
  const domain = getAgentInstructions();
  const skills = allSkillRoots();
  const skillIndex = skills
    .flatMap(({ pluginId, roots }) =>
      Object.keys(roots).map((localId) => `- ${pluginId}/${localId} → skills/${pluginId}/${localId}/SKILL.md`),
    )
    .join('\n');
  return `你是 True North 个人规划助手。${names ? `通过 MCP 工具完成领域读写：${names}。` : ''}

${domain}

可用 Skills（按需阅读对应 SKILL.md，不要把全部技能正文一次读完）：
${skillIndex || '- 无'}

约束：
- 不要创建目标、任务、待办、习惯、支出、采购或收藏；创建由用户在工作台采纳完成。
- 需要领域数据时调用插件 MCP tools/resources；不要猜测实体目录。
- 用简洁中文回复，不要在对话里输出建议 JSON 列表。
`;
}

export function runtimeRootDir(): string {
  return path.join(app.getPath('userData'), 'ai-runtime');
}

export function conversationWorkspaceDir(conversationId: string): string {
  return path.join(runtimeRootDir(), 'workspaces', conversationId);
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

export function writeSharedWorkspace(workspaceDir: string) {
  ensureDir(workspaceDir);
  const body = buildAgentsMd();
  fs.writeFileSync(path.join(workspaceDir, 'AGENTS.md'), body, 'utf8');
  const skills = allSkillRoots();
  for (const { pluginId, roots } of skills) {
    for (const [localId, root] of Object.entries(roots)) {
      const dest = path.join(workspaceDir, 'skills', pluginId, localId);
      fs.cpSync(root, dest, { recursive: true });
    }
  }
  try {
    spawnSync('git', ['init'], { cwd: workspaceDir, stdio: 'ignore', timeout: 5_000 });
  } catch {
    // isolated dir is not required to be a git repo
  }
  return body;
}

export function prepareClaudeWorkspace(workspaceDir: string): string {
  const body = writeSharedWorkspace(workspaceDir);
  fs.writeFileSync(path.join(workspaceDir, 'CLAUDE.md'), body, 'utf8');
  return workspaceDir;
}

export function prepareCursorWorkspace(workspaceDir: string): string {
  writeSharedWorkspace(workspaceDir);
  return workspaceDir;
}

export function prepareCodexWorkspace(workspaceDir: string, mcpUrl: string): string {
  writeSharedWorkspace(workspaceDir);
  const codexHome = path.join(workspaceDir, '.codex');
  ensureDir(codexHome);

  const userCodexHome = path.join(os.homedir(), '.codex');
  let userConfig = '';
  try {
    userConfig = fs.readFileSync(path.join(userCodexHome, 'config.toml'), 'utf8');
  } catch {
    userConfig = '';
  }
  fs.writeFileSync(path.join(codexHome, 'config.toml'), buildCodexSessionConfig(userConfig, mcpUrl), 'utf8');

  const fromAuth = path.join(userCodexHome, 'auth.json');
  const toAuth = path.join(codexHome, 'auth.json');
  if (fs.existsSync(fromAuth) && !fs.existsSync(toAuth)) {
    try {
      fs.symlinkSync(fromAuth, toAuth);
    } catch {
      try {
        fs.copyFileSync(fromAuth, toAuth);
      } catch {
        // probe/login still uses the user home
      }
    }
  }

  return codexHome;
}
