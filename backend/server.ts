import { serve } from "bun";
import app from "./hono";

// Load environment variables from .env file
// Bun automatically loads .env, but we'll verify it's loaded
console.log("📂 Loading environment variables...");
console.log("  EXPO_PUBLIC_SUPABASE_URL:", process.env.EXPO_PUBLIC_SUPABASE_URL ? "✅ Loaded" : "❌ Missing");
console.log("  EXPO_PUBLIC_SUPABASE_ANON_KEY:", process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? "✅ Loaded" : "❌ Missing");

const port = process.env.PORT || 3000;

serve({
  fetch: app.fetch,
  port,
});

console.log(`🚀 Backend server running on http://localhost:${port}`);
