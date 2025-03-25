
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'light';
}

const Logo = ({ className, variant = 'default' }: LogoProps) => {
  // Determine text color based on variant
  const textColorClass = variant === 'light' 
    ? 'text-white' 
    : 'bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800';
  
  // Determine circle background color based on variant
  const circleBgClass = variant === 'light'
    ? 'bg-white/90' 
    : 'bg-purple-500';
  
  // Determine letter color based on variant
  const letterColorClass = variant === 'light'
    ? 'text-purple-600'
    : 'text-white';
  
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className={`relative size-9 rounded-full ${circleBgClass} flex items-center justify-center`}>
        <span className={`absolute font-extrabold text-lg ${letterColorClass}`}>N</span>
      </div>
      <span className={`text-xl font-bold ${textColorClass}`}>
        Name Hive
      </span>
    </Link>
  );
};

export default Logo;
