
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

interface PaymentBody {
  planType: 'monthly' | 'yearly';
  paymentInfo: {
    cardNumber: string;
    expiryDate: string;
    nameOnCard: string;
    country: string;
    postalCode: string;
  };
}

serve(async (req) => {
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      // Supabase API URL - env var exposed by default
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exposed by default
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the session of the authenticated user
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    
    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { headers: { 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Parse request body
    const { planType, paymentInfo } = await req.json() as PaymentBody;
    
    if (!planType || !paymentInfo) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid request data' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get 2Checkout credentials from secrets
    const sellerId = Deno.env.get('TWOCHECKOUT_SELLER_ID');
    const secretKey = Deno.env.get('TWOCHECKOUT_SECRET_KEY');
    
    if (!sellerId || !secretKey) {
      console.error('2Checkout credentials not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Payment gateway misconfigured' }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Get pricing from config
    const { data: configData } = await supabaseClient
      .from('config')
      .select('monthly_price, yearly_price')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    const amount = planType === 'monthly' 
      ? configData?.monthly_price || 5.00 
      : configData?.yearly_price || 50.00;

    // In a real implementation, we would validate and process the payment with 2Checkout's API
    // For this demo, we'll simulate a successful payment
    
    // Here we'd make an API call to 2Checkout
    // This is just simulated for the purposes of the demo
    
    // Create subscription in our database
    const subscriptionId = `sub_${Date.now()}`;
    const expiresAt = new Date();
    
    if (planType === 'monthly') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }
    
    // Insert into subscriptions table
    const { error: insertError } = await supabaseClient
      .from('subscriptions')
      .insert({
        id: subscriptionId,
        user_id: session.user.id,
        plan_type: planType,
        status: 'active',
        amount: amount,
        currency: 'USD',
        starts_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        payment_provider: '2checkout',
        payment_details: {
          last4: paymentInfo.cardNumber.slice(-4),
          country: paymentInfo.country,
          transaction_id: `tx_${Date.now()}`
        }
      });
    
    if (insertError) {
      console.error('Error creating subscription:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create subscription' }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment processed successfully',
        subscriptionId
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing payment:', error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
