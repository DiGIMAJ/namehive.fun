
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getRemainingUsage, USAGE_LIMITS, getUserTier } from '@/services/usageTracker';

interface UsageLimitProps {
  showUpgradeButton?: boolean;
}

const UsageLimit = ({ showUpgradeButton = true }: UsageLimitProps) => {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [userTier, setUserTier] = useState<'anonymous' | 'free' | 'premium'>('anonymous');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsageData = async () => {
      try {
        const [remainingCount, tier] = await Promise.all([
          getRemainingUsage(),
          getUserTier()
        ]);
        
        setRemaining(remainingCount);
        setUserTier(tier);
      } catch (error) {
        console.error('Error loading usage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsageData();
  }, []);

  if (loading) {
    return <div className="h-6"></div>; // Empty space while loading
  }

  // Get the maximum allowed based on tier
  const getMaxUsage = () => {
    switch (userTier) {
      case 'premium':
        return USAGE_LIMITS.PREMIUM;
      case 'free':
        return USAGE_LIMITS.FREE_USER;
      case 'anonymous':
      default:
        return USAGE_LIMITS.ANONYMOUS;
    }
  };

  const max = getMaxUsage();
  const current = Math.max(0, (max - (remaining || 0)));
  const percentUsed = (current / max) * 100;
  
  const isLow = remaining !== null && remaining <= Math.max(1, Math.floor(max * 0.2));
  const isNearLimit = percentUsed >= 75;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="font-medium mr-2">
            {userTier === 'premium' ? 'Premium' : `${remaining} generations left today`}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {userTier === 'premium'
                    ? 'You have unlimited generations with Premium'
                    : userTier === 'free'
                    ? `Free users get ${USAGE_LIMITS.FREE_USER} generations per day`
                    : `Anonymous users get ${USAGE_LIMITS.ANONYMOUS} generations per day`}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {userTier !== 'premium' && showUpgradeButton && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 border-purple-200 text-purple-700 hover:bg-purple-50"
            asChild
          >
            <Link to="/pricing">Upgrade</Link>
          </Button>
        )}
      </div>
      
      {userTier !== 'premium' && (
        <>
          <Progress value={percentUsed} className="h-2" />
          
          {isLow && (
            <div className="flex items-center mt-2 text-amber-600 text-sm">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span>
                {remaining === 0 
                  ? 'You\'ve reached your daily limit. Upgrade for more.' 
                  : `You're running low on generations today.`}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UsageLimit;
