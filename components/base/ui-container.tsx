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
    <div className={cx('relative flex flex-col shadow-lg bg-white rounded-2xl min-w-[500px]', className)}>
      <div className="relative h-15 flex items-center justify-between px-2 border-b">
        <p className="text-sm text-muted-foreground pl-5 overflow-hidden text-ellipsis">{title}</p>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <CloseIcon className="size-4 text-muted-foreground hover:text-foreground" />
          </Button>
        )}
        </div>
        <div className="flex-1 p-4">{children}</div>
      </div>
    </motion.div>
  );
}
