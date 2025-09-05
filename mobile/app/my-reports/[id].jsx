import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator, Linking } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock comments data for demonstration
const MOCK_COMMENTS = [
    { id: 1, user: 'Shaurya Sharma', avatar: 'SS', comment: 'I live nearby and can confirm this is a major issue. Thanks for reporting!', time: '2h ago' },
    { id: 2, user: 'Municipal Worker', avatar: 'MW', comment: 'Our team has been notified. We will inspect the site tomorrow morning.', time: '1h ago' },
];

export default function MyReportDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchReport = useCallback(async () => {
        setLoading(true);
        const storedReports = await AsyncStorage.getItem('reports');
        if (storedReports) {
            const reports = JSON.parse(storedReports);
            const foundReport = reports.find(r => r.id === id);
            setReport(foundReport);
        }
        setLoading(false);
    }, [id]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const handleDelete = async () => {
        const storedReports = await AsyncStorage.getItem('reports');
        if (storedReports) {
            let reports = JSON.parse(storedReports);
            const updatedReports = reports.filter(r => r.id !== id);
            await AsyncStorage.setItem('reports', JSON.stringify(updatedReports));
            router.back();
        }
    };

    const confirmDelete = () => {
        Alert.alert(
            "Delete Report",
            "Are you sure you want to delete this report? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: handleDelete }
            ]
        );
    };

    const handleEdit = () => {
        // Navigate to the create/edit screen, passing the report ID
        router.push({ pathname: '/report-create', params: { reportId: id } });
    };

    const openMap = () => {
        if (report?.location) {
            const { latitude, longitude } = report.location;
            const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            Linking.openURL(url);
        }
    };


    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#667eea" /></View>;
    }

    if (!report) {
        return <View style={styles.centered}><Text>Report not found.</Text></View>;
    }

    const getStatusColor = (status) => status === "resolved" ? "#4ECDC4" : status === "in-progress" ? "#FFD93D" : "#FF6B6B";

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen
                options={{
                    headerTitle: `Report #${id.slice(-6)}`,
                    headerRight: () => (
                        <View style={styles.headerButtons}>
                            <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
                                <MaterialCommunityIcons name="pencil-outline" size={24} color="#667eea" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={confirmDelete} style={styles.headerButton}>
                                <MaterialCommunityIcons name="delete-outline" size={24} color="#FF6B6B" />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />
            <ScrollView>
                {report.image && <Image source={{ uri: report.image }} style={styles.image} />}

                <View style={styles.content}>
                    <View style={styles.badgeContainer}>
                        <Text style={styles.categoryBadge}>{report.category.charAt(0).toUpperCase() + report.category.slice(1)}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                            <Text style={styles.statusText}>{report.status.charAt(0).toUpperCase() + report.status.slice(1)}</Text>
                        </View>
                    </View>

                    <Text style={styles.title}>{report.title}</Text>
                    <Text style={styles.description}>{report.description}</Text>

                    <View style={styles.locationContainer}>
                        <Ionicons name="location" size={20} color="#667eea" />
                        <Text style={styles.locationText}>{report.address}</Text>
                        <TouchableOpacity onPress={openMap} style={styles.mapButton}>
                            <MaterialCommunityIcons name="google-maps" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.metaContainer}>
                        <Ionicons name="time-outline" size={16} color="#999" />
                        <Text style={styles.metaText}>Reported on {new Date(report.createdAt).toLocaleDateString()}</Text>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Comments</Text>
                    {MOCK_COMMENTS.map(comment => (
                        <View key={comment.id} style={styles.commentCard}>
                            <View style={styles.commentAvatar}>
                                <Text style={styles.commentAvatarText}>{comment.avatar}</Text>
                            </View>
                            <View style={styles.commentBody}>
                                <View style={styles.commentHeader}>
                                    <Text style={styles.commentUser}>{comment.user}</Text>
                                    <Text style={styles.commentTime}>{comment.time}</Text>
                                </View>
                                <Text style={styles.commentText}>{comment.comment}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerButtons: { flexDirection: 'row' },
    headerButton: { paddingHorizontal: 10 },
    image: { width: '100%', height: 250, backgroundColor: '#e9ecef' },
    content: { padding: 20 },
    badgeContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    categoryBadge: { backgroundColor: '#e7eafc', color: '#667eea', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, fontWeight: '600', fontSize: 13, overflow: 'hidden' },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
    statusText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#2d3436', marginBottom: 8 },
    description: { fontSize: 16, color: '#636e72', lineHeight: 24, marginBottom: 20 },
    locationContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    locationText: { flex: 1, marginLeft: 10, fontSize: 15, color: '#2d3436' },
    mapButton: { backgroundColor: '#667eea', padding: 8, borderRadius: 8 },
    metaContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    metaText: { marginLeft: 6, fontSize: 13, color: '#999' },
    divider: { height: 1, backgroundColor: '#e9ecef', marginVertical: 10 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2d3436', marginBottom: 15 },
    commentCard: { flexDirection: 'row', marginBottom: 15, backgroundColor: '#fff', padding: 12, borderRadius: 12 },
    commentAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4ECDC4', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    commentAvatarText: { color: '#fff', fontWeight: 'bold' },
    commentBody: { flex: 1 },
    commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    commentUser: { fontWeight: 'bold', color: '#2d3436' },
    commentTime: { fontSize: 12, color: '#999' },
    commentText: { color: '#636e72' },
});