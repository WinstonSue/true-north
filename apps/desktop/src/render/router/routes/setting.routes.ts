import { Bot, Palette } from 'lucide-react';
import { IRoute } from '@/router/routes';

export const settingRoutes: IRoute[] = [
  {
    name: 'setting.appearance',
    key: '/setting/appearance',
    loader: () => import('@/features/setting/appearance'),
    meta: { icon: Palette },
  },
  {
    name: 'setting.agents',
    key: '/setting/local-agents',
    loader: () => import('@/features/setting/local-agents'),
    meta: { icon: Bot },
  },
];
