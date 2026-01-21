import { Tabs, usePathname, router } from "expo-router";
import React, { useCallback, useRef, useMemo, useEffect } from "react";
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
const SWIPE_THRESHOLD = 50;

function SwipeNavigator({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const swipeHandled = useRef(false);
  const pathnameRef = useRef(pathname);

  // Keep pathname ref updated
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const getCurrentTabIndex = useCallback(() => {
    const normalizedPath = pathnameRef.current === "" ? "/" : pathnameRef.current;
    const index = TAB_ROUTES.findIndex((route) => route === normalizedPath);
    return index === -1 ? 0 : index;
  }, []);

  const navigateToTab = useCallback((direction: "left" | "right") => {
    const currentIndex = getCurrentTabIndex();
    const newIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < TAB_ROUTES.length) {
      router.replace(TAB_ROUTES[newIndex] as any);
    }
  }, [getCurrentTabIndex]);

  // Store navigateToTab in ref so panResponder always has access to latest version
  const navigateRef = useRef(navigateToTab);
  useEffect(() => {
    navigateRef.current = navigateToTab;
  }, [navigateToTab]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Only handle horizontal swipes that are more horizontal than vertical
          const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5;
          return isHorizontalSwipe && Math.abs(gestureState.dx) > 10;
        },
        onPanResponderGrant: () => {
          swipeHandled.current = false;
        },
        onPanResponderMove: (_, gestureState) => {
          // Handle swipe during movement for more responsive feel
          if (!swipeHandled.current && Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
            swipeHandled.current = true;
            // Swipe right (dx > 0) = go to previous page (left)
            // Swipe left (dx < 0) = go to next page (right)
            if (gestureState.dx > 0) {
              navigateRef.current("left");
            } else {
              navigateRef.current("right");
            }
          }
        },
        onPanResponderRelease: () => {
          swipeHandled.current = false;
        },
      }),
    []
  );

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
            title: "Hakkında",
            tabBarIcon: ({ color, size }) => <InfoIcon color={color} size={size} />,
          }}
        />
      </Tabs>
    </SwipeNavigator>
  );
}
