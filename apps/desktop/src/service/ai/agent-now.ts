function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatAgentNow(now = new Date()): string {
  return `当前时间：${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}（本地）`;
}

export function agentClockBlock(now = new Date()): string {
  return `${formatAgentNow(now)}。填写计划日期时必须用这个日期推算年份；用户没说年份时不要用训练数据里的年份。`;
}

export function withAgentClockPrefix(prompt: string, now = new Date()): string {
  const body = prompt.trim();
  const block = agentClockBlock(now);
  return body ? `${block}\n\n${body}` : block;
}
