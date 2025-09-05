// app/(tabs)/my-reports.jsx

import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Image,
    RefreshControl,
    Alert,
    Platform,
} from "react-native";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from 'expo-linking';

// Helper function for status colors
const getStatusStyle = (status) => {
    switch (status) {
        case "in-progress":
            return { backgroundColor: "#fffbe6", color: "#f59e0b" };
        case "done":
            return { backgroundColor: "#f0fdf4", color: "#22c55e" };
        case "pending":
        default:
            return { backgroundColor: "#fee2e2", color: "#ef4444" };
    }
};

export default function MyReportsScreen() {
    const router = useRouter();
    const [reports, setReports] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadReports = useCallback(async () => {
        setRefreshing(true);
        try {
            const storedReports = await AsyncStorage.getItem("reports");
            if (storedReports) {
                setReports(JSON.parse(storedReports));
            } else {
                setReports([]); // Ensure reports is an empty array if nothing is in storage
            }
        } catch (error) {
            Alert.alert("Error", "Could not load your reports.");
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadReports();
        }, [loadReports])
    );

    const handleDelete = (reportId) => {
        Alert.alert(
            "Delete Report",
            "Are you sure you want to permanently delete this report?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        const updatedReports = reports.filter((r) => r.id !== reportId);
                        setReports(updatedReports);
                        await AsyncStorage.setItem("reports", JSON.stringify(updatedReports));
                    },
                    style: "destructive",
                },
            ]
        );
    };

    const openMap = (location) => {
        if (!location) {
            Alert.alert("Location not available", "This report does not have location data.");
            return;
        }
        const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
        const latLng = `${location.latitude},${location.longitude}`;
        const url = Platform.OS === 'ios' ? `${scheme}@${latLng}` : `${scheme}${latLng}(Issue Location)`;
        Linking.openURL(url);
    }

    const renderReportCard = ({ item }) => {
        // **FIX STARTS HERE: Provide default values to prevent crash**
        const status = item.status || 'pending';
        const category = item.category || 'General';
        // **FIX ENDS HERE**

        const statusStyle = getStatusStyle(status);

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/my-reports/${item.id}`)}
                activeOpacity={0.9}
            >
                <Image source={{ uri: item.image || 'https://via.placeholder.com/400x180.png/e9ecef/6c757d?text=No+Image' }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.categoryText}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                            <Text style={[styles.statusText, { color: statusStyle.color }]}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.cardTitle}>{item.title || 'No Title'}</Text>
                    <Text style={styles.cardDescription} numberOfLines={2}>
                        {item.description || 'No description provided.'}
                    </Text>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-sharp" size={16} color="#636e72" />
                        <Text style={styles.addressText}>{item.address || 'Address not available'}</Text>
                    </View>
                </View>
                <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => openMap(item.location)}>
                        <Ionicons name="map-outline" size={20} color="#3498db" />
                        <Text style={[styles.actionText, { color: '#3498db' }]}>Map</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => router.push({ pathname: '/report-create', params: { reportId: item.id } })}>
                        <Ionicons name="create-outline" size={20} color="#f39c12" />
                        <Text style={[styles.actionText, { color: '#f39c12' }]}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
                        <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                        <Text style={[styles.actionText, { color: '#e74c3c' }]}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Reports</Text>
            </View>
            <FlatList
                data={reports}
                renderItem={renderReportCard}
                keyExtractor={(item) => item.id.toString()} // Added .toString() for safety
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadReports} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="file-tray-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>You haven't submitted any reports yet.</Text>
                        <TouchableOpacity onPress={() => router.push('/report-create')}>
                            <Text style={styles.emptyLink}>Report an issue</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    headerTitle: { fontSize: 28, fontWeight: 'bold' },
    listContainer: { padding: 15 },
    card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
    cardImage: { width: '100%', height: 180, borderTopLeftRadius: 16, borderTopRightRadius: 16, backgroundColor: '#e9ecef' },
    cardContent: { padding: 15 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    categoryText: { fontWeight: 'bold', color: '#667eea' },
    statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
    statusText: { fontWeight: '600', fontSize: 12, textTransform: 'capitalize' },
    cardTitle: { fontSize: 18, fontWeight: '600', color: '#2d3436', marginBottom: 5 },
    cardDescription: { fontSize: 14, color: '#636e72', lineHeight: 20, marginBottom: 15 },
    locationContainer: { flexDirection: 'row', alignItems: 'center' },
    addressText: { marginLeft: 5, color: '#636e72', flex: 1 },
    cardActions: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingVertical: 5 },
    actionButton: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 6 },
    actionText: { fontWeight: '600', fontSize: 14 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
    emptyText: { fontSize: 16, color: '#999', marginTop: 15 },
    emptyLink: { fontSize: 16, color: '#667eea', fontWeight: '600', marginTop: 10 }
});