
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://inygbyqptgrxngrmmpbv.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlueWdieXFwdGdyeG5ncm1tcGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNjk4NjcsImV4cCI6MjA5NDY0NTg2N30.NqKtXPoXF-ayREJMylrC_fX531uSawD3e0tvNBCymUM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);
