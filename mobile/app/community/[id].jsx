import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data that would be fetched based on ID.
// In a real app, this would come from an API call.
const communityReports = [
    { id: '1', user: "Sanjay Kumar", avatar: 'SK', category: "pothole", title: "Large pothole on NH-37", description: "This dangerous pothole has been causing accidents and traffic jams, especially during rush hour near the bypass. It needs immediate attention before a serious incident occurs.", image: 'https://via.placeholder.com/400x250.png/FF6B6B/FFFFFF?text=Pothole', upvotes: 45, downvotes: 2, location: "NH-37 Bypass, Jorhat", time: "2 hours ago", status: "in-progress" },
    { id: '2', user: "Priya Sharma", avatar: 'PS', category: "garbage", title: "Garbage overflow near market", description: "The garbage bins in the main market area have been overflowing for days. It's becoming a health hazard and attracting stray animals. Regular and timely garbage collection is urgently needed.", image: 'https://via.placeholder.com/400x250.png/4ECDC4/FFFFFF?text=Garbage', upvotes: 32, downvotes: 0, location: "Main Market, Jorhat", time: "5 hours ago", status: "pending" },
    // Add more mock reports if needed
];

// Mock comments with likes for sorting
const MOCK_COMMENTS = [
    { id: 1, user: 'Amit S.', avatar: 'AS', text: 'Totally agree, drove past this yesterday. Very dangerous!', likes: 15, time: '1h ago' },
    { id: 2, user: 'Local Gov', avatar: 'LG', text: 'Thank you for the report. A team has been dispatched to assess the situation.', likes: 8, time: '45m ago' },
    { id: 3, user: 'Rina B.', avatar: 'RB', text: 'My tire got damaged here last week.', likes: 11, time: '2h ago' },
].sort((a, b) => b.likes - a.likes); // Sorting by top likes as requested [cite: 25]


export default function CommunityReportDetailScreen() {
    const { id } = useLocalSearchParams();
    const [report, setReport] = useState(null);
    const [comments, setComments] = useState(MOCK_COMMENTS);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const foundReport = communityReports.find(r => r.id === id);
        setReport(foundReport);
        setLoading(false);
    }, [id]);

    const handlePostComment = () => {
        if (newComment.trim() === '') return;
        const commentToAdd = {
            id: Date.now(),
            user: 'You',
            avatar: 'U',
            text: newComment,
            likes: 0,
            time: 'Just now',
        };
        setComments([commentToAdd, ...comments]);
        setNewComment('');
    };

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#667eea" /></View>;
    }

    if (!report) {
        return <View style={styles.centered}><Text>Report not found.</Text></View>;
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{
                headerTitle: report.title, headerRight: () => (
                    <TouchableOpacity style={{ paddingHorizontal: 10 }}><Ionicons name="share-social-outline" size={24} color="#667eea" /></TouchableOpacity>
                )
            }} />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView>
                    {report.image && <Image source={{ uri: report.image }} style={styles.image} />}
                    <View style={styles.content}>
                        <View style={styles.reportHeader}>
                            <View style={styles.userAvatar}>
                                <Text style={styles.userAvatarText}>{report.avatar}</Text>
                            </View>
                            <View>
                                <Text style={styles.userName}>{report.user}</Text>
                                <Text style={styles.reportTime}>{report.time}</Text>
                            </View>
                        </View>
                        <Text style={styles.title}>{report.title}</Text>
                        <Text style={styles.description}>{report.description}</Text>
                        <View style={styles.locationContainer}>
                            <Ionicons name="location-outline" size={16} color="#999" />
                            <Text style={styles.locationText}>{report.location}</Text>
                        </View>

                        <View style={styles.actionsContainer}>
                            <TouchableOpacity style={styles.actionButton}>
                                <MaterialCommunityIcons name="arrow-up-bold-outline" size={24} color="#4ECDC4" />
                                <Text style={styles.actionText}>{report.upvotes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <MaterialCommunityIcons name="arrow-down-bold-outline" size={24} color="#FF6B6B" />
                                <Text style={styles.actionText}>{report.downvotes}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />

                        <Text style={styles.sectionTitle}>Comments ({comments.length})</Text>
                        {comments.map(comment => (
                            <View key={comment.id} style={styles.commentCard}>
                                <View style={styles.commentAvatar}>
                                    <Text style={styles.commentAvatarText}>{comment.avatar}</Text>
                                </View>
                                <View style={styles.commentBody}>
                                    <View style={styles.commentHeader}>
                                        <Text style={styles.commentUser}>{comment.user}</Text>
                                        <Text style={styles.commentTime}>{comment.time}</Text>
                                    </View>
                                    <Text style={styles.commentText}>{comment.text}</Text>
                                    <TouchableOpacity style={styles.likeButton}>
                                        <Ionicons name="heart-outline" size={16} color="#999" />
                                        <Text style={styles.likeText}>{comment.likes}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
                <View style={styles.commentInputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add a comment..."
                        value={newComment}
                        onChangeText={setNewComment}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handlePostComment}>
                        <Ionicons name="send" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    image: { width: '100%', height: 250, backgroundColor: '#e9ecef' },
    content: { padding: 20 },
    reportHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    userAvatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#667eea', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    userAvatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    userName: { fontWeight: 'bold', fontSize: 16, color: '#2d3436' },
    reportTime: { fontSize: 13, color: '#999' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#2d3436', marginBottom: 8 },
    description: { fontSize: 16, color: '#636e72', lineHeight: 24, marginBottom: 15 },
    locationContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    locationText: { marginLeft: 5, fontSize: 14, color: '#636e72' },
    actionsContainer: { flexDirection: 'row', justifyContent: 'flex-start', gap: 20, marginBottom: 20 },
    actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20 },
    actionText: { marginLeft: 8, fontSize: 16, fontWeight: '600', color: '#2d3436' },
    divider: { height: 1, backgroundColor: '#e9ecef', marginVertical: 10 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2d3436', marginBottom: 15 },
    commentCard: { flexDirection: 'row', marginBottom: 15 },
    commentAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4ECDC4', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    commentAvatarText: { color: '#fff', fontWeight: 'bold' },
    commentBody: { flex: 1, backgroundColor: '#f8f9fa', padding: 12, borderRadius: 12 },
    commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    commentUser: { fontWeight: 'bold', color: '#2d3436' },
    commentTime: { fontSize: 12, color: '#999' },
    commentText: { color: '#636e72', marginBottom: 8 },
    likeButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
    likeText: { marginLeft: 5, fontSize: 13, color: '#636e72' },
    commentInputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#e9ecef', backgroundColor: '#fff' },
    input: { flex: 1, height: 45, backgroundColor: '#f8f9fa', borderRadius: 22.5, paddingHorizontal: 15, marginRight: 10 },
    sendButton: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#667eea', justifyContent: 'center', alignItems: 'center' },
});