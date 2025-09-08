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
            const res = await fetch("http://192.168.43.147:3000/api/v1/reports/");
            const data = await res.json();
            if (data?.status === "success" && Array.isArray(data?.data?.reports)) {
                setReports(data.data.reports);
            } else {
                setReports([]);
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

    // Remove handleDelete and local storage logic
    const handleDelete = () => {
        Alert.alert("Delete not supported", "Deleting reports is not supported from this screen.");
    };

    const openMap = (location) => {
        Alert.alert("Location not available", "This report does not have location data.");
    };

    const renderReportCard = ({ item }) => {
        const status = item.status || 'pending';
        const category = item.category || 'General';
        const statusStyle = getStatusStyle(status);

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/my-reports/${item._id}`)}
                activeOpacity={0.9}
            >
                <Image source={{ uri: '../../assets/images/react-logo.png' }} style={styles.cardImage} />
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
                        <Text style={styles.addressText}>Address not available</Text>
                    </View>
                </View>
                <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => openMap(item.location)}>
                        <Ionicons name="map-outline" size={20} color="#3498db" />
                        <Text style={[styles.actionText, { color: '#3498db' }]}>Map</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => router.push({ pathname: '/report-create', params: { reportId: item._id } })}>
                        <Ionicons name="create-outline" size={20} color="#f39c12" />
                        <Text style={[styles.actionText, { color: '#f39c12' }]}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
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
                keyExtractor={(item) => item._id.toString()}
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
