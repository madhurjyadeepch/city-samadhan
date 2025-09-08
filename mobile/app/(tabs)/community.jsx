import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    RefreshControl,
    Share,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Helper function for status colors
const getStatusStyle = (status) => {
    switch (status) {
        case "in-progress": return { backgroundColor: "#fffbe6", color: "#f59e0b" };
        case "done":
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

    // Use first letter of category as avatar if no user info
    const avatarInitial = item.category?.[0]?.toUpperCase() || "U";

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
                        <Text style={styles.userName}>{item.author || "Anonymous"}</Text>
                        <Text style={styles.timestamp}>{timeAgo(item.createdAt)}</Text>
                    </View>
                </View>
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
            const res = await fetch("http://192.168.43.147:3000/api/v1/reports/");
            const json = await res.json();
            setReports(json.data?.reports || []);
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

// Styles are almost identical to My Reports for consistency
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
        paddingBottom: 120,
    },
});
