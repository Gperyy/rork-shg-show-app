import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

app.use("*", cors());

app.use(
  "/api/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext: (opts, c) => createContext(opts, c),
  }),
);

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

// Debug endpoint to check environment variables
app.get("/api/debug/env", (c) => {
  const allEnvKeys = Object.keys(process.env || {});
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  return c.json({
    message: "Environment Variables Debug Info",
    timestamp: new Date().toISOString(),
    supabaseConfig: {
      hasUrl: !!supabaseUrl && supabaseUrl !== "",
      hasKey: !!supabaseKey && supabaseKey !== "",
      urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : "NOT SET",
      keyValue: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : "NOT SET",
    },
    allEnvKeys: allEnvKeys,
    expoPublicVars: allEnvKeys.filter(key => key.startsWith("EXPO_PUBLIC_")),
    vercelEnv: process.env.VERCEL_ENV || "unknown",
  });
});

export default app;
