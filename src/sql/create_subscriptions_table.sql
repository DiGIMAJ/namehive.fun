
-- This file is for reference only and should be executed via the Supabase SQL editor

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_provider TEXT NOT NULL,
  payment_details JSONB
);

-- Add RLS policy for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create generator_usage table for tracking usage
CREATE TABLE IF NOT EXISTS public.generator_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  generator_type TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  is_premium BOOLEAN DEFAULT false
);

-- Add RLS policy for generator_usage
ALTER TABLE public.generator_usage ENABLE ROW LEVEL SECURITY;

-- Users can read their own usage
CREATE POLICY "Users can view their own usage"
  ON public.generator_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own usage records
CREATE POLICY "Users can insert their own usage"
  ON public.generator_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster usage queries
CREATE INDEX idx_generator_usage_user_date
  ON public.generator_usage (user_id, date);
