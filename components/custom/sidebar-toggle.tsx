import { ComponentProps } from 'react';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function SidebarToggle({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  return (
    <Tooltip>
      <SidebarTrigger
        className={cn(
          'size-10 md:size-8 [&>svg]:!size-5 md:[&>svg]:!size-4',
          className
        )}
      />
    </Tooltip>
  );
}
