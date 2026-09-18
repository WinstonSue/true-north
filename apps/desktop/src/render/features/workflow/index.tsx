import { useLocation } from 'react-router-dom';
import { TabsPage } from '@true-north/plugin-ui';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { DefinitionEditor } from './DefinitionEditor';
import { DefinitionList } from './DefinitionList';
import { AssociationList } from './AssociationList';
import { RunList } from './RunList';
import { IssuesPage } from './IssuesPage';
import { EventTimeline } from '@/plugin/EventTimeline';
import useLocale from '@/utils/useLocale';

export default function WorkflowPage() {
  const location = useLocation();
  const t = useLocale();
  if (location.pathname.startsWith('/workflow/definitions/')) {
    return <DefinitionEditor />;
  }
  const tab = new URLSearchParams(location.search).get('tab') || 'definitions';
  return (
    <ProductSurface id={productRef('workflow.view.page')}>
      <TabsPage
        tabs={[
          { name: t['workflow.tab.definitions'] || '定义', href: '/workflow?tab=definitions', active: tab === 'definitions' },
          { name: t['workflow.tab.associations'] || '关联', href: '/workflow?tab=associations', active: tab === 'associations' },
          { name: t['workflow.tab.runs'] || '运行', href: '/workflow?tab=runs', active: tab === 'runs' },
          { name: t['workflow.tab.issues'] || '问题', href: '/workflow?tab=issues', active: tab === 'issues' },
          { name: t['workflow.tab.events'] || '事件', href: '/workflow?tab=events', active: tab === 'events' },
        ]}
      >
        {tab === 'associations' ? <AssociationList /> : null}
        {tab === 'runs' ? <RunList /> : null}
        {tab === 'issues' ? <IssuesPage /> : null}
        {tab === 'events' ? <EventTimeline embedded /> : null}
        {tab === 'definitions' ? <DefinitionList /> : null}
      </TabsPage>
    </ProductSurface>
  );
}
