import type { PluginHubProps } from '@true-north/plugin-sdk';
import { usePluginRuntime } from '@true-north/plugin-sdk/renderer';
import { TabsPage } from '@true-north/plugin-ui';
import ItemsFeature from '../features/items';
import LocationsFeature from '../features/locations';
import MovementsFeature from '../features/movements';

const TABS = [
  { key: 'items', nameKey: 'menu.inventory.items' },
  { key: 'locations', nameKey: 'menu.inventory.locations' },
  { key: 'movements', nameKey: 'menu.inventory.movements' },
] as const;

const FEATURES = {
  items: ItemsFeature,
  locations: LocationsFeature,
  movements: MovementsFeature,
};

export default function InventoryPage(props: PluginHubProps) {
  const { locale } = usePluginRuntime();
  const view = TABS.some((tab) => tab.key === props.location.view)
    ? (props.location.view as (typeof TABS)[number]['key'])
    : 'items';
  const Feature = FEATURES[view];

  return (
    <TabsPage
      tabs={TABS.map((tab) => ({
        key: tab.key,
        name: locale.t(tab.nameKey),
        active: tab.key === view,
      }))}
      onSelect={(tab) => props.navigate({ view: tab.key || 'items' })}
    >
      <Feature />
    </TabsPage>
  );
}
