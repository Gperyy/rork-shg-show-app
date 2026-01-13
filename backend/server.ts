import { serve } from "bun";
import app from "./hono";

const port = process.env.PORT || 3000;

serve({
  fetch: app.fetch,
  port,
});

console.log(`🚀 Backend server running on http://localhost:${port}`);
