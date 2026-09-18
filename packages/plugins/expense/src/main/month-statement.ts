import dayjs from 'dayjs';

export function statementMonthOf(now = new Date()): string {
  const date = dayjs(now);
  const today = date.format('YYYY-MM-DD');
  const last = date.endOf('month').format('YYYY-MM-DD');
  if (today >= last) return date.format('YYYY-MM');
  return date.subtract(1, 'month').format('YYYY-MM');
}

export function monthStatementTitle(month: string): string {
  return dayjs(`${month}-01`).format('YYYY年M月账单');
}

export function monthStatementBody(income: number, expense: number): string {
  return `收入 ${income.toFixed(2)} · 支出 ${expense.toFixed(2)}`;
}

export function isInMonth(value: Date | string, month: string): boolean {
  return dayjs(value).format('YYYY-MM') === month;
}
