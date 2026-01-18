import { Tabs, usePathname, router } from "expo-router";
import React, { useCallback } from "react";
import { Platform, View, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";

import Colors from "@/constants/colors";
import {
  HomeIcon,
  CalendarBoldIcon,
  PlaneAltIcon,
  TicketFillIcon,
  InfoIcon
} from "@/components/CustomIcons";

const TAB_ROUTES = ["/", "/schedule", "/participants", "/tickets", "/info"] as const;
const SWIPE_THRESHOLD = 50;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

function SwipeNavigator({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getCurrentTabIndex = useCallback(() => {
    const normalizedPath = pathname === "" ? "/" : pathname;
    const index = TAB_ROUTES.findIndex((route) => route === normalizedPath);
    return index === -1 ? 0 : index;
  }, [pathname]);

  const navigateToTab = useCallback((direction: "left" | "right") => {
    const currentIndex = getCurrentTabIndex();
    const newIndex = direction === "right" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < TAB_ROUTES.length) {
      router.replace(TAB_ROUTES[newIndex] as any);
    }
  }, [getCurrentTabIndex]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        if (event.translationX > 0) {
          runOnJS(navigateToTab)("right");
        } else {
          runOnJS(navigateToTab)("left");
        }
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={{ flex: 1 }}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

export default function TabLayout() {
  return (
    <SwipeNavigator>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.live,
          tabBarInactiveTintColor: Colors.gray,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.primaryDark,
            borderTopWidth: 1,
            borderTopColor: "rgba(239, 68, 68, 0.2)",
            paddingTop: 8,
            height: Platform.OS === "ios" ? 88 : 64,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600" as const,
            marginTop: 2,
          },
          tabBarItemStyle: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Ana Sayfa",
            tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="schedule"
          options={{
            title: "Program",
            tabBarIcon: ({ color, size }) => <CalendarBoldIcon color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="participants"
          options={{
            title: "Katılımcılar",
            tabBarIcon: ({ color, size }) => <PlaneAltIcon color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="tickets"
          options={{
            title: "Biletler",
            tabBarIcon: ({ color, size }) => <TicketFillIcon color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="info"
          options={{
            title: "Bilgi",
            tabBarIcon: ({ color, size }) => <InfoIcon color={color} size={size} />,
          }}
        />
      </Tabs>
    </SwipeNavigator>
  );
}
