'use client';

import { X as CloseIcon } from 'lucide-react';
import { Button } from '../ui/button';
import cx from 'classnames';
import { motion } from 'framer-motion';
interface UIContainerProps {
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
  title: string;
}

export function UIContainer({ children, onClose, className, title }: UIContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.2 }}
    >
      <div className={cx('relative flex flex-col shadow-lg bg-white rounded-2xl w-full min-w-[500px] max-w-[calc(70vw-200px)] max-h-[calc(100vh-100px)]', className)}>
        <div className="h-15 flex items-center justify-between px-2 border-b flex-row">
          <p className="text-sm text-muted-foreground pl-5 overflow-auto text-ellipsis flex-1">{title}</p>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={onClose}
            >
              <CloseIcon className="size-4 text-muted-foreground" />
            </Button>
          )}
        </div>
        <div className="flex flex-1 p-4 min-h-0 w-full overflow-auto">{children}</div>
      </div>
    </motion.div>
  );
}
