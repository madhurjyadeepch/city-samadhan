// app/(tabs)/my-reports.jsx

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    Alert,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ReportCard from '../../components/ReportCard';
import api from "../../utils/api";

export default function MyReportsScreen() {
    const router = useRouter();
    const [reports, setReports] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

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

    // <-- REMOVED: The entire unused renderReportCard function is gone.
    // <-- REMOVED: The unused getStatusStyle function is gone.

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
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
        </SafeAreaView>
    );
}

// <-- MODIFIED: Styles are simplified, removing all unused card styles.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FF'
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: '#F4F7FF',
    },
    headerTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 28,
        color: '#2d3436'
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        // Add padding at the bottom to avoid the tab bar
        paddingBottom: 150, 
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
});