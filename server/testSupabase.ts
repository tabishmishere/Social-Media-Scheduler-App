import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log("URL:", url);
console.log("Service key loaded:", !!key);

const supabase = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const { data, error } = await supabase
  .from("users")
  .select("id, email")
  .limit(1);

console.log("DATA:", data);
console.log("ERROR:", error);