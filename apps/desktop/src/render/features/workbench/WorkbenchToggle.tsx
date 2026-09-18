import { AppWindow } from 'lucide-react';
import { Tooltip } from '@sue/design-web-react';
import { useWorkbenchOptional } from './context';
import useLocale from '@/utils/useLocale';

export function WorkbenchToggle({ className }: { className?: string }) {
  const t = useLocale();
  const workbench = useWorkbenchOptional();
  if (!workbench || !window.electronAPI?.isElectron) return null;
  const title = workbench.open ? t['navbar.workbench.close'] : t['navbar.workbench.open'];
  return (
    <Tooltip title={title} placement="bottom">
      <button type="button" className={className} aria-label={title} onClick={workbench.toggle}>
        <AppWindow size={16} />
      </button>
    </Tooltip>
  );
}
