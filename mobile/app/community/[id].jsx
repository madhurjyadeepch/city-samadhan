import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../utils/api';

// --- (Helper functions like getStatusStyle remain the same) ---
const getStatusStyle = (status) => {
    switch (status) {
        case "in-progress": return { backgroundColor: "#FFFBEB", color: "#F59E0B" };
        case "resolved": return { backgroundColor: "#F0FDF4", color: "#16A34A" };
        case "pending": default: return { backgroundColor: "#FEF2F2", color: "#DC2626" };
    }
};

// --- DUMMY DATA FOR PROTOTYPE ---
const dummyComments = [
    { id: '1', user: 'Jane Doe', text: 'I saw this too! It\'s a real problem.' },
    { id: '2', user: 'John Smith', text: 'Thanks for reporting this. Hope it gets fixed soon.' },
];

export default function ReportDetailScreen() {
    const { id } = useLocalSearchParams(); // Get the report ID from the URL
    const router = useRouter();
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // --- STATE FOR COMMENTS ---
    const [comments, setComments] = useState(dummyComments);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchReportDetails = async () => {
            if (!id) return;
            try {
                // MODIFIED: Use a POST request to the /getOne endpoint
                const response = await api.post(`/api/v1/reports/getOne`, { reportId: id });
                
                if (response.data.status === 'success') {
                    setReport(response.data.data.report);
                } else {
                    throw new Error('Report not found.');
                }
            } catch (error) {
                Alert.alert("Error", "Could not load the report details.");
                router.back();
            } finally {
                setIsLoading(false);
            }
        };
        fetchReportDetails();
    }, [id]);

    const handleAddComment = () => {
        if (newComment.trim() === '') return;
        const commentToAdd = {
            id: Math.random().toString(),
            user: 'You', // Placeholder for current user
            text: newComment,
        };
        setComments([...comments, commentToAdd]);
        setNewComment('');
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6A5AE0" />
            </SafeAreaView>
        );
    }

    if (!report) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Report not found.</Text>
            </SafeAreaView>
        );
    }
    
    const imageUrl = `${process.env.EXPO_PUBLIC_API_URL}/${report.image}`;
    const statusStyle = getStatusStyle(report.status);
    const avatarInitial = report.author?.name?.[0]?.toUpperCase() || "A";

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back-circle" size={32} color="#555" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image source={{ uri: imageUrl }} style={styles.reportImage} />

                <View style={styles.card}>
                    <View style={styles.tagRow}>
                        <View style={styles.categoryBadge}><Text style={styles.categoryText}>{report.category}</Text></View>
                        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}><Text style={[styles.statusText, { color: statusStyle.color }]}>{report.status}</Text></View>
                    </View>
                    <Text style={styles.titleText}>{report.title}</Text>
                    <Text style={styles.descriptionText}>{report.description}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardSectionTitle}>Details</Text>
                    <View style={styles.detailRow}><Ionicons name="location-outline" size={22} color="#636e72" /><Text style={styles.detailText}>{report.address}</Text></View>
                    <View style={styles.detailRow}><Ionicons name="calendar-outline" size={22} color="#636e72" /><Text style={styles.detailText}>{new Date(report.createdAt).toLocaleString()}</Text></View>
                </View>
                
                {report.author && (
                    <View style={styles.card}>
                        <Text style={styles.cardSectionTitle}>Reported By</Text>
                         <View style={styles.authorInfo}>
                            <View style={styles.avatar}><Text style={styles.avatarText}>{avatarInitial}</Text></View>
                            <Text style={styles.authorName}>{report.author.name}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.card}>
                    <Text style={styles.cardSectionTitle}>Comments ({comments.length})</Text>
                    {comments.map((comment, index) => (
                        <View key={index} style={styles.commentContainer}>
                            <Text style={styles.commentUser}>{comment.user}</Text>
                            <Text style={styles.commentText}>{comment.text}</Text>
                        </View>
                    ))}
                    <View style={styles.commentInputContainer}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Add a comment..."
                            value={newComment}
                            onChangeText={setNewComment}
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
                            <Ionicons name="send" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F7FF' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F7FF' },
    scrollContainer: { paddingHorizontal: 20, paddingBottom: 50 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10 },
    backButton: { padding: 5 },
    reportImage: { width: '100%', height: 250, borderRadius: 20, backgroundColor: '#EAEBEE', marginBottom: 20 },
    card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
    tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    categoryBadge: { backgroundColor: '#F0EEFF', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20 },
    categoryText: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#6A5AE0', textTransform: 'capitalize' },
    statusBadge: { marginLeft: 'auto', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
    statusText: { fontFamily: 'Poppins-SemiBold', fontSize: 14, textTransform: 'capitalize' },
    titleText: { fontFamily: 'Poppins-Bold', fontSize: 24, color: '#2d3436', marginBottom: 10, lineHeight: 32 },
    descriptionText: { fontFamily: 'Poppins-Regular', fontSize: 16, color: '#636e72', lineHeight: 26 },
    cardSectionTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 18, color: '#333', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 10 },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    detailText: { fontFamily: 'Poppins-Regular', fontSize: 15, color: '#2d3436', marginLeft: 15, flex: 1 },
    authorInfo: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#e0e7ff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    avatarText: { fontFamily: 'Poppins-Bold', fontSize: 20, color: '#6A5AE0' },
    authorName: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#2d3436' },
    commentContainer: { backgroundColor: '#F4F7FF', borderRadius: 12, padding: 12, marginBottom: 10 },
    commentUser: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#333', marginBottom: 4 },
    commentText: { fontFamily: 'Poppins-Regular', fontSize: 14, color: '#636e72', lineHeight: 20 },
    commentInputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 15, borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 15 },
    commentInput: { flex: 1, backgroundColor: '#F4F7FF', borderRadius: 25, paddingVertical: 12, paddingHorizontal: 18, fontFamily: 'Poppins-Regular', fontSize: 15, marginRight: 10 },
    sendButton: { backgroundColor: '#6A5AE0', borderRadius: 25, width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
});
