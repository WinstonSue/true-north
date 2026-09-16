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
- Manifest contributions cover `ipc`, `views` (Workbench-openable functions), `hub` (plugin hub root), `workbench`, `workflow`, `shell`, and `ai.skills` / `ai.mcp`. There are no `hostCapabilities`, storage entity catalogs, or AI entity types. Plugins self-manage files / SQLite under `PluginSpace.rootDir`; the host does not maintain entity catalogs or shared table schemas.
- Plugin resources are opaque `tn://{pluginId}/{collection}/{id}` URIs. The host stores and forwards URIs; it does not parse goal/task/id.

## SDK

- `@true-north/plugin-sdk` re-exports the contract plus `defineMainImplementation` / `defineRendererImplementation`.
- Implementations return local-key maps (`ipc.todo.controller`, `views.todo.load`, `hub.load`, `ai.mcp.tools.searchGoals.execute`). `materializeMain` / `materializeRenderer` merge static metadata with behavior and fail boot on missing or extra keys.
- Renderer IPC is prefixed with `/{pluginId}` so existing relative controller paths keep working.
- Plugin hub root: `PluginHubProps = { location, navigate }`. The host mounts `handles.hub` and round-trips the query string; it does not pick Features from `views`. Workbench still uses `PluginViewSnapshot = { viewId, params }`, `usePluginViewState(codec)`, and `views.*.load`. Features do not read React Router.

## AI

- The host owns one Agent session, one aggregated `true_north` MCP, stream, audit, and cancel.
- Plugins provide Agent Skills directories (`skills/{id}/SKILL.md`) and MCP tools/resources/prompts. The host namespaces public tool names (`growth.searchGoals`) and mounts skill directories into the conversation workspace as `skills/{pluginId}/{localId}/SKILL.md`. Host-owned skills live under `apps/desktop/skills` and resolve from the desktop package root, not `dist/main`.
- MCP resources may opt into composer mentions with `mention: { labelKey, order? }`. The materializer derives `ai.composer.mention` registrations from the same resource provider; it does not copy domain queries.
- `AGENTS.md` keeps host constraints and a skill index; it does not paste skill bodies. Domain rules live in `SKILL.md` and plugin tools.
- Plugin-initiated AI uses `host.ai.start` with a resource URI, optional skill, and initial message. Conversations store generic attachments, not `refType/refId`. Composer `@` selections persist as message-level `resourceLinks`.

## Host

- `apps/desktop/src/plugin/desktop-plugins.ts` imports `@true-north/plugin-*/manifest`.
- Main and renderer each own an in-process `ExtensionRegistry`. They share typed extension-point tokens, owner lifecycle (`registerBatch` / `unregisterOwner`), and materialize output (`{ issues, registrations }`). Functions and React components are not shared across Electron processes.
- `DesktopPluginHost` publishes host and plugin registrations into the main registry, rolls back a plugin on failure, and clears by owner on dispose. IPC controllers, Workflow commands/events, MCP tools/resources/prompts/skills, agent instructions, and composer mentions are queries against that registry.
- Renderer boot registers plugin catalog, hub roots, workbench views, workspaces, actions, shell slots, locales, scopes, resource openers, workflow interactions, and host actions into the renderer registry. `openResource` and `HostActionPort` are registry-driven.
- Cross-process mention search is an IPC projection: `GET /ai/resources/mentions?query=` reads the main registry and returns URI, name, source id, and label key.
- `PluginStage` mounts `handles.hub` and round-trips opaque query params. `PluginViewFrame` still mounts workbench Features from `views.*.load`. Workbench stores `{ viewId, params }` on a single tab per view and bumps `revision`. `openResource` returns `viewId` for workbench tabs and page-owned keys in `params`.

## First-party plugins

`growth`, `expense`, `inventory`, and `library` are independent packages with `./manifest`, `./main`, and `./renderer` exports. Growth also exports `./contract` for renderer DTO sharing. Plugin ProductWiki files live under `packages/plugins/{id}/wiki` and are catalogued by `@true-north/product-wiki`; they are not package exports. AI session, Workbench, and Workflow remain host platforms.

Growth exposes a plugin page root with in-page todo/task/habit/goal navigation, workbench views for those functions, goal/task decompose skills, and namespaced MCP tools/resources. Expense uses a plugin `ViewScope` so Workbench tabs get isolated providers; the expense page root shares one provider across its own tabs.

## Deferred

Disk discovery/install/update, package signatures, permission UI, utility-process/iframe sandbox, per-plugin MCP servers, and SDK `./host` packaging.
