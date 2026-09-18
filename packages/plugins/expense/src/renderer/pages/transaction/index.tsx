import TransactionTable from './TransactionTable';
import { TransactionFilters } from './TransactionFilters';
import { Button, Flex } from '@sue/design-web-react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { usePluginRuntime } from '@true-north/plugin-sdk/renderer';
import { Plus } from 'lucide-react';
import { useExpenses } from '../context';
import { useCreateTransaction } from './CreateTransaction';
import { FilterBar } from '@true-north/plugin-ui';

export default function Transactions() {
  const { locale } = usePluginRuntime();
  const { addTransaction } = useExpenses();
  const { openCreateModal } = useCreateTransaction({
    onConfirm: (values) => {
      addTransaction(values);
    },
  });
  return (
    <ProductSurface id={productRef('expense.view.transaction')}>
      <Flex vertical container="full">
        <FilterBar
          extra={
            <Button type="primary" icon={<Plus size={14} />} onClick={() => openCreateModal()}>
              {locale.t('expense.transaction.create')}
            </Button>
          }
        >
          <TransactionFilters />
        </FilterBar>
        <Flex container="fill" className="px-5 pb-4">
          <TransactionTable />
        </Flex>
      </Flex>
    </ProductSurface>
  );
}
