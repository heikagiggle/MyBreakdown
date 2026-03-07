import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Rant {
  id: string;
  user_id?: string;
  type: 'text' | 'audio';
  content: string;
  stress_score: number;
  created_at: string;
}
