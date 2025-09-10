import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Mock data to simulate fetching a specific report
const mockCommunityReports = [
    {
        id: "comm_1",
        user: "Jane Doe",
        avatarInitial: "J",
        category: "Pothole",
        status: "in-progress",
        title: "Dangerous pothole on Main Street",
        description: "A large pothole near the intersection...",
        image: "https://plus.unsplash.com/premium_photo-1672883551999-9512f308b3e3?q=80&w=2070",
        address: "123 Main St, Anytown",
        upvotes: 152,
        downvotes: 5,
        createdAt: "3 hours ago",
    },
    {
        id: "comm_2",
        user: "Robert Chen",
        avatarInitial: "R",
        category: "Garbage",
        status: "pending",
        title: "Overflowing garbage cans at City Park",
        description: "The garbage bins at the park entrance...",
        image: "https://images.unsplash.com/photo-1604191316191-b3b841249b65?q=80&w=1974",
        address: "City Park, Anytown",
        upvotes: 98,
        downvotes: 2,
        createdAt: "1 day ago",
    },
];

const Comment = ({ comment }) => {
    const [liked, setLiked] = useState(false);
    return (
        <View style={styles.commentContainer}>
            <View style={styles.commentAvatar}>
                <Text style={styles.commentAvatarText}>
                    {comment.user[0]}
                </Text>
            </View>
            <View style={styles.commentBody}>
                <Text style={styles.commentUser}>{comment.user}</Text>
                <Text style={styles.commentText}>{comment.text}</Text>
            </View>
            <TouchableOpacity onPress={() => setLiked(!liked)}>
                <Ionicons
                    name={liked ? "heart" : "heart-outline"}
                    size={20}
                    color={liked ? "#E91E63" : "#999"}
                />
            </TouchableOpacity>
        </View>
    );
};

export default function CommunityReportDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [report, setReport] = useState(null);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const foundReport = mockCommunityReports.find((r) => r.id === id);
        setReport(foundReport);
    }, [id]);

    if (!report) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading report...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.headerButton}
                >
                    <Ionicons name="chevron-down" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Community Report</Text>
                <TouchableOpacity style={styles.headerButton}>
                    <Ionicons name="share-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContainer,
                        { paddingBottom: insets.bottom + 80 },
                    ]}
                >
                    <Image
                        source={{ uri: report.image }}
                        style={styles.reportImage}
                    />
                    <View style={styles.content}>
                        <Text style={styles.categoryTag}>
                            {report.category}
                        </Text>
                        <Text style={styles.title}>{report.title}</Text>
                        <View style={styles.userInfo}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {report.avatarInitial}
                                </Text>
                            </View>
                            <Text style={styles.userName}>{report.user}</Text>
                            <Text style={styles.timestamp}>
                                • {report.createdAt}
                            </Text>
                        </View>
                        <Text style={styles.description}>
                            {report.description}
                        </Text>
                        <View style={styles.voteContainer}>
                            <TouchableOpacity style={styles.voteButton}>
                                <Ionicons
                                    name="arrow-up-outline"
                                    size={22}
                                    color="#16A34A"
                                />
                                <Text style={styles.voteText}>
                                    {report.upvotes}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.voteButton}>
                                <Ionicons
                                    name="arrow-down-outline"
                                    size={22}
                                    color="#DC2626"
                                />
                                <Text style={styles.voteText}>
                                    {report.downvotes}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.commentsSection}>
                            <Text style={styles.sectionTitle}>
                                Comments (3)
                            </Text>
                            <Comment
                                comment={{
                                    user: "Alice",
                                    text: "I saw this yesterday, it's very dangerous!",
                                }}
                            />
                            <Comment
                                comment={{
                                    user: "Bob",
                                    text: "Hope the authorities fix this soon.",
                                }}
                            />
                            <Comment
                                comment={{
                                    user: "Charlie",
                                    text: "Thanks for reporting this.",
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>
                <View
                    style={[
                        styles.commentInputContainer,
                        { paddingBottom: insets.bottom },
                    ]}
                >
                    <TextInput
                        placeholder="Add a comment..."
                        style={styles.commentInput}
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity style={styles.sendButton}>
                        <Ionicons name="send" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    headerButton: { padding: 5, width: 40, alignItems: "center" },
    headerTitle: { fontFamily: "Poppins-SemiBold", fontSize: 16 },
    scrollContainer: { paddingBottom: 100 },
    reportImage: { width: "100%", height: 250 },
    content: { padding: 20 },
    categoryTag: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 12,
        color: "#6A5AE0",
        backgroundColor: "#F0EEFF",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignSelf: "flex-start",
        marginBottom: 12,
        overflow: "hidden",
    },
    title: {
        fontFamily: "Poppins-Bold",
        fontSize: 24,
        color: "#2d3436",
        marginBottom: 8,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#6A5AE0",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    avatarText: { color: "#fff", fontFamily: "Poppins-Bold", fontSize: 12 },
    userName: { fontFamily: "Poppins-SemiBold", color: "#333" },
    timestamp: {
        fontFamily: "Poppins-Regular",
        color: "#999",
        marginLeft: 5,
    },
    description: {
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        color: "#636e72",
        lineHeight: 24,
        marginBottom: 20,
    },
    voteContainer: { flexDirection: "row", gap: 20, marginBottom: 20 },
    voteButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#F4F7FF",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    voteText: { fontFamily: "Poppins-SemiBold" },
    commentsSection: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
        paddingTop: 20,
    },
    sectionTitle: {
        fontFamily: "Poppins-Bold",
        fontSize: 18,
        marginBottom: 15,
    },
    commentContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 15,
    },
    commentAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#EAEBEE",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    commentAvatarText: { fontFamily: "Poppins-Bold", color: "#666" },
    commentBody: {
        flex: 1,
        backgroundColor: "#F9F9F9",
        padding: 10,
        borderRadius: 10,
    },
    commentUser: { fontFamily: "Poppins-SemiBold", marginBottom: 2 },
    commentText: { fontFamily: "Poppins-Regular", color: "#555" },
    commentInputContainer: {
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: "#EAEBEE",
        backgroundColor: "#fff",
        alignItems: "center",
    },
    commentInput: {
        flex: 1,
        backgroundColor: "#F4F7FF",
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontFamily: "Poppins-Regular",
    },
    sendButton: {
        marginLeft: 10,
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: "#6A5AE0",
        justifyContent: "center",
        alignItems: "center",
    },
});