// app/(tabs)/community.jsx

import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Image,
    RefreshControl,
    Share,
    Alert,
} from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Mock data for community reports
const mockCommunityReports = [
    {
        id: "comm_1",
        user: "Jane Doe",
        avatarInitial: "J",
        category: "Pothole",
        status: "in-progress",
        title: "Dangerous pothole on Main Street",
        description: "A large pothole near the intersection is causing issues for traffic. Multiple cars have been damaged.",
        image: "https://plus.unsplash.com/premium_photo-1672883551999-9512f308b3e3?q=80&w=2070", // Placeholder Image URL
        address: "123 Main St, Anytown",
        upvotes: 121,
        downvotes: 5,
        createdAt: "2 hours ago",
    },
    {
        id: "comm_2",
        user: "John Smith",
        avatarInitial: "J",
        category: "Garbage",
        status: "pending",
        title: "Overflowing bins at City Park",
        description: "The garbage bins at the park entrance haven't been emptied for a week and are attracting pests.",
        image: "https://images.unsplash.com/photo-1604191316191-b3b841249b65?q=80&w=1974", // Placeholder Image URL
        address: "City Park, Anytown",
        upvotes: 98,
        downvotes: 2,
        createdAt: "1 day ago",
    },
];

// Helper function for status colors
const getStatusStyle = (status) => {
    switch (status) {
        case "in-progress": return { backgroundColor: "#fffbe6", color: "#f59e0b" };
        case "done": return { backgroundColor: "#f0fdf4", color: "#22c55e" };
        case "pending": default: return { backgroundColor: "#fee2e2", color: "#ef4444" };
    }
};

// Report Card Component with interactive voting
const CommunityReportCard = ({ item }) => {
    const router = useRouter();
    const [upvotes, setUpvotes] = useState(item.upvotes);
    const [downvotes, setDownvotes] = useState(item.downvotes);

    const onShare = async () => {
        try {
            await Share.share({
                message: `Check out this issue on the Civic Reporting App: ${item.title} at ${item.address}`,
            });
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/community/${item.id}`)} // Navigate to detail page
            activeOpacity={0.9}
        >
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}><Text style={styles.avatarText}>{item.avatarInitial}</Text></View>
                    <View>
                        <Text style={styles.userName}>{item.user}</Text>
                        <Text style={styles.timestamp}>{item.createdAt}</Text>
                    </View>
                </View>
                {/* Three-dot menu for Share */}
                <TouchableOpacity onPress={onShare} style={styles.shareIcon}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#636e72" />
                </TouchableOpacity>
            </View>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusStyle(item.status).backgroundColor }]}>
                        <Text style={[styles.statusText, { color: getStatusStyle(item.status).color }]}>{item.status}</Text>
                    </View>
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
            <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => setUpvotes(upvotes + 1)}>
                    <Ionicons name="arrow-up-circle-outline" size={24} color="#22c55e" />
                    <Text style={styles.actionText}>{upvotes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => setDownvotes(downvotes + 1)}>
                    <Ionicons name="arrow-down-circle-outline" size={24} color="#ef4444" />
                    <Text style={styles.actionText}>{downvotes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`/community/${item.id}`)}>
                    <Ionicons name="chatbubble-outline" size={22} color="#636e72" />
                    <Text style={styles.actionText}>Comment</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};


export default function CommunityScreen() {
    const [reports, setReports] = useState(mockCommunityReports);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // In a real app, you would fetch new data from an API here
        setTimeout(() => {
            setReports([...mockCommunityReports].reverse()); // Simulate new data
            setRefreshing(false);
        }, 1500);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Community Feed</Text>
            </View>
            <FlatList
                data={reports}
                renderItem={({ item }) => <CommunityReportCard item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10 },
    userInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#667eea', justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    userName: { fontWeight: 'bold', color: '#2d3436' },
    timestamp: { color: '#999', fontSize: 12 },
    shareIcon: { padding: 5 },
    cardImage: { width: '100%', height: 200 },
    cardContent: { padding: 15, paddingTop: 5 },
    categoryText: { fontWeight: 'bold', color: '#667eea', textTransform: 'uppercase', fontSize: 12 },
    statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
    statusText: { fontWeight: '600', fontSize: 12, textTransform: 'capitalize' },
    cardTitle: { fontSize: 18, fontWeight: '600', color: '#2d3436', marginTop: 10 },
    cardActions: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingVertical: 10 },
    actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    actionText: { fontWeight: '600', fontSize: 14, color: '#636e72' },
});