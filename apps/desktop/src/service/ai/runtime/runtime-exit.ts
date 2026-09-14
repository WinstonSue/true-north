export function unexpectedRuntimeFailure(exitCode: number | null, stderr: string): string | null {
  if (exitCode === 0) return null;
  const detail = stderr.trim().slice(0, 400);
  if (exitCode == null) return detail || '编码 Agent 异常结束';
  return detail || '编码 Agent 退出异常';
}
