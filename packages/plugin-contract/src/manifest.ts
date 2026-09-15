import { z } from 'zod';
import { PLUGIN_API_VERSION, SHELL_SLOT_IDS, contributionKey } from './ids.ts';
import { todaySectionDescriptorSchema, type TodaySectionDescriptor } from './today.ts';

/** 只声明贡献存在；行为由 main / renderer 按同名 local id 实现。 */
export type DeclaredContribution = Record<string, never>;

export const emptyContributionSchema = z.object({}).strict();

export type ShellSlotContribution = {
  /** 挂到哪个宿主槽位，见 {@link SHELL_SLOT_IDS}。 */
  slot: (typeof SHELL_SLOT_IDS)[number];
  /** 同槽位内排序，越小越靠前。 */
  order?: number;
};

export const shellSlotContributionSchema = z.object({
  /** 挂到哪个宿主槽位，见 {@link SHELL_SLOT_IDS}。 */
  slot: z.enum(SHELL_SLOT_IDS),
  /** 同槽位内排序，越小越靠前。 */
  order: z.number().optional(),
});

export type ViewContribution = {
  /** Workbench 标签 / 加号菜单文案 i18n key。 */
  nameKey: string;
  /** 同插件内加号菜单排序，越小越靠前。 */
  order?: number;
};

export const viewContributionSchema = z.object({
  /** Workbench 标签 / 加号菜单文案 i18n key。 */
  nameKey: z.string().min(1),
  /** 同插件内加号菜单排序，越小越靠前。 */
  order: z.number().optional(),
});

export type SkillContribution = {
  /**
   * Agent Skill 目录，相对插件包根，内含 `SKILL.md`。
   * 宿主把它挂进会话工作区，不把 skill 正文写入 `AGENTS.md`。
   */
  root: string;
};

export const skillContributionSchema = z.object({
  /**
   * Agent Skill 目录，相对插件包根，内含 `SKILL.md`。
   * 宿主把它挂进会话工作区，不把 skill 正文写入 `AGENTS.md`。
   */
  root: z.string().min(1),
});

export type McpToolContribution = {
  /** 只读工具可并行调用；缺省视为会改数据。 */
  readOnly?: boolean;
};

export const mcpToolContributionSchema = z.object({
  /** 只读工具可并行调用；缺省视为会改数据。 */
  readOnly: z.boolean().optional(),
});

export type McpResourceMention = {
  /** 作曲器 `@` 菜单分组标签 i18n key。 */
  labelKey: string;
  /** 提及分组排序，越小越靠前。 */
  order?: number;
};

export const mcpResourceMentionSchema = z.object({
  /** 作曲器 `@` 菜单分组标签 i18n key。 */
  labelKey: z.string().min(1),
  /** 提及分组排序，越小越靠前。 */
  order: z.number().optional(),
});

export type McpResourceContribution = {
  /**
   * MCP 资源 URI 模板，如 `tn://growth/goals/{id}`。
   * 跨插件必须唯一。宿主按 URI 转发，不解析 goal/task 等业务含义。
   */
  uriTemplate: string;
  /**
   * 出现则同时注册作曲器 `@` 提及。
   * materializer 用同一 resource provider 做搜索，不另写领域查询。
   */
  mention?: McpResourceMention;
};

export const mcpResourceContributionSchema = z.object({
  /**
   * MCP 资源 URI 模板，如 `tn://growth/goals/{id}`。
   * 跨插件必须唯一。宿主按 URI 转发，不解析 goal/task 等业务含义。
   */
  uriTemplate: z.string().min(1),
  /**
   * 出现则同时注册作曲器 `@` 提及。
   * materializer 用同一 resource provider 做搜索，不另写领域查询。
   */
  mention: mcpResourceMentionSchema.optional(),
});

export type PluginContributions = {
  /**
   * Main 进程 IPC 控制器。key 为 local id，路由为 `/{pluginId}/{localId}`。
   * 实现必须提供同名 `handles.ipc`。
   */
  ipc?: Record<string, DeclaredContribution>;
  /**
   * Workbench 可打开的功能。全局 id 为 `{pluginId}.{localId}`。
   * 只给加号菜单与功能标签用；插件页栏目由 `page` 自己导航。
   * 实现必须提供同名 `handles.views`。
   */
  views?: Record<string, ViewContribution>;
  /**
   * Workbench：会话内工作区与一次性动作。
   * - `workspaces`：AI 消息可打开的工具面板（如目标拆解）
   * - `actions`：工作台触发的副作用（如从网页抽取书签）
   */
  workbench?: {
    workspaces?: Record<string, DeclaredContribution>;
    actions?: Record<string, DeclaredContribution>;
  };
  /**
   * Activity 平台扩展。
   * - `captureTypes`：AI 捕获建议的采纳类型，全局 id `{pluginId}.{localId}`
   * - `today`：今日页区块，描述符见 `todaySectionDescriptorSchema`
   */
  activity?: {
    captureTypes?: Record<string, DeclaredContribution>;
    today?: Record<string, TodaySectionDescriptor>;
  };
  /**
   * 向宿主壳层插入 React 节点。key 为 slot 实例 local id；
   * `slot` 指定挂载点，实现必须提供同名 `handles.shell.slots`。
   */
  shell?: {
    slots?: Record<string, ShellSlotContribution>;
  };
  /**
   * AI 贡献。宿主只有一个 Agent 会话和一个聚合 MCP `true_north`。
   * - `skills`：Skill 目录；实现用 `handles.ai.skillRoots`
   * - `mcp.tools` / `resources` / `prompts`：并入宿主 MCP，对外名 `{pluginId}.{localId}`
   */
  ai?: {
    skills?: Record<string, SkillContribution>;
    mcp?: {
      tools?: Record<string, McpToolContribution>;
      resources?: Record<string, McpResourceContribution>;
      prompts?: Record<string, DeclaredContribution>;
    };
  };
  /**
   * 插件页根。声明 `{}` 即要求实现 `handles.page.load`。
   * 宿主只挂这个根，不按 views 拼页内栏目。
   */
  page?: DeclaredContribution;
};

export const pluginContributionsSchema = z.object({
  /**
   * Main 进程 IPC 控制器。key 为 local id，路由为 `/{pluginId}/{localId}`。
   * 实现必须提供同名 `handles.ipc`。
   */
  ipc: z.record(z.string().min(1), emptyContributionSchema).optional(),
  /**
   * Workbench 可打开的功能。全局 id 为 `{pluginId}.{localId}`。
   * 只给加号菜单与功能标签用；插件页栏目由 `page` 自己导航。
   * 实现必须提供同名 `handles.views`。
   */
  views: z.record(z.string().min(1), viewContributionSchema).optional(),
  /**
   * Workbench：会话内工作区与一次性动作。
   * - `workspaces`：AI 消息可打开的工具面板
   * - `actions`：工作台触发的副作用
   */
  workbench: z
    .object({
      workspaces: z.record(z.string().min(1), emptyContributionSchema).optional(),
      actions: z.record(z.string().min(1), emptyContributionSchema).optional(),
    })
    .optional(),
  /**
   * Activity 平台扩展。
   * - `captureTypes`：AI 捕获建议的采纳类型
   * - `today`：今日页区块
   */
  activity: z
    .object({
      captureTypes: z.record(z.string().min(1), emptyContributionSchema).optional(),
      today: z.record(z.string().min(1), todaySectionDescriptorSchema).optional(),
    })
    .optional(),
  /**
   * 向宿主壳层插入 React 节点。key 为 slot 实例 local id；
   * `slot` 指定挂载点，实现必须提供同名 `handles.shell.slots`。
   */
  shell: z
    .object({
      slots: z.record(z.string().min(1), shellSlotContributionSchema).optional(),
    })
    .optional(),
  /**
   * AI 贡献。宿主只有一个 Agent 会话和一个聚合 MCP `true_north`。
   * - `skills`：Skill 目录；实现用 `handles.ai.skillRoots`
   * - `mcp.tools` / `resources` / `prompts`：并入宿主 MCP
   */
  ai: z
    .object({
      skills: z.record(z.string().min(1), skillContributionSchema).optional(),
      mcp: z
        .object({
          tools: z.record(z.string().min(1), mcpToolContributionSchema).optional(),
          resources: z.record(z.string().min(1), mcpResourceContributionSchema).optional(),
          prompts: z.record(z.string().min(1), emptyContributionSchema).optional(),
        })
        .optional(),
    })
    .optional(),
  /**
   * 插件页根。声明 `{}` 即要求实现 `handles.page.load`。
   * 宿主只挂这个根，不按 views 拼页内栏目。
   */
  page: emptyContributionSchema.optional(),
});

export type PluginCatalogMeta = {
  /** 插件目录 / 侧栏显示名 i18n key。 */
  nameKey: string;
  /** 插件简介 i18n key。 */
  descriptionKey?: string;
  /** 目录分类 i18n key，如内置插件。 */
  categoryKey?: string;
  /** 搜索关键词，可中英混排。 */
  keywords?: string[];
  /** 插件目录排序，越小越靠前。 */
  order?: number;
};

export const pluginCatalogMetaSchema = z.object({
  /** 插件目录 / 侧栏显示名 i18n key。 */
  nameKey: z.string().min(1),
  /** 插件简介 i18n key。 */
  descriptionKey: z.string().min(1).optional(),
  /** 目录分类 i18n key，如内置插件。 */
  categoryKey: z.string().min(1).optional(),
  /** 搜索关键词，可中英混排。 */
  keywords: z.array(z.string()).optional(),
  /** 插件目录排序，越小越靠前。 */
  order: z.number().optional(),
});

/**
 * 插件清单：可 JSON 序列化的 API 0 契约，不含函数。
 * 每个插件一份 `src/manifest.ts` 作为静态 SSOT；`package.json` 只放 npm 元数据。
 * 贡献 map 的 key 一律是插件内 local id，全局 id / 路由 / MCP 名由宿主 helper 派生。
 */
export type PluginManifestInput = {
  /**
   * 插件唯一 id。小写字母开头，仅 `[a-z0-9-]`。
   * 用于派生路径、IPC、贡献 id、MCP 名、资源 URI。
   */
  pluginId: string;
  /**
   * 清单协议版本。可省略，schema 默认填 {@link PLUGIN_API_VERSION}。
   */
  apiVersion?: typeof PLUGIN_API_VERSION;
  /** 插件自身 semver，通常来自 `package.json`。 */
  version: string;
  /** 必须先激活的其它 `pluginId`。宿主按拓扑序启动，反向序销毁。 */
  dependencies?: string[];
  /** 插件目录展示信息，不含实现。 */
  catalog: PluginCatalogMeta;
  /** 向宿主声明的扩展点。缺省为 `{}`。声明的 key 必须在对应进程实现，多了或少了都会启动失败。 */
  contributions?: PluginContributions;
};

export const pluginManifestSchema = z.object({
  /**
   * 插件唯一 id。小写字母开头，仅 `[a-z0-9-]`。
   * 用于派生路径、IPC、贡献 id、MCP 名、资源 URI。
   */
  pluginId: z.string().min(1).regex(/^[a-z][a-z0-9-]*$/),
  /** 清单协议版本。可省略，schema 默认填 {@link PLUGIN_API_VERSION}。 */
  apiVersion: z.literal(PLUGIN_API_VERSION).default(PLUGIN_API_VERSION),
  /** 插件自身 semver，通常来自 `package.json`。 */
  version: z.string().min(1),
  /** 必须先激活的其它 `pluginId`。宿主按拓扑序启动，反向序销毁。 */
  dependencies: z.array(z.string().min(1)).optional(),
  /** 插件目录展示信息，不含实现。 */
  catalog: pluginCatalogMetaSchema,
  /** 向宿主声明的扩展点。缺省为 `{}`。声明的 key 必须在对应进程实现。 */
  contributions: pluginContributionsSchema.default({}),
});

export type PluginManifest = z.infer<typeof pluginManifestSchema>;

/** 定义插件清单；校验形状并默认填入 `apiVersion`。 */
export function definePluginManifest<const M extends PluginManifestInput>(
  manifest: M,
): M & { apiVersion: typeof PLUGIN_API_VERSION } {
  return pluginManifestSchema.parse(manifest) as M & { apiVersion: typeof PLUGIN_API_VERSION };
}

/** 从未知 JSON 解析清单。 */
export function parsePluginManifest(input: unknown): PluginManifest {
  return pluginManifestSchema.parse(input);
}

/** 由清单与 local id 得到全局贡献 id `{pluginId}.{localId}`。 */
export function derivedContributionId(manifest: PluginManifest, localId: string): string {
  return contributionKey(manifest.pluginId, localId);
}
