// app/(tabs)/_layout.jsx

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#6A5AE0", // New primary color
                tabBarInactiveTintColor: "#A0A0A0",
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    elevation: 5,
                    backgroundColor: '#ffffff',
                    borderRadius: 25,
                    height: 70,
                    shadowColor: '#6A5AE0',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="my-reports"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "document-text" : "document-text-outline"} size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "people" : "people-outline"} size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "person" : "person-outline"} size={28} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}