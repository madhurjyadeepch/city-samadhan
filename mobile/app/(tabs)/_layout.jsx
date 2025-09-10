import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { ActivityIndicator, View } from 'react-native';
import { Platform } from "react-native";

export default function TabsLayout() {
    const { user, isLoading } = useAuth();

    // While the app checks for a saved user session, show a loading screen.
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#6A5AE0" />
            </View>
        );
    }

    // If loading is finished and there is no user, redirect to the login screen.
    if (!user) {
        return <Redirect href="/login" />;
    }

    // If a user is logged in, render your styled tabs.
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#6A5AE0",
                tabBarActiveTintColor: "#6A5AE0",
                tabBarInactiveTintColor: "#A0A0A0",
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0, // Changed from 20 to 0
                    left: 0,   // Changed from 20 to 0
                    right: 0,  // Changed from 20 to 0
                    elevation: 5,
                    backgroundColor: '#ffffff',
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    borderRadius: 0, // Remove general border radius
                    height: Platform.OS === 'ios' ? 85 : 70, // Different heights for iOS/Android
                    paddingBottom: Platform.OS === 'ios' ? 25 : 5, // Account for home indicator
                    paddingTop: 10,
                    shadowColor: '#6A5AE0',
                    shadowOffset: { width: 0, height: -2 }, // Shadow going upward
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                    borderTopWidth: 1,
                    borderTopColor: '#EAEBEE',
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