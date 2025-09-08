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

    useFocusEffect(useCallback(() => { loadReports(); }, [loadReports]));

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
