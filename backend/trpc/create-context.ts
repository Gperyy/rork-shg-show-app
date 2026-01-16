import { initTRPC } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { Context as HonoContext } from "hono"; // Import Hono Context

export const createContext = async (
  opts: FetchCreateContextFnOptions,
  c?: HonoContext
) => {
  return {
    req: opts.req,
    env: (c?.env || {}) as Record<string, string>,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
