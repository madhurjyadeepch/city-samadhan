// app/(tabs)/community.jsx

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    Share,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";

// Helper function for status colors
const getStatusStyle = (status) => {
    switch (status) {
        case "in-progress": return { backgroundColor: "#fffbe6", color: "#f59e0b" };
        case "resolved": return { backgroundColor: "#f0fdf4", color: "#22c55e" };
        case "pending": default: return { backgroundColor: "#fee2e2", color: "#ef4444" };
    }
};

// Helper to format date as "x hours ago"
const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
};

// Report Card Component
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

    const avatarInitial = item.author?.name?.[0]?.toUpperCase() || "A";

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/community/${item._id}`)}
            activeOpacity={0.9}
        >
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}><Text style={styles.avatarText}>{avatarInitial}</Text></View>
                    <View>
                        <Text style={styles.userName}>{item.author?.name || "Anonymous"}</Text>
                        <Text style={styles.timestamp}>{timeAgo(item.createdAt)}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={onShare} style={styles.shareIcon}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#636e72" />
                </TouchableOpacity>
            </View>
            <Image source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/${item.image}` }} style={styles.cardImage} />
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
                <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`/community/${item._id}`)}>
                    <Ionicons name="chatbubble-outline" size={22} color="#636e72" />
                    <Text style={styles.actionText}>Comment</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default function CommunityScreen() {
    const [reports, setReports] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const response = await api.get('/api/v1/reports/');
            setReports(response.data.data?.reports || []);
        } catch (err) {
            Alert.alert("Error", "Failed to fetch reports.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchReports();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Community Feed</Text>
            </View>
            {loading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#667eea" />
                </View>
            ) : (
                <FlatList
                    data={reports}
                    renderItem={({ item }) => <CommunityReportCard item={item} />}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F7FF' },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 28,
        color: '#2d3436'
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 150,
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
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#e0e7ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        color: '#6A5AE0',
    },
    userName: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        color: '#2d3436',
        // V V V THIS IS THE CHANGED LINE V V V
        lineHeight: 22, // Give the username text enough vertical space
    },
    timestamp: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#636e72',
    },
    shareIcon: {
        padding: 6,
    },
    categoryText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#6A5AE0',
        lineHeight: 20,
    },
    statusBadge: {
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginLeft: 8,
    },
    statusText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 13,
        lineHeight: 16,
        textTransform: 'capitalize'
    },
    cardTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        color: '#2d3436',
        marginBottom: 4,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 6,
        backgroundColor: '#F4F7FF',
        marginRight: 8,
    },
    actionText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        marginLeft: 4,
        lineHeight: 18,
    },
});