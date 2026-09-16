import type { PluginHubProps } from '@true-north/plugin-sdk';
import { usePluginRuntime } from '@true-north/plugin-sdk/renderer';
import { TabsPage } from '@true-north/plugin-ui';
import { ExpensesProvider } from '../pages/context';
import TransactionFeature from '../features/transaction';
import BudgetFeature from '../features/budget';
import OverviewFeature from '../features/overview';

const TABS = [
  { key: 'transaction', nameKey: 'menu.expense.transaction' },
  { key: 'budget', nameKey: 'menu.expense.budget' },
  { key: 'overview', nameKey: 'menu.expense.overview' },
] as const;

const FEATURES = {
  transaction: TransactionFeature,
  budget: BudgetFeature,
  overview: OverviewFeature,
};

export default function ExpensePage(props: PluginHubProps) {
  const { locale } = usePluginRuntime();
  const view = TABS.some((tab) => tab.key === props.location.view)
    ? (props.location.view as (typeof TABS)[number]['key'])
    : 'transaction';
  const Feature = FEATURES[view];

  return (
    <ExpensesProvider>
      <TabsPage
        tabs={TABS.map((tab) => ({
          key: tab.key,
          name: locale.t(tab.nameKey),
          active: tab.key === view,
        }))}
        onSelect={(tab) => props.navigate({ view: tab.key || 'transaction' })}
      >
        <Feature />
      </TabsPage>
    </ExpensesProvider>
  );
}
