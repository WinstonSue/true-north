# Plugin Platform

```yaml
document_meta:
  status: 'active'
  last_updated: '2026-09-15'
```

The plugin kernel is a serializable API 0 contract plus instance-owned hosts. Built-in plugins load in-process today. Manifests never contain functions.

## Contract

- `@true-north/plugin-contract` is the JSON-safe schema. Each plugin keeps a single `src/manifest.ts` as the static SSOT; `package.json` only holds npm metadata and exports.
- `PLUGIN_API_VERSION` is the number `0`. Schema default-fills `apiVersion`; plugin manifests do not repeat it.
- Contribution map keys are local ids. Host helpers derive global ids, IPC roots, MCP names, and resource URIs: `contributionKey`, `ipcRoute`, `mcpName`, `pluginResourceUri`.
- Manifest contributions cover `ipc`, `views`, `workbench`, `activity`, `storage`, `shell`, and `ai.skills` / `ai.mcp`. There are no `hostCapabilities`, storage entity catalogs, or AI entity types.
- Plugin resources are opaque `tn://{pluginId}/{collection}/{id}` URIs. The host stores and forwards URIs; it does not parse goal/task/id.

## SDK

- `@true-north/plugin-sdk` re-exports the contract plus `defineMainImplementation` / `defineRendererImplementation`.
- Implementations return local-key maps (`ipc.todo.controller`, `views.todo.load`, `ai.mcp.tools.searchGoals.execute`). `materializeMain` / `materializeRenderer` merge static metadata with behavior and fail boot on missing or extra keys.
- Renderer IPC is prefixed with `/{pluginId}` so existing relative controller paths keep working.
- Shared view runtime: `PluginViewSnapshot = { viewId, params }`, `usePluginViewState(codec)`, plus page and Workbench adapters. Features do not read React Router.

## AI

- The host owns one Agent session, one aggregated `true_north` MCP, stream, audit, and cancel.
- Plugins provide Agent Skills directories (`skills/{id}/SKILL.md`) and MCP tools/resources/prompts. The host namespaces public tool names (`growth.searchGoals`) and mounts skill directories into the conversation workspace.
- `AGENTS.md` keeps host constraints and a skill index; it does not paste skill bodies. Domain rules live in `SKILL.md` and plugin tools.
- Plugin-initiated AI uses `host.ai.start` with a resource URI, optional skill, and initial message. Conversations store generic attachments, not `refType/refId`.

## Host

- `apps/desktop/src/plugin/desktop-plugins.ts` imports `@true-north/plugin-*/manifest`.
- `DesktopPluginHost` materializes main handles, registers IPC by derived route prefixes, and publishes a `PluginAiRegistry` plus `AgentToolRegistry`.
- Renderer boot materializes views, workspaces, actions, shell slots, scopes, and `openResource`. There is no plugin-root `load` or entity presenter catalog.
- `PluginViewFrame` mounts the same Feature on the plugin page and in Workbench. The page adapter writes `?view={localView}&...params`; Workbench stores the same snapshot on a single tab per view and bumps `revision`.

## First-party plugins

`growth`, `expense`, `purchase`, and `library` are independent packages with `./manifest`, `./contract`, `./main`, `./renderer`, and `./wiki` exports. AI session, Workbench, and Activity remain host platforms.

Growth exposes todo/task/habit/goal views, goal/task decompose skills, and namespaced MCP tools/resources. Expense uses a plugin `ViewScope` so its three views share one provider on the plugin page and get isolated scopes in Workbench.

## Deferred

Disk discovery/install/update, package signatures, permission UI, utility-process/iframe sandbox, per-plugin MCP servers, and SDK `./host` packaging.
