// app/my-reports/[id].jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Alert, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper to get status styles
const getStatusStyle = (status) => {
    switch (status) {
        case "in-progress": return { backgroundColor: "#FFFBEB", color: "#F59E0B" };
        case "done": return { backgroundColor: "#F0FDF4", color: "#16A34A" };
        case "pending": default: return { backgroundColor: "#FEF2F2", color: "#DC2626" };
    }
};

export default function MyReportDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [report, setReport] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            const storedReports = await AsyncStorage.getItem("reports");
            if (storedReports) {
                const reports = JSON.parse(storedReports);
                const foundReport = reports.find(r => r.id === id);
                setReport(foundReport);
            }
        };
        if (id) {
            fetchReport();
        }
    }, [id]);

    // Handlers for header actions
    const handleDelete = () => {
        Alert.alert("Delete Report", "Are you sure you want to permanently delete this report?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", style: "destructive", onPress: () => {
                    console.log("Deleting report...");
                    router.back();
                }
            },
        ]);
    };

    const handleEdit = () => {
        Alert.alert("Edit Report", "Editing functionality will be implemented here.");
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this issue report on City Samadhan: ${report.title}`,
                // url: 'your_app_deep_link_here', // Optional
            });
        } catch (error) {
            Alert.alert(error.message);
        }
    };


    if (!report) {
        return <SafeAreaView style={styles.container}><Text>Loading report...</Text></SafeAreaView>;
    }

    const statusStyle = getStatusStyle(report.status);

    return (
        <SafeAreaView style={styles.container}>
            {/* Properly maintained header [cite: 35] */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="chevron-down" size={28} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
                        <Ionicons name="share-outline" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
                        <Ionicons name="create-outline" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
                        <Ionicons name="trash-outline" size={24} color="#DC2626" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image source={{ uri: report.image }} style={styles.reportImage} />

                <View style={styles.content}>
                    <View style={styles.tagContainer}>
                        <Text style={styles.categoryTag}>{report.category}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                            <Text style={[styles.statusText, { color: statusStyle.color }]}>{report.status}</Text>
                        </View>
                    </View>

                    <Text style={styles.title}>{report.title}</Text>
                    <Text style={styles.description}>{report.description}</Text>

                    <View style={styles.infoSection}>
                        <Ionicons name="location-outline" size={20} color="#6A5AE0" style={styles.icon} />
                        <Text style={styles.infoText}>{report.address}</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Ionicons name="calendar-outline" size={20} color="#6A5AE0" style={styles.icon} />
                        <Text style={styles.infoText}>Reported on {new Date(report.id).toLocaleDateString()}</Text>
                    </View>

                    {/* Comments Section [cite: 33] */}
                    <View style={styles.commentsSection}>
                        <Text style={styles.sectionTitle}>Comments</Text>
                        <View style={styles.commentPlaceholder}>
                            <Text style={styles.commentPlaceholderText}>No comments yet.</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Top-notch and clean design styles [cite: 34]
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerButton: { padding: 5 },
    headerActions: { flexDirection: 'row', gap: 15 },
    scrollContainer: { paddingBottom: 50 },
    reportImage: { width: '100%', height: 250 },
    content: { padding: 20 },
    tagContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryTag: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        color: '#6A5AE0',
        backgroundColor: '#F0EEFF',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        overflow: 'hidden',
    },
    statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
    statusText: { fontFamily: 'Poppins-SemiBold', fontSize: 12, textTransform: 'capitalize' },
    title: {
        fontFamily: 'Poppins-Bold',
        fontSize: 24,
        color: '#2d3436',
        marginBottom: 8,
    },
    description: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#636e72',
        lineHeight: 24,
        marginBottom: 20,
    },
    infoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F7FF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    icon: { marginRight: 10 },
    infoText: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#333', flex: 1 },
    commentsSection: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 20 },
    sectionTitle: { fontFamily: 'Poppins-Bold', fontSize: 18, marginBottom: 10 },
    commentPlaceholder: { alignItems: 'center', paddingVertical: 30, backgroundColor: '#F9F9F9', borderRadius: 10 },
    commentPlaceholderText: { fontFamily: 'Poppins-Regular', color: '#999' },
});