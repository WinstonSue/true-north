import { ExpensesProvider } from '../pages/context';
import Budgets from '../pages/budget';

export default function ExpenseBudgetView() {
  return (
    <ExpensesProvider>
      <Budgets />
    </ExpensesProvider>
  );
}
