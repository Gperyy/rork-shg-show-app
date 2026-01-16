import { initTRPC } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { Context as HonoContext } from "hono"; // Import Hono Context

export const createContext = async (
  opts: FetchCreateContextFnOptions,
  c?: HonoContext
) => {
  const env = (c?.env || {}) as Record<string, string>;

  console.log("🔧 createContext called:", {
    hasHonoContext: !!c,
    hasEnv: !!c?.env,
    envKeys: Object.keys(env),
    hasSupabaseUrl: !!env.EXPO_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!env.EXPO_PUBLIC_SUPABASE_ANON_KEY
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
