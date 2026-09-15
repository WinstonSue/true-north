# 知止 Desktop

Electron 宿主：主进程装载一等插件，渲染进程通过 IPC 访问 AI、Activity 和插件域。

## 命令

在仓库根目录：

```bash
pnpm install
pnpm dev                 # 开发模式
pnpm dev:product         # 带 ProductWiki 面板
pnpm --filter true-north-desktop typecheck
pnpm --filter true-north-desktop test
pnpm build:desktop
```

打包：

```bash
pnpm --filter true-north-desktop pack-mac
pnpm --filter true-north-desktop pack-win
pnpm --filter true-north-desktop pack-linux
```

## 结构

```
src/
  main/        Electron 主进程入口与 IPC 装配
  preload/     预加载脚本
  plugin/      插件宿主、一等插件清单与加载器
  render/      渲染进程（AI、Workbench、设置、插件壳）
  service/     宿主域（AI、Activity、browser、users）
  config/      Tailwind 等配置
```

一等插件在 `packages/plugins/{growth,expense,purchase,library}`。宿主只从 `src/plugin/desktop-plugins.ts`、`main-loaders.ts` 和 `renderer-loaders.ts` 导入插件包。
