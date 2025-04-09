import { SupabaseClient } from "@supabase/supabase-js";

// Define a generic Database type that will be replaced by the actual Database type
interface Database {}

export const supabase: SupabaseClient<Database>;
