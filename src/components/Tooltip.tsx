import React, { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  return (
    <div className="relative flex items-center group">
      {children}
      <div className="absolute top-1/2 -translate-y-1/2 right-full mr-2 w-64 p-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
