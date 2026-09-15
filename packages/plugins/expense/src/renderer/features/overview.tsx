import { ExpensesProvider } from '../pages/context';
import Overview from '../pages/overview';

export default function ExpenseOverviewView() {
  return (
    <ExpensesProvider>
      <Overview />
    </ExpensesProvider>
  );
}
