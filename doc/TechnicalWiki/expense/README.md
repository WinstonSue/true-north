# Expense 技术域

记账数据与成长平级，页面从 `/plugins/expense` 进入。渲染层复用原交易 / 预算 / 总览页面与 VO，主进程为 TypeORM + SQLite。

## 代码落点

```
packages/business/vo/expense/
packages/plugins/expense/src/client/expense.ts
packages/plugins/expense/src/main/service/           # Transaction / Budget Entity、Service、IPC
packages/plugins/expense/src/renderer/   # 页面仍通过 ExpenseController 读写
```

创建交易后发出 `transactionBooked` 领域事件。物资入库与记账是独立事实，不再通过采购结算入账。
