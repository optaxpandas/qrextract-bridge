
import React from 'react';
import { cn } from '@/lib/utils';
import { Scan, QrCode } from 'lucide-react';

type LogoProps = {
  className?: string;
};

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-10 h-10 bg-gradient-to-br from-primary to-violet-700 rounded-lg flex items-center justify-center shadow-md">
        <div className="relative">
          <Scan className="text-primary-foreground w-6 h-6 absolute top-0 left-0 opacity-60" />
          <QrCode className="text-primary-foreground w-6 h-6" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600">Scanlytic</span>
        <span className="text-xs text-muted-foreground tracking-wider">INTELLIGENT SCANNING</span>
      </div>
    </div>
  );
};

export default Logo;
