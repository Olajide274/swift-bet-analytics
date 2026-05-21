import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// This client handles standard signup, logins, and public table queries safely
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
