import type { LocaleContribution } from '@true-north/plugin-sdk';

export const inventoryLocales: LocaleContribution = {
  pluginId: 'inventory',
  messages: {
    'zh-CN': {
      'menu.inventory': '物资',
      'menu.inventory.items': '物资',
      'menu.inventory.locations': '位置',
      'menu.inventory.movements': '出入库',
      'inventory.hub.description': '家庭实物库存、位置与出入库记录',
    },
    'en-US': {
      'menu.inventory': 'Inventory',
      'menu.inventory.items': 'Items',
      'menu.inventory.locations': 'Locations',
      'menu.inventory.movements': 'Movements',
      'inventory.hub.description': 'Household goods, locations, and stock movements',
    },
  },
};
