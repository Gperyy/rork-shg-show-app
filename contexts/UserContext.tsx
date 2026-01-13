import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { trpc } from "@/lib/trpc";
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
      // First, try to save to Supabase
      try {
        const savedUser = await trpc.user.register.mutate({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
        });

        // Save to local storage as well (for offline access)
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(savedUser));

        return savedUser;
      } catch (error: any) {
        // If network error or Supabase unavailable, still save locally
        if (error.message.includes("Supabase is not configured")) {
          console.warn("Supabase not configured, saving locally only");
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
    clearUser: clearUserMutation.mutate,
    isSaving: saveUserMutation.isPending,
  };
});
