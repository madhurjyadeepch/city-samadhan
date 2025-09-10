import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    Alert,
    TouchableOpacity,
    Image,
    Platform,
    StatusBar,
} from "react-native";
// <-- MODIFIED: Import SafeAreaView from the recommended library
import { SafeAreaView } from "react-native-safe-area-context"; 
import { useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ReportCard from '../../components/ReportCard';
import api from "../../utils/api";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyReportsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [reports, setReports] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const getStatusStyle = (status) => {
    switch (status) {
        case "in-progress": return { backgroundColor: "#fffbe6", color: "#f59e0b" };
        case "done":
        case "resolved": return { backgroundColor: "#f0fdf4", color: "#22c55e" };
        case "pending": default: return { backgroundColor: "#fee2e2", color: "#ef4444" };
        }
    };

    const loadReports = useCallback(async () => {
        setRefreshing(true);
        try {
            const response = await api.get('/api/v1/reports/my-reports');
            const data = response.data;

            if (data?.status === "success" && Array.isArray(data?.data?.reports)) {
                setReports(data.data.reports);
            } else {
                setReports([]);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Could not load your reports.";
            Alert.alert("Error", message);
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(useCallback(() => { loadReports(); }, [loadReports]));

    const handleDelete = (reportId) => {
        Alert.alert("Confirm Delete", "Are you sure you want to delete this report?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: async () => {
                try {
                    await api.delete(`/api/v1/reports/${reportId}`);
                    Alert.alert("Success", "Report deleted successfully.");
                    loadReports(); // Refresh the list
                } catch (error) {
                    const message = error.response?.data?.message || "Could not delete the report.";
                    Alert.alert("Error", message);
                }
            }},
        ]);
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
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F7FF" />

            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <Text style={styles.headerTitle}>My Reports</Text>
            </View>

            <FlatList
                data={reports}
                renderItem={({ item }) => (
                    <ReportCard 
                        report={item}
                        onEdit={() => router.push({ pathname: '/report-create', params: { reportId: item._id } })}
                        onDelete={() => handleDelete(item._id)}
                        onOpenMap={() => openMap(item.location)}
                    />
                )}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadReports} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="file-tray-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>You haven't submitted any reports yet.</Text>
                        <TouchableOpacity onPress={() => router.push('/report-create')}>
                            <Text style={styles.emptyLink}>Report an issue</Text>
                        </TouchableOpacity>
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FF'
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: '#F4F7FF',
    },
    headerTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 28,
        color: '#2d3436'
    },
    listContainer: {
        padding: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100
    },
    emptyText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#999',
        marginTop: 15,
        textAlign: 'center',
    },
    emptyLink: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#6A5AE0',
        marginTop: 10
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
        padding: 16,
    },
    cardImage: {
        width: '100%',
        height: 160,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: '#eee',
    },
    cardContent: {
        marginBottom: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    categoryText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#6A5AE0',
    },
    statusBadge: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginLeft: 8,
    },
    statusText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
    },
    cardTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        color: '#2d3436',
        marginBottom: 4,
    },
    cardDescription: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#636e72',
        marginBottom: 8,
        lineHeight: 20,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    addressText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        color: '#636e72',
        marginLeft: 4,
        flex: 1,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        backgroundColor: '#F4F7FF',
        marginRight: 8,
    },
    actionText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        marginLeft: 4,
    },
});