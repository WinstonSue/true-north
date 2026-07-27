import { Button, ButtonProps } from '@sue/design-web-react';
import SiteIcon from '@/components/SiteIcon';

export function CreateButton({ ...props }: ButtonProps) {
  return (
    <Button {...props} type={props.type ?? 'primary'}>
      <div className="flex items-center gap-2">
        <SiteIcon id="add" width={14} height={14} />
        {props.children}
      </div>
    </Button>
  );
}
