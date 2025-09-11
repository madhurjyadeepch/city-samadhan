// app/(tabs)/profile.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

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
    const { user, logout } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/api/v1/users/me');
                if (response.data.status === 'success') {
                    setProfileData(response.data.data.data);
                } else {
                    throw new Error('Failed to fetch profile data.');
                }
            } catch (error) {
                Alert.alert("Error", "Could not load your profile. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        Alert.alert(
            "Logout", 
            "Are you sure you want to log out?", 
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", style: "destructive", onPress: () => logout() },
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F7FF' }}>
                <ActivityIndicator size="large" color="#6A5AE0" />
            </View>
        );
    }
    
    const displayName = profileData?.name || user?.name;
    const displayEmail = profileData?.email || user?.email;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{displayName?.charAt(0)?.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.userName}>{displayName}</Text>
                    <Text style={styles.userEmail}>{displayEmail}</Text>
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FF',
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: '#F4F7FF',
    },
    headerTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 28,
        color: '#2d3436',
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 150,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#fff',
        marginBottom: 15,
        backgroundColor: '#6A5AE0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 48,
        fontFamily: 'Poppins-Bold',
    },
    userName: {
        fontFamily: 'Poppins-Bold',
        fontSize: 24,
        color: '#2d3436',
        lineHeight: 32,
    },
    userEmail: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#636e72',
        lineHeight: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 20, // Use vertical padding
        paddingHorizontal: 10, // Use horizontal padding
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statBox: {
        alignItems: 'center',
        flex: 1, // Allow flex to distribute space
    },
    statNumber: {
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
        color: '#6A5AE0',
        lineHeight: 28,
    },
    statLabel: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#636e72',
        marginTop: 4,
        textAlign: 'center',
        lineHeight: 20,
    },
    optionsSection: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 10, // Use horizontal padding
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18, // Increased padding
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
        lineHeight: 24,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        paddingVertical: 18, // Increased padding
        backgroundColor: '#FEF2F2',
        borderRadius: 20,
    },
    logoutButtonText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#DC2626',
        marginLeft: 8,
        lineHeight: 24,
    },
});