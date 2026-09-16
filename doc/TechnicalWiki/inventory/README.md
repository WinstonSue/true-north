# 物资（Inventory）

家庭实物库存：物资主档、存放位置、位置库存与不可变的入库/出库/盘点记录。

包：`packages/plugins/inventory`
VO / 枚举：`packages/business/{vo,enum}/inventory`

页面入口为 `/plugins/inventory`，栏目为物资、位置、出入库。资源 URI 为 `tn://inventory/items/{id}`、`locations/{id}`、`movements/{id}`。

工作流命令：`createItem`、`recordInbound`、`recordOutbound`、`adjustStock`。数量变更在同一插件事务内更新 balance 并追加 movement；出库后不能小于零。补货量由下限和目标量派生，不建立采购单。

旧 Purchase 包不再加载，本地 `plugin-data/purchase` 不迁移、不清理。
