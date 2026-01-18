import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import Colors from "@/constants/colors";
import {
  HomeIcon,
  CalendarBoldIcon,
  PlaneAltIcon,
  TicketFillIcon
} from "@/components/CustomIcons";

export default function TabLayout() {
  return (
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
    </Tabs>
  );
}
