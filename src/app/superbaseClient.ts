
import { createClient } from '@supabase/supabase-js';

// Safe fallbacks to pass Next.js compilation phases without crashing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://eaijetrksvyiwoqorrvr.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaWpldHJrc3Z5aXdvcW9ycnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyODQ0NTAsImV4cCI6MjA5NDg2MDQ1MH0.wOdZP6Auvsu93CROqLlS7NdtHeaj2vBJzvbEUP0WLYk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);
