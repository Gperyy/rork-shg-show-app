import { initTRPC } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { Context as HonoContext } from "hono"; // Import Hono Context

export const createContext = async (
  opts: FetchCreateContextFnOptions,
  c?: HonoContext
) => {
  // Vercel edge runtime uses process.env, not c.env (which is for Cloudflare Workers)
  const env = (process.env || {}) as Record<string, string>;

  console.log("🔧 createContext called:", {
    hasHonoContext: !!c,
    hasProcessEnv: !!process.env,
    envKeys: Object.keys(env),
    hasSupabaseUrl: !!env.EXPO_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    supabaseUrlPreview: env.EXPO_PUBLIC_SUPABASE_URL ? env.EXPO_PUBLIC_SUPABASE_URL.substring(0, 30) + "..." : "undefined"
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
