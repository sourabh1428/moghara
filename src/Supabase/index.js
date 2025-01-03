// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and API key
const supabaseUrl = import.meta.env.VITE_supabaseUrl;
const supabaseKey = import.meta.env.VITE_supabaseKey

export const supabase = createClient(supabaseUrl, supabaseKey);