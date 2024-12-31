import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qvqidoggahesznhcwsdh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cWlkb2dnYWhlc3puaGN3c2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NTU0MDEsImV4cCI6MjA1MTIzMTQwMX0.78186mfXjmZiqFeIYbYyOPW2kH9b4omZqRAlcXVRifY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);