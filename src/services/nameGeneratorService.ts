
import { supabase } from '@/integrations/supabase/client';

export interface NameGeneratorParams {
  generatorType: string;
  systemPrompt: string;
  userPrompt: string;
  [key: string]: any;
}

export const generateNames = async (params: NameGeneratorParams) => {
  try {
    const { data, error } = await supabase.functions.invoke('groq-name-generator', {
      body: params
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating names:', error);
    throw error;
  }
};
