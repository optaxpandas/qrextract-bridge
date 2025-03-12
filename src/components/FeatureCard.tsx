
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  className?: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  to,
  className,
}) => {
  return (
    <div className={cn("feature-card group", className)}>
      <div className="icon-container group-hover:scale-110 transition-transform">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center mb-6">{description}</p>
      <Link to={to}>
        <Button className="w-full transition-transform group-hover:translate-y-[-4px]">
          Start Now
        </Button>
      </Link>
    </div>
  );
};

export default FeatureCard;
