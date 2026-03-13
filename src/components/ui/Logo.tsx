import React from 'react';
import { cn } from '../../lib/utils';

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    // No extra props needed for now
}

const Logo: React.FC<LogoProps> = ({ className, ...props }) => {
  return (
    <img 
      src="https://ik.imagekit.io/0fheaxmfc/Main%20Logo.png?updatedAt=1754492000386" 
      alt="Aesthetics360 Logo" 
      className={cn("h-8 w-auto", className)}
      {...props}
    />
  );
};

export default Logo;
