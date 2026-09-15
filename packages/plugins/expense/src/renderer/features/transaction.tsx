import { ExpensesProvider } from '../pages/context';
import Transactions from '../pages/transaction';

export default function ExpenseTransactionView() {
  return (
    <ExpensesProvider>
      <Transactions />
    </ExpensesProvider>
  );
}
