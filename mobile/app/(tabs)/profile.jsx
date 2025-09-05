// app/(tabs)/profile.jsx

import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Alert,
    StatusBar // **FIX: Import StatusBar from react-native**
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen() {
    const [refreshing, setRefreshing] = useState(false);

    // Mock profile data, simplified as per your request
    const profileData = {
        name: "Example User",
        email: "example@example.com",
        joinDate: "Member since Jan 2024",
        avatarInitial: "EX",
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Simulate a network request
        setTimeout(() => {
            setRefreshing(false);
            Alert.alert("Profile Updated", "Your information is up to date.");
        }, 1000);
    }, []);

    const handleLogout = () => {
        Alert.alert("Log Out", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            { text: "Log Out", onPress: () => { console.log("User logged out") /* Add real logout logic here */ }, style: "destructive" }
        ])
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
            >
                <LinearGradient
                    colors={["#667eea", "#764ba2"]}
                    style={styles.header}
                >
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{profileData.avatarInitial}</Text>
                    </View>
                    <Text style={styles.profileName}>{profileData.name}</Text>
                    <Text style={styles.profileEmail}>{profileData.email}</Text>
                    <Text style={styles.profileJoinDate}>{profileData.joinDate}</Text>
                </LinearGradient>

                <View style={styles.menuContainer}>
                    <Text style={styles.menuTitle}>Account</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="person-outline" size={22} color="#636e72" />
                        <Text style={styles.menuItemText}>Edit Profile</Text>
                        <Ionicons name="chevron-forward-outline" size={22} color="#ccc" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="settings-outline" size={22} color="#636e72" />
                        <Text style={styles.menuItemText}>Settings</Text>
                        <Ionicons name="chevron-forward-outline" size={22} color="#ccc" />
                    </TouchableOpacity>

                    <Text style={styles.menuTitle}>Support</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="help-circle-outline" size={22} color="#636e72" />
                        <Text style={styles.menuItemText}>Help Center</Text>
                        <Ionicons name="chevron-forward-outline" size={22} color="#ccc" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
    avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
    avatarText: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
    profileName: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    profileEmail: { fontSize: 16, color: '#fff', opacity: 0.8, marginTop: 4 },
    profileJoinDate: { fontSize: 12, color: '#fff', opacity: 0.6, marginTop: 8 },
    menuContainer: { padding: 20 },
    menuTitle: { fontSize: 14, fontWeight: '600', color: '#999', textTransform: 'uppercase', marginBottom: 10, marginTop: 15 },
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    menuItemText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#2d3436' },
    logoutButton: { backgroundColor: '#fee2e2', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
    logoutButtonText: { color: '#ef4444', fontSize: 16, fontWeight: '600' },
});