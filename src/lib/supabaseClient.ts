import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config';

// These credentials are safe to be exposed in a browser environment.
// Supabase uses Row Level Security (RLS) to protect your data.
const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required in config.ts.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
