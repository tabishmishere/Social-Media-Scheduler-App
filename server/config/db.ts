import supabase from "./supabase.js";

const connectDB = async () => {
    // Supabase handles stateless HTTP connections automatically.
    // This helper verifies basic configuration environment variables.
    if (!process.env.SUPABASE_URL || (!process.env.SUPABASE_ANON_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY)) {
        console.warn("⚠️ SUPABASE_URL or SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY is not set in environment variables.");
        return;
    }
};

export default connectDB;