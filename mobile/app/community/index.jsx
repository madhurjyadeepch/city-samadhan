import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function CommunityScreen() {
    const communityReports = [
        {
            id: 1,
            user: "Raj Kumar",
            avatar: null,
            category: "pothole",
            title: "Large pothole on NH-37",
            description: "Dangerous pothole causing accidents near the bypass",
            image: null,
            likes: 45,
            comments: 12,
            location: "NH-37 Bypass, Jorhat",
            time: "2 hours ago",
            status: "in-progress",
            verified: true,
        },
        {
            id: 2,
            user: "Priya Sharma",
            avatar: null,
            category: "garbage",
            title: "Garbage overflow near market",
            description: "Regular garbage collection needed in the main market area",
            image: null,
            likes: 32,
            comments: 8,
            location: "Main Market, Jorhat",
            time: "5 hours ago",
            status: "pending",
            verified: false,
        },
        {
            id: 3,
            user: "Municipal Corporation",
            avatar: null,
            category: "announcement",
            title: "Road repair work scheduled",
            description: "MG Road will be under repair from Monday to Wednesday. Please use alternative routes.",
            image: null,
            likes: 128,
            comments: 24,
            location: "MG Road, Jorhat",
            time: "1 day ago",
            status: "announcement",
            verified: true,
            official: true,
        },
    ];

    const leaderboard = [
        { rank: 1, name: "Amit Singh", points: 2450, badge: "gold" },
        { rank: 2, name: "Priya Sharma", points: 2100, badge: "silver" },
        { rank: 3, name: "Raj Kumar", points: 1850, badge: "bronze" },
        { rank: 4, name: "You", points: 1650, badge: null, isUser: true },
    ];

    const getCategoryIcon = (category) => {
        switch (category) {
            case "pothole": return "road";
            case "garbage": return "trash";
            case "streetlight": return "bulb";
            case "announcement": return "megaphone";
            default: return "alert-circle";
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case "pothole": return "#FF6B6B";
            case "garbage": return "#4ECDC4";
            case "streetlight": return "#FFD93D";
            case "announcement": return "#667eea";
            default: return "#999";
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <LinearGradient
                colors={["#667eea", "#764ba2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Community</Text>
                <Text style={styles.headerSubtitle}>Together we make Jorhat better</Text>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>2.4K</Text>
                        <Text style={styles.statLabel}>Members</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>486</Text>
                        <Text style={styles.statLabel}>Issues Resolved</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>92%</Text>
                        <Text style={styles.statLabel}>Success Rate</Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Leaderboard Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Top Contributors</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAll}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {leaderboard.map((user) => (
                            <TouchableOpacity
                                key={user.rank}
                                style={[styles.leaderCard, user.isUser && styles.userCard]}
                            >
                                <View style={styles.rankBadge}>
                                    {user.badge === "gold" && <Ionicons name="trophy" size={20} color="#FFD700" />}
                                    {user.badge === "silver" && <Ionicons name="trophy" size={20} color="#C0C0C0" />}
                                    {user.badge === "bronze" && <Ionicons name="trophy" size={20} color="#CD7F32" />}
                                    {!user.badge && <Text style={styles.rankNumber}>#{user.rank}</Text>}
                                </View>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                                </View>
                                <Text style={styles.leaderName} numberOfLines={1}>{user.name}</Text>
                                <Text style={styles.leaderPoints}>{user.points} pts</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Community Feed */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Community Feed</Text>

                    {communityReports.map((report) => (
                        <TouchableOpacity key={report.id} style={styles.feedCard}>
                            <View style={styles.feedHeader}>
                                <View style={styles.userInfo}>
                                    <View style={[styles.userAvatar, report.official && styles.officialAvatar]}>
                                        <Text style={styles.userAvatarText}>
                                            {report.official ? "MC" : report.user.charAt(0)}
                                        </Text>
                                    </View>
                                    <View style={styles.userMeta}>
                                        <View style={styles.userNameRow}>
                                            <Text style={styles.userName}>{report.user}</Text>
                                            {report.verified && (
                                                <MaterialCommunityIcons name="check-circle" size={16} color="#667eea" style={styles.verifiedIcon} />
                                            )}
                                            {report.official && (
                                                <View style={styles.officialBadge}>
                                                    <Text style={styles.officialText}>Official</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.reportTime}>{report.time}</Text>
                                    </View>
                                </View>
                                <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(report.category) + "20" }]}>
                                    {report.category === "pothole" && <FontAwesome5 name="road" size={16} color={getCategoryColor(report.category)} />}
                                    {report.category === "garbage" && <Ionicons name="trash" size={16} color={getCategoryColor(report.category)} />}
                                    {report.category === "announcement" && <Ionicons name="megaphone" size={16} color={getCategoryColor(report.category)} />}
                                </View>
                            </View>

                            <Text style={styles.feedTitle}>{report.title}</Text>
                            <Text style={styles.feedDescription} numberOfLines={2}>{report.description}</Text>

                            <View style={styles.feedLocation}>
                                <Ionicons name="location-outline" size={14} color="#999" />
                                <Text style={styles.feedLocationText}>{report.location}</Text>
                            </View>

                            <View style={styles.feedActions}>
                                <TouchableOpacity style={styles.actionBtn}>
                                    <Ionicons name="heart-outline" size={20} color="#666" />
                                    <Text style={styles.actionCount}>{report.likes}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionBtn}>
                                    <Ionicons name="chatbubble-outline" size={20} color="#666" />
                                    <Text style={styles.actionCount}>{report.comments}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionBtn}>
                                    <Ionicons name="share-social-outline" size={20} color="#666" />
                                </TouchableOpacity>
                                <View style={styles.statusChip}>
                                    <Text style={[styles.statusChipText, {
                                        color:
                                            report.status === "in-progress" ? "#FFD93D" :
                                                report.status === "announcement" ? "#667eea" : "#FF6B6B"
                                    }]}>
                                        {report.status === "in-progress" ? "In Progress" :
                                            report.status === "announcement" ? "Announcement" : "Pending"}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActionsCard}>
                    <LinearGradient
                        colors={["#4ECDC4", "#44A3AA"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.quickActionsGradient}
                    >
                        <MaterialCommunityIcons name="handshake" size={32} color="#fff" />
                        <View style={styles.quickActionsContent}>
                            <Text style={styles.quickActionsTitle}>Join Local Initiative</Text>
                            <Text style={styles.quickActionsText}>Participate in community cleanup drive this weekend</Text>
                        </View>
                        <Ionicons name="arrow-forward-circle" size={28} color="#fff" />
                    </LinearGradient>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    header: {
        paddingTop: 20,
        paddingBottom: 25,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: "#fff",
        opacity: 0.9,
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 12,
        padding: 15,
    },
    statItem: {
        alignItems: "center",
        flex: 1,
    },
    statNumber: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },
    statLabel: {
        fontSize: 11,
        color: "#fff",
        opacity: 0.9,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: "rgba(255,255,255,0.3)",
        marginHorizontal: 15,
    },
    section: {
        padding: 20,
        paddingBottom: 0,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2d3436",
    },
    viewAll: {
        fontSize: 14,
        color: "#667eea",
        fontWeight: "600",
    },
    leaderCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginRight: 12,
        alignItems: "center",
        width: 100,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    userCard: {
        borderWidth: 2,
        borderColor: "#667eea",
    },
    rankBadge: {
        marginBottom: 10,
    },
    rankNumber: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#666",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#667eea",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    leaderName: {
        fontSize: 13,
        fontWeight: "600",
        color: "#2d3436",
        marginBottom: 4,
    },
    leaderPoints: {
        fontSize: 12,
        color: "#999",
    },
    feedCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    feedHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: "row",
        flex: 1,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#667eea",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    officialAvatar: {
        backgroundColor: "#4ECDC4",
    },
    userAvatarText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    userMeta: {
        flex: 1,
    },
    userNameRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    userName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#2d3436",
    },
    verifiedIcon: {
        marginLeft: 4,
    },
    officialBadge: {
        backgroundColor: "#4ECDC4",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 8,
    },
    officialText: {
        fontSize: 10,
        fontWeight: "600",
        color: "#fff",
    },
    reportTime: {
        fontSize: 12,
        color: "#999",
        marginTop: 2,
    },
    categoryIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    feedTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2d3436",
        marginBottom: 6,
    },
    feedDescription: {
        fontSize: 14,
        color: "#636e72",
        lineHeight: 20,
        marginBottom: 10,
    },
    feedLocation: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    feedLocationText: {
        fontSize: 12,
        color: "#999",
        marginLeft: 4,
    },
    feedActions: {
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
        paddingTop: 12,
    },
    actionBtn: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
    },
    actionCount: {
        fontSize: 13,
        color: "#666",
        marginLeft: 5,
    },
    statusChip: {
        marginLeft: "auto",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: "#f8f9fa",
    },
    statusChipText: {
        fontSize: 11,
        fontWeight: "600",
    },
    quickActionsCard: {
        margin: 20,
        marginBottom: 30,
        borderRadius: 15,
        overflow: "hidden",
    },
    quickActionsGradient: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
    },
    quickActionsContent: {
        flex: 1,
        marginHorizontal: 15,
    },
    quickActionsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 4,
    },
    quickActionsText: {
        fontSize: 13,
        color: "#fff",
        opacity: 0.9,
    },
});