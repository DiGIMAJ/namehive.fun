
-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up Row Level Security
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for favorites
CREATE POLICY "Users can view their own favorites" 
  ON public.favorites FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" 
  ON public.favorites FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites" 
  ON public.favorites FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
  ON public.favorites FOR DELETE 
  USING (auth.uid() = user_id);

-- This script should be run in the Supabase SQL Editor
