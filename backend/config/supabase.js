import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Supabase environment variables are missing!");
  process.exit(1);
}

// Initialize the Supabase Client for Backend
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log("Supabase Connected Successfully! ⚡");