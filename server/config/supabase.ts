import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { log } from "node:console";

const supabaseUrl = process.env.SUPABASE_URL;
console.log(supabaseUrl);

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log(supabaseServiceRoleKey);

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is missing from environment variables");
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is missing from environment variables"
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export default supabase;