
import React from 'react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-lg">Q</span>
      </div>
      <span className="font-semibold text-xl tracking-tight">QRExtract</span>
    </div>
  );
};

export default Logo;
