// app/(tabs)/my-reports.jsx

import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    RefreshControl,
    Alert,
    TouchableOpacity,
} from "react-native";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import * as Linking from 'expo-linking';
import { Ionicons } from "@expo/vector-icons";
import ReportCard from '../../components/ReportCard'; // Import the new component

export default function MyReportsScreen() {
    const router = useRouter();
    const [reports, setReports] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadReports = useCallback(async () => {
        // ... data loading logic is unchanged
        setRefreshing(true);
        const storedReports = await AsyncStorage.getItem("reports");
        if (storedReports) setReports(JSON.parse(storedReports));
        setRefreshing(false);
    }, []);

    useFocusEffect(useCallback(() => { loadReports(); }, [loadReports]));

    const handleDelete = (reportId) => {
        Alert.alert("Delete Report", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", style: "destructive", onPress: async () => {
                    const updatedReports = reports.filter((r) => r.id !== reportId);
                    setReports(updatedReports);
                    await AsyncStorage.setItem("reports", JSON.stringify(updatedReports));
                }
            },
        ]);
    };

    const openMap = (location) => {
        if (!location) return;
        const url = `http://maps.apple.com/?q=${location.latitude},${location.longitude}`;
        Linking.openURL(url);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Reports</Text>
            </View>
            <FlatList
                data={reports}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadReports} />}
                renderItem={({ item }) => (
                    <ReportCard
                        report={item}
                        type="my-report"
                        onDelete={() => handleDelete(item.id)}
                        onOpenMap={() => openMap(item.location)}
                    />
                )}
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

// NEW Styles for the screen
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F7FF' },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 28,
        color: '#2d3436'
    },
    listContainer: {
        padding: 20,
        paddingBottom: 120
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
        marginTop: 15
    },
    emptyLink: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#6A5AE0',
        marginTop: 10
    }
});