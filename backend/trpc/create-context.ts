import { initTRPC } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { Context as HonoContext } from "hono"; // Import Hono Context

export const createContext = async (
  opts: FetchCreateContextFnOptions,
  c?: HonoContext
) => {
  // Vercel edge runtime uses process.env, not c.env (which is for Cloudflare Workers)
  // Extract environment variables explicitly to avoid issues with process.env's special object type
  const env: Record<string, string> = {
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
  };

  console.log("🔧 createContext called:", {
    hasHonoContext: !!c,
    hasProcessEnv: !!process.env,
    processEnvKeys: Object.keys(process.env || {}),
    extractedEnv: env,
    hasSupabaseUrl: !!env.EXPO_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  });

  return {
    req: opts.req,
    env,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
