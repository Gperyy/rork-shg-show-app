import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";

import { UserProvider, useUser } from "@/contexts/UserContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { trpc, trpcClient } from "@/lib/trpc";
import LoadingScreen from "@/components/LoadingScreen";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { user, isLoading } = useUser();
  const segments = useSegments();
  const router = useRouter();
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    // Hide splash screen once user data is loaded
    SplashScreen.hideAsync();

    const inTabs = segments[0] === "(tabs)";

    if (!user && inTabs) {
      router.replace("user-registration" as any);
    } else if (user && !inTabs && segments[0] !== "+not-found") {
      router.replace("/" as any);
    }
  }, [user, segments, isLoading, router]);

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false);
  };

  return (
    <>
      <Stack screenOptions={{ headerBackTitle: "Geri" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="user-registration"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="+not-found" options={{ title: "Sayfa Bulunamadı" }} />
      </Stack>
      {showLoadingScreen && (
        <LoadingScreen
          onComplete={handleLoadingComplete}
          targetDate="2026-09-19"
        />
      )}
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Fonts loaded, splash screen will be hidden when user is ready
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <UserProvider>
          <NotificationProvider>
            <GestureHandlerRootView>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </NotificationProvider>
        </UserProvider>
      </trpc.Provider>
    </QueryClientProvider>
  );
}
