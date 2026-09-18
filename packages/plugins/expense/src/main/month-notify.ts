import { expenseService } from './service/expense.service';
import { postMonthStatement } from './context';
import { isInMonth, monthStatementBody, monthStatementTitle, statementMonthOf } from './month-statement';

export async function syncExpenseMonthStatement(now = new Date()) {
  const month = statementMonthOf(now);
  let list;
  try {
    list = await expenseService.listTransactions();
  } catch {
    return;
  }
  let income = 0;
  let expense = 0;
  for (const item of list) {
    if (!isInMonth(item.transactionDateTime, month)) continue;
    if (item.type === 'income') income += item.amount;
    else expense += item.amount;
  }
  await postMonthStatement({
    month,
    title: monthStatementTitle(month),
    body: monthStatementBody(income, expense),
  });
}
