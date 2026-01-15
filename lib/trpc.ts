import { httpLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@/backend/trpc/app-router";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  const url = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;

  console.log("🔧 [tRPC] EXPO_PUBLIC_RORK_API_BASE_URL:", url || "❌ NOT SET");

  if (!url) {
    console.error("❌ [tRPC] Backend URL is not configured!");
    throw new Error(
      "Rork did not set EXPO_PUBLIC_RORK_API_BASE_URL, please use support",
    );
  }

  console.log("✅ [tRPC] Backend URL configured:", url);
  return url;
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});
