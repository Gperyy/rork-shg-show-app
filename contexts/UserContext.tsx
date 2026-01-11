import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { User } from "@/types";

const USER_STORAGE_KEY = "@shg_user_data";

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    },
  });

  const saveUserMutation = useMutation({
    mutationFn: async (userData: User) => {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      return userData;
    },
    onSuccess: (data) => {
      setUser(data);
    },
  });

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
