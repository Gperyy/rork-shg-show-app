import { Tabs, usePathname, router } from "expo-router";
import React, { useCallback, useRef } from "react";
import { Platform, View, PanResponder } from "react-native";

import Colors from "@/constants/colors";
import {
  HomeIcon,
  CalendarBoldIcon,
  PlaneAltIcon,
  TicketFillIcon,
  InfoIcon
} from "@/components/CustomIcons";

const TAB_ROUTES = ["/", "/schedule", "/participants", "/tickets", "/info"] as const;
const SWIPE_THRESHOLD = 80;

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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 50;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
          if (gestureState.dx > 0) {
            navigateToTab("right");
          } else {
            navigateToTab("left");
          }
        }
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      {children}
    </View>
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
