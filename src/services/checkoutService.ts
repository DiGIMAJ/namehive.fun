
import { supabase } from '@/integrations/supabase/client';

// Interface for the checkout form
export interface CheckoutFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
  country: string;
  postalCode: string;
}

// 2Checkout integration
export const process2CheckoutPayment = async (
  userId: string,
  planType: 'monthly' | 'yearly',
  formData: CheckoutFormData
): Promise<{ success: boolean; error?: string; subscriptionId?: string }> => {
  try {
    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    // Call our edge function to process the payment
    const { data, error } = await supabase.functions.invoke('process-2checkout', {
      body: {
        planType,
        paymentInfo: {
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          nameOnCard: formData.nameOnCard,
          country: formData.country,
          postalCode: formData.postalCode
        }
      }
    });
    
    if (error) {
      console.error('Error calling process-2checkout function:', error);
      throw new Error(error.message || 'Payment processing failed');
    }
    
    if (!data?.success) {
      throw new Error(data?.error || 'Payment processing failed');
    }

    return {
      success: true,
      subscriptionId: data.subscriptionId
    };
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return {
      success: false,
      error: error.message || 'Payment processing failed'
    };
  }
};

// Check if a user has an active subscription
export const checkSubscriptionStatus = async (userId: string): Promise<{
  isActive: boolean;
  planType?: 'monthly' | 'yearly';
  expiresAt?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('plan_type, expires_at, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      return { isActive: false };
    }
    
    return {
      isActive: true,
      planType: data.plan_type as 'monthly' | 'yearly',
      expiresAt: data.expires_at
    };
  } catch (error) {
    console.error('Error checking subscription:', error);
    return { isActive: false };
  }
};

// Get pricing information from config
export const getPricingConfig = async (): Promise<{
  monthlyPrice: number;
  yearlyPrice: number;
}> => {
  try {
    const { data, error } = await supabase
      .from('config')
      .select('monthly_price, yearly_price')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching pricing:', error);
      return { monthlyPrice: 5, yearlyPrice: 50 }; // Default values
    }
    
    return {
      monthlyPrice: Number(data.monthly_price) || 5,
      yearlyPrice: Number(data.yearly_price) || 50
    };
  } catch (error) {
    console.error('Error fetching pricing config:', error);
    return { monthlyPrice: 5, yearlyPrice: 50 }; // Default values
  }
};
