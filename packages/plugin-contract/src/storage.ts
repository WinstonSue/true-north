/**
 * 插件私有数据空间。插件在 {@link PluginSpace.rootDir} 自管文件 / SQLite，
 * 宿主不暴露实体目录或共享表结构。
 */
export type PluginSpace = {
  pluginId: string;
  /** 该插件私有数据根目录。 */
  rootDir: string;
  /** 迁移用的旧共享库路径，新插件不要依赖。 */
  legacySharedDbPath?: string;
};
