
import { supabase } from '@/integrations/supabase/client';

// For development/POC purposes
export const createSubscription = async (
  userId: string,
  planType: 'monthly' | 'yearly',
  paymentInfo: any
): Promise<{ success: boolean; error?: string; subscriptionId?: string }> => {
  try {
    // In a real implementation, this would call the 2Checkout API
    // For now, we'll just simulate it by adding to our subscriptions table
    
    const subscriptionId = `sub_${Date.now()}`;
    const expiresAt = new Date();
    
    if (planType === 'monthly') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }
    
    // Insert into subscriptions table
    const { error } = await supabase
      .from('subscriptions')
      .insert({
        id: subscriptionId,
        user_id: userId,
        plan_type: planType,
        status: 'active',
        amount: planType === 'monthly' ? 5 : 50,
        currency: 'USD',
        starts_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        payment_provider: '2checkout',
        payment_details: paymentInfo
      } as any); // Type assertion to bypass type checking
    
    if (error) throw error;
    
    return {
      success: true,
      subscriptionId
    };
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return {
      success: false,
      error: error.message || 'Failed to create subscription'
    };
  }
};

// Cancel subscription
export const cancelSubscription = async (
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Find active subscription for user
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle() as any; // Type assertion
    
    if (fetchError) throw fetchError;
    if (!subscription) {
      return {
        success: false,
        error: 'No active subscription found'
      };
    }
    
    // Update status to cancelled
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' } as any)
      .eq('id', subscription.id) as any; // Type assertion
    
    if (updateError) throw updateError;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    return {
      success: false,
      error: error.message || 'Failed to cancel subscription'
    };
  }
};

// Check if user has active subscription
export const hasActiveSubscription = async (
  userId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle() as any; // Type assertion
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
};
