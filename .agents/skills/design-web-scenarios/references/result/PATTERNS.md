# Result 结果状态实现协议

## 状态选型

- `success`：流程完成、提交成功、配置生效。
- `error`：操作失败但用户仍可修改、重试或联系支持。
- `warning`：操作风险、前置条件不完整、需要用户确认后继续。
- `info`：中性说明、处理中断、无需强调成败的状态反馈。
- `403`：已识别用户无权访问目标内容。
- `404`：入口、资源或链接不存在。
- `500`：关键数据或服务不可用，当前场景无法继续。

## 403 / 404 / 500 边界

- 未识别用户交给认证入口处理，不展示 403。
- 详情接口返回资源不存在时，用 404 状态回到资源集合或上层上下文。
- 单个卡片或表格失败时优先局部错误；关键内容不可用才进入 500。
- 返回上层上下文前要避免再次进入同一个 404 或 403 状态。

## 动作协议

- 每个结果状态至少提供一个可执行主动作。
- 成功状态优先提供继续业务动作，不只提供关闭。
- 失败和 500 的重试函数由调用方传入，状态展示层不猜测业务请求。
- 权限申请、支持链接、切换账号等动作必须来自项目配置或业务上下文。

## 详情区

- 成功详情可展示业务摘要、单号、下一步提示。
- 失败详情可展示可修复错误项，不展示内部异常堆栈。
- 500 详情可展示 trace id，并提供复制或联系支持入口。
- 权限详情可展示缺少角色或权限点，但不要泄露不可见资源的敏感信息。

## React recipe

不要导入不存在的 `Result`。用 `Flex` + 状态图标/插画 + 标题 + 动作区组合。Vue 与 React 结构相同，React 从 `@sue/design-web-react` 导入：

```tsx
<Flex vertical align="center" gap="middle" style={{ padding: 48 }}>
  <Alert type="success" showIcon message={title} description={subTitle} />
  <Space>
    <Button type="primary" onClick={onPrimary}>
      {primaryLabel}
    </Button>
    <Button onClick={onSecondary}>{secondaryLabel}</Button>
  </Space>
</Flex>
```
