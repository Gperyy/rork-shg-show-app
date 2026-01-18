import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { trpc, trpcClient } from "@/lib/trpc";
import { User } from "@/types";

const USER_STORAGE_KEY = "@shg_user_data";

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from local storage
  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    },
  });

  // Save user mutation - saves both to Supabase and local storage
  const saveUserMutation = useMutation({
    mutationFn: async (userData: Omit<User, "id" | "created_at">) => {
      console.log("🚀 [UserContext] Attempting to save user:", userData);

      // First, try to save to Supabase
      try {
        console.log("📡 [UserContext] Calling backend API...");
        const savedUser = await trpcClient.user.register.mutate({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
        });

        console.log("✅ [UserContext] User saved to Supabase:", savedUser);

        // Save to local storage as well (for offline access)
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(savedUser));

        return savedUser;
      } catch (error: any) {
        console.error("❌ [UserContext] Error saving user:", error.message);
        console.error("Full error:", error);

        // If network error, JSON parse error, or Supabase unavailable, still save locally
        if (error.message.includes("Supabase is not configured") ||
          error.message.includes("EXPO_PUBLIC_RORK_API_BASE_URL") ||
          error.message.includes("JSON Parse error") ||
          error.message.includes("Unexpected end of input") ||
          error.message.includes("Network request failed") ||
          error.name === "TRPCClientError") {
          console.warn("⚠️ [UserContext] Falling back to local storage only");
          const localUser = {
            ...userData,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
          };
          await AsyncStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(localUser),
          );
          return localUser;
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      setUser(data);
    },
  });

  // Save user with Apple Sign In mutation
  const saveAppleUserMutation = useMutation({
    mutationFn: async (appleData: {
      appleUserId: string;
      email?: string;
      fullName?: {
        givenName?: string;
        familyName?: string;
      };
    }) => {
      console.log("🍎 [UserContext] Attempting to save Apple user:", appleData);

      try {
        console.log("📡 [UserContext] Calling Apple Sign In API...");
        const savedUser = await trpcClient.user.registerOrLoginWithApple.mutate({
          appleUserId: appleData.appleUserId,
          email: appleData.email || "",
          fullName: appleData.fullName,
        });

        console.log("✅ [UserContext] Apple user saved to Supabase:", savedUser);

        // Save to local storage as well (for offline access)
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(savedUser));

        return savedUser;
      } catch (error: any) {
        console.error("❌ [UserContext] Error saving Apple user:", error.message);
        console.error("Full error:", error);

        // Fallback to local storage if backend fails
        console.warn("⚠️ [UserContext] Falling back to local storage for Apple User");

        // If email is missing (subsequent login) and we are offline, 
        // we might not get the real email. Use a placeholder or ID.
        const effectiveEmail = appleData.email || `apple-${appleData.appleUserId}@placeholder.com`;

        const localUser: User = {
          id: `apple_${appleData.appleUserId}`,
          name: [appleData.fullName?.givenName, appleData.fullName?.familyName]
            .filter(Boolean)
            .join(" ") || "Apple User",
          email: effectiveEmail,
        };

        await AsyncStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(localUser),
        );
        return localUser;
      }
    },
    onSuccess: (data) => {
      setUser(data);
    },
  });

  // Clear user mutation
  const clearUserMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      return null;
    },
    onSuccess: () => {
      setUser(null);
    },
  });

  useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data);
    }
  }, [userQuery.data]);

  return {
    user,
    isLoading: userQuery.isLoading,
    saveUser: saveUserMutation.mutate,
    saveAppleUser: saveAppleUserMutation.mutate,
    clearUser: clearUserMutation.mutate,
    isSaving: saveUserMutation.isPending,
    isSavingApple: saveAppleUserMutation.isPending,
  };
});
