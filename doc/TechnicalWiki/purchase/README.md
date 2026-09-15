# Purchase 技术域

家庭采购清单，替换原先不符合产品语义的 ERP 演示路由。状态：待购 / 已购 / 取消。已购可关联一条记账交易。

## 代码落点

```
packages/business/enum/purchase/
packages/business/vo/purchase/
packages/plugins/purchase/src/client/purchase.ts
packages/plugins/purchase/src/main/service/
packages/plugins/purchase/src/renderer/
packages/plugins/purchase/src/renderer/features/list.tsx
```

第一版只做清单与购买记录，不扩展供应商、库存或进销存。页面入口为 `/plugins/purchase`。
