
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ icon: Icon, title, description, className }: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        "card-gradient border border-purple-100/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100 group",
        className
      )}
    >
      <div className="size-12 flex items-center justify-center bg-purple-100 rounded-xl text-purple-600 mb-4 transition-all duration-300 group-hover:bg-purple-500 group-hover:text-white">
        <Icon className="size-6" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
