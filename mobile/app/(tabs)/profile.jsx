// app/(tabs)/profile.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../../components/CustomHeader'; // Using the new header

// A placeholder for the profile picture
const profileImage = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888';

const ProfileOption = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.optionItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.optionIconContainer}>
            <Ionicons name={icon} size={22} color="#6A5AE0" />
        </View>
        <Text style={styles.optionText}>{title}</Text>
        <Ionicons name="chevron-forward-outline" size={22} color="#A0A0A0" />
    </TouchableOpacity>
);

export default function ProfileScreen() {
    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", style: "destructive", onPress: () => console.log("User logged out") },
        ]);
    };

    return (
        <View style={styles.container}>
            {/* Solves the refresh icon being too high */}
            <CustomHeader />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.profileHeader}>
                    <Image source={{ uri: profileImage }} style={styles.avatar} />
                    <Text style={styles.userName}>Jessica Miller</Text>
                    <Text style={styles.userEmail}>jessica.miller@example.com</Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Reports Filed</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>5</Text>
                        <Text style={styles.statLabel}>Resolved</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>241</Text>
                        <Text style={styles.statLabel}>Upvotes</Text>
                    </View>
                </View>

                <View style={styles.optionsSection}>
                    <ProfileOption icon="person-outline" title="Edit Profile" onPress={() => { }} />
                    <ProfileOption icon="settings-outline" title="App Settings" onPress={() => { }} />
                    <ProfileOption icon="help-circle-outline" title="Help & Support" onPress={() => { }} />
                    <ProfileOption icon="document-text-outline" title="Terms of Service" onPress={() => { }} />
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color="#DC2626" />
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

// Styles designed to match the app's new vibe
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FF',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 120,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#fff',
        marginBottom: 15,
    },
    userName: {
        fontFamily: 'Poppins-Bold',
        fontSize: 24,
        color: '#2d3436',
    },
    userEmail: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#636e72',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
    },
    statBox: {
        alignItems: 'center',
    },
    statNumber: {
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
        color: '#6A5AE0',
    },
    statLabel: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#636e72',
        marginTop: 4,
    },
    optionsSection: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    optionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0EEFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    optionText: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#333',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        padding: 15,
        backgroundColor: '#FEF2F2',
        borderRadius: 20,
    },
    logoutButtonText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#DC2626',
        marginLeft: 8,
    },
});