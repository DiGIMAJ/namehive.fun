
import { supabase } from '@/integrations/supabase/client';

// Define usage limits per user type
export const USAGE_LIMITS = {
  ANONYMOUS: 3,
  FREE_USER: 15,
  PREMIUM: 750, // Soft cap for premium users
};

// Store anonymous user ID in localStorage
const getAnonymousId = (): string => {
  let anonymousId = localStorage.getItem('anonymous_user_id');
  
  if (!anonymousId) {
    anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('anonymous_user_id', anonymousId);
  }
  
  return anonymousId;
};

// Track usage for both anonymous and registered users
export const trackUsage = async (generatorType: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    const isAuthenticated = !!userId;
    
    // Get the current date in YYYY-MM-DD format for daily tracking
    const today = new Date().toISOString().split('T')[0];
    
    if (isAuthenticated) {
      // Registered user - check their subscription status and track in Supabase
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', userId)
        .maybeSingle() as any; // Type assertion
      
      const isPremium = subscriptionData?.status === 'active';
      
      if (isPremium) {
        // Premium users still log usage but don't get restricted
        await supabase.from('generator_usage').insert({
          user_id: userId,
          generator_type: generatorType,
          date: today,
          is_premium: true
        } as any); // Type assertion
        
        return true;
      } else {
        // Free registered user - check usage against limit
        const { data: usageData, error } = await supabase
          .from('generator_usage')
          .select('id')
          .eq('user_id', userId)
          .eq('date', today) as any; // Type assertion
          
        if (error) throw error;
        
        const currentUsage = usageData?.length || 0;
        
        if (currentUsage >= USAGE_LIMITS.FREE_USER) {
          return false; // Limit reached
        }
        
        // Track this usage
        await supabase.from('generator_usage').insert({
          user_id: userId,
          generator_type: generatorType,
          date: today,
          is_premium: false
        } as any); // Type assertion
        
        return true;
      }
    } else {
      // Anonymous user - check and track in localStorage
      const anonymousId = getAnonymousId();
      const storageKey = `generator_usage_${today}`;
      
      const usageData = JSON.parse(localStorage.getItem(storageKey) || '{}');
      const userUsage = usageData[anonymousId] || 0;
      
      if (userUsage >= USAGE_LIMITS.ANONYMOUS) {
        return false; // Limit reached
      }
      
      // Track this usage
      usageData[anonymousId] = userUsage + 1;
      localStorage.setItem(storageKey, JSON.stringify(usageData));
      
      return true;
    }
  } catch (error) {
    console.error('Error tracking usage:', error);
    // In case of error, allow the generation
    return true;
  }
};

// Get the remaining usage count for the current user
export const getRemainingUsage = async (): Promise<number> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    const isAuthenticated = !!userId;
    
    const today = new Date().toISOString().split('T')[0];
    
    if (isAuthenticated) {
      // Check if user is premium
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', userId)
        .maybeSingle() as any; // Type assertion
      
      const isPremium = subscriptionData?.status === 'active';
      
      if (isPremium) {
        return USAGE_LIMITS.PREMIUM; // Just return the max for premium users
      }
      
      // Get usage count for free registered user
      const { data: usageData } = await supabase
        .from('generator_usage')
        .select('id')
        .eq('user_id', userId)
        .eq('date', today) as any; // Type assertion
        
      const currentUsage = usageData?.length || 0;
      return Math.max(0, USAGE_LIMITS.FREE_USER - currentUsage);
    } else {
      // Get usage count for anonymous user
      const anonymousId = getAnonymousId();
      const storageKey = `generator_usage_${today}`;
      
      const usageData = JSON.parse(localStorage.getItem(storageKey) || '{}');
      const userUsage = usageData[anonymousId] || 0;
      
      return Math.max(0, USAGE_LIMITS.ANONYMOUS - userUsage);
    }
  } catch (error) {
    console.error('Error getting remaining usage:', error);
    // In case of error, return a default value
    return 0;
  }
};

// Get the user's current tier
export const getUserTier = async (): Promise<'anonymous' | 'free' | 'premium'> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return 'anonymous';
    }
    
    const { data: subscriptionData } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', session.user.id)
      .maybeSingle() as any; // Type assertion
    
    return subscriptionData?.status === 'active' ? 'premium' : 'free';
  } catch (error) {
    console.error('Error getting user tier:', error);
    return 'anonymous';
  }
};
