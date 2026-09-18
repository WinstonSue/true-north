import { useEffect } from 'react';
import { Drawer } from '@sue/design-web-react';

type GrowthDrawerController = ReturnType<typeof Drawer.useDrawer>[0];
export type GrowthDrawerOptions = Parameters<GrowthDrawerController['open']>[0];
export type GrowthDrawerHandle = ReturnType<GrowthDrawerController['open']>;

let growthDrawerController: GrowthDrawerController | null = null;
let pendingOptions: GrowthDrawerOptions | null = null;

/** Renders growth drawers inside the existing provider tree (theme + RendererPlatform). */
export function GrowthDrawerHost() {
  const [drawer, drawerContextHolder] = Drawer.useDrawer();

  useEffect(() => {
    growthDrawerController = drawer;
    if (pendingOptions) {
      const options = pendingOptions;
      pendingOptions = null;
      drawer.open(options);
    }
    return () => {
      if (growthDrawerController === drawer) {
        growthDrawerController = null;
      }
    };
  }, [drawer]);

  return drawerContextHolder;
}

export function openGrowthDrawer(options: GrowthDrawerOptions): GrowthDrawerHandle {
  if (growthDrawerController) {
    return growthDrawerController.open(options);
  }
  pendingOptions = options;
  return {
    destroy: () => {
      if (pendingOptions === options) pendingOptions = null;
    },
  } as GrowthDrawerHandle;
}
