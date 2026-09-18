# Plugin Platform

```yaml
document_meta:
  status: 'active'
  last_updated: '2026-09-17'
```

The plugin kernel is a serializable API 0 contract plus instance-owned hosts. Built-in plugins load in-process today. Manifests never contain functions.

## Contribution layers

These rules are the SSOT for how plugin surfaces relate to objects and the workbench.

1. **`resources` are addressable objects**, not a page catalog. Declare `uriTemplate` and optional `mention` only. Do not put `nameKey` or `load` on a resource. The host must not enumerate resources as Hub columns or as the workbench plus menu.
2. **`hub` is the default human entry** for feature pages. The host mounts `handles.hub` and round-trips the query string. The plugin owns in-page columns. Hub location keys such as `?view=` are plugin-private, not contribution ids.
3. **`workbench.newTabs` are optional workbench pages.** Each entry has its own `nameKey` and `handles.workbench.newTabs[id].load`. Do not mirror Hub columns into newTabs.
4. **`workbench.workspaces` are session interactions** (suggest todo, decompose). Creating a record from AI stays on the workspace surface; it does not drive Hub drawers.
5. **Opening a resource always routes to Hub.** `openResource(uri)` returns `{ pluginId, location }`. Composer `@`, message resource chips, and notifications use the same opener. Workbench does not mount the feature page.
6. **`ai.mcp` only delivers `tools` and `prompts`.** The same top-level `resources` are projected into the aggregated `true_north` MCP for the model to read.

## Contract

- `@true-north/plugin-contract` is the JSON-safe schema. Each plugin keeps a single `src/manifest.ts` as the static SSOT; `package.json` only holds npm metadata and exports.
- `PLUGIN_API_VERSION` is the number `0`. Schema default-fills `apiVersion`; plugin manifests do not repeat it.
- Contribution map keys are local ids. Host helpers derive global ids, IPC roots, MCP names, and resource URIs: `contributionKey`, `ipcRoute`, `mcpName`, `pluginResourceUri`.
- Manifest contributions cover `ipc`, `resources` (URI objects), `hub` (plugin hub root), `workbench` (workspaces / actions / newTabs), `workflow`, `shell`, and `ai.skills` / `ai.mcp` (`tools` / `prompts`). There are no `views`, `hostCapabilities`, storage entity catalogs, or AI entity types. Plugins self-manage files / SQLite under `PluginSpace.rootDir`.
- Plugin resources are opaque `tn://{pluginId}/{collection}/{id}` URIs. The host stores and forwards URIs; it does not parse goal/task/id.

## SDK

- `@true-north/plugin-sdk` re-exports the contract plus `defineMainImplementation` / `defineRendererImplementation`.
- Implementations return local-key maps (`ipc.todo.controller`, `resources.goal` provider, `hub.load`, `ai.mcp.tools.searchGoals.execute`, optional `workbench.newTabs.capture.load`). `materializeMain` / `materializeRenderer` merge static metadata with behavior and fail boot on missing or extra keys.
- Renderer IPC is prefixed with `/{pluginId}` so existing relative controller paths keep working.
- Plugin hub root: `PluginHubProps = { location, navigate }`. Hub pages may still use `PluginViewRuntimeProvider` / `usePluginViewState` for column URL state. That is not a public `views` contribution. Features do not read React Router.

## AI

- The host owns one Agent session, one aggregated `true_north` MCP, stream, audit, and cancel.
- Plugins provide Agent Skills directories (`skills/{id}/SKILL.md`) and MCP tools/prompts. The host namespaces public tool names (`growth.searchGoals`) and mounts skill directories into the conversation workspace as `skills/{pluginId}/{localId}/SKILL.md`. Host-owned skills live under `apps/desktop/skills` and resolve from the desktop package root, not `dist/main`.
- Top-level resources may opt into composer mentions with `mention: { labelKey, order? }`. The materializer derives `ai.composer.mention` registrations from the same resource provider and projects the provider into MCP. It does not copy domain queries.
- `AGENTS.md` keeps host constraints and a skill index; it does not paste skill bodies. Domain rules live in `SKILL.md` and plugin tools.
- Plugin-initiated AI uses `host.ai.start` with a resource URI, optional skill, and initial message. Conversations store generic attachments, not `refType/refId`. Composer `@` selections persist as message-level `resourceLinks`. Clicking a resource navigates to Hub.

## Host

- `apps/desktop/src/plugin/desktop-plugins.ts` imports `@true-north/plugin-*/manifest`.
- Main and renderer each own an in-process `ExtensionRegistry`. They share typed extension-point tokens, owner lifecycle (`registerBatch` / `unregisterOwner`), and materialize output (`{ issues, registrations }`). Functions and React components are not shared across Electron processes.
- `DesktopPluginHost` publishes host and plugin registrations into the main registry, rolls back a plugin on failure, and clears by owner on dispose. IPC controllers, Workflow commands/events, MCP tools/resources/prompts/skills, agent instructions, and composer mentions are queries against that registry.
- Renderer boot registers plugin catalog, hub roots, workspaces, newTabs, actions, shell slots, locales, scopes, resource openers, workflow interactions, and host actions into the renderer registry. `openResource` and `HostActionPort` are registry-driven.
- Cross-process mention search is an IPC projection: `GET /ai/resources/mentions?query=` reads the main registry and returns URI, name, source id, and label key.
- `PluginStage` mounts `handles.hub` and round-trips opaque query params. Workbench plus/home only lists `newTabs`. `openResource` returns `{ pluginId, location }` and the host navigates to that Hub href.

## First-party plugins

`growth`, `expense`, `inventory`, and `library` are independent packages with `./manifest`, `./main`, and `./renderer` exports. Growth also exports `./contract` for renderer DTO sharing. Plugin ProductWiki files live under `packages/plugins/{id}/wiki` and are catalogued by `@true-north/product-wiki`; they are not package exports. AI session, Workbench, and Workflow remain host platforms.

Growth Hub owns todo/task/habit/goal/notify columns. Addressable resources are `goal`, `task`, and `todo`. Expense Hub owns transaction/budget/overview; only `transaction` is a resource. Inventory Hub owns items/locations/movements; resources are `item`, `location`, and `movement`. Library Hub is search; the resource is `bookmark`.

## Deferred

Disk discovery/install/update, package signatures, permission UI, utility-process/iframe sandbox, per-plugin MCP servers, and SDK `./host` packaging.
