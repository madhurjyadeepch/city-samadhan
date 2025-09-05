import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Switch } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen() {
    const profileData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+91 98765 43210",
        joinDate: "Member since Jan 2024",
        points: 1650,
        rank: 4,
        reportsCount: 24,
        resolvedCount: 18,
        badges: ["Early Adopter", "Active Reporter", "Community Helper"],
    };

    const menuSections = [
        {
            title: "Account Settings",
            items: [
                { icon: "person-outline", label: "Edit Profile", color: "#667eea" },
                { icon: "notifications-outline", label: "Notifications", color: "#4ECDC4", hasToggle: true },
                { icon: "lock-closed-outline", label: "Privacy & Security", color: "#FF6B6B" },
                { icon: "language-outline", label: "Language", color: "#FFD93D", value: "English" },
            ]
        },
        {
            title: "Activity",
            items: [
                { icon: "trophy-outline", label: "Achievements", color: "#FFD93D" },
                { icon: "ribbon-outline", label: "Badges", color: "#6C5CE7" },
                { icon: "stats-chart-outline", label: "Statistics", color: "#4ECDC4" },
                { icon: "time-outline", label: "Activity History", color: "#A8E6CF" },
            ]
        },
        {
            title: "Support",
            items: [
                { icon: "help-circle-outline", label: "Help Center", color: "#45B7D1" },
                { icon: "chatbubbles-outline", label: "Contact Support", color: "#667eea" },
                { icon: "document-text-outline", label: "Terms & Conditions", color: "#636e72" },
                { icon: "shield-checkmark-outline", label: "Privacy Policy", color: "#636e72" },
            ]
        },
        {
            title: "Others",
            items: [
                { icon: "star-outline", label: "Rate App", color: "#FFD93D" },
                { icon: "share-social-outline", label: "Share App", color: "#4ECDC4" },
                { icon: "information-circle-outline", label: "About", color: "#667eea" },
                { icon: "log-out-outline", label: "Logout", color: "#FF6B6B" },
            ]
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <LinearGradient
                colors={["#667eea", "#764ba2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={["#4ECDC4", "#44A3AA"]}
                            style={styles.avatar}
                        >
                            <Text style={styles.avatarText}>JD</Text>
                        </LinearGradient>
                        <TouchableOpacity style={styles.editAvatarBtn}>
                            <Ionicons name="camera" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{profileData.name}</Text>
                        <Text style={styles.profileEmail}>{profileData.email}</Text>
                        <Text style={styles.profileJoinDate}>{profileData.joinDate}</Text>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{profileData.points}</Text>
                        <Text style={styles.statLabel}>Points</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>#{profileData.rank}</Text>
                        <Text style={styles.statLabel}>Rank</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{profileData.reportsCount}</Text>
                        <Text style={styles.statLabel}>Reports</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{profileData.resolvedCount}</Text>
                        <Text style={styles.statLabel}>Resolved</Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                {/* Badges Section */}
                <View style={styles.badgesSection}>
                    <Text style={styles.badgesTitle}>Your Badges</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {profileData.badges.map((badge, index) => (
                            <View key={index} style={styles.badge}>
                                <LinearGradient
                                    colors={["#FFD93D", "#FFA000"]}
                                    style={styles.badgeIcon}
                                >
                                    <FontAwesome5 name="award" size={20} color="#fff" />
                                </LinearGradient>
                                <Text style={styles.badgeText}>{badge}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Menu Sections */}
                {menuSections.map((section, sectionIndex) => (
                    <View key={sectionIndex} style={styles.menuSection}>
                        <Text style={styles.menuSectionTitle}>{section.title}</Text>
                        <View style={styles.menuCard}>
                            {section.items.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.menuItem,
                                        index === section.items.length - 1 && styles.menuItemLast
                                    ]}
                                >
                                    <View style={styles.menuItemLeft}>
                                        <View style={[styles.menuIconContainer, { backgroundColor: item.color + "20" }]}>
                                            <Ionicons name={item.icon} size={20} color={item.color} />
                                        </View>
                                        <Text style={styles.menuItemText}>{item.label}</Text>
                                    </View>
                                    <View style={styles.menuItemRight}>
                                        {item.value && (
                                            <Text style={styles.menuItemValue}>{item.value}</Text>
                                        )}
                                        {item.hasToggle ? (
                                            <Switch
                                                value={true}
                                                onValueChange={() => { }}
                                                trackColor={{ false: "#ddd", true: "#667eea" }}
                                                thumbColor="#fff"
                                            />
                                        ) : (
                                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>Version 1.0.0</Text>
                    <Text style={styles.copyrightText}>© 2025 Civic Report App</Text>
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
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 25,
    },
    avatarContainer: {
        position: "relative",
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "rgba(255,255,255,0.3)",
    },
    avatarText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
    },
    editAvatarBtn: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#667eea",
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#fff",
    },
    profileInfo: {
        flex: 1,
        marginLeft: 20,
    },
    profileName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: "#fff",
        opacity: 0.9,
        marginBottom: 2,
    },
    profileJoinDate: {
        fontSize: 12,
        color: "#fff",
        opacity: 0.7,
    },
    statsContainer: {
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 12,
        padding: 15,
    },
    statBox: {
        flex: 1,
        alignItems: "center",
    },
    statValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: "#fff",
        opacity: 0.9,
    },
    statDivider: {
        width: 1,
        height: 35,
        backgroundColor: "rgba(255,255,255,0.3)",
        marginHorizontal: 10,
    },
    content: {
        flex: 1,
    },
    badgesSection: {
        padding: 20,
        paddingBottom: 10,
    },
    badgesTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2d3436",
        marginBottom: 15,
    },
    badge: {
        alignItems: "center",
        marginRight: 20,
    },
    badgeIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    badgeText: {
        fontSize: 11,
        color: "#636e72",
        textAlign: "center",
        width: 80,
    },
    menuSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    menuSectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#636e72",
        marginBottom: 10,
        marginLeft: 5,
    },
    menuCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        overflow: "hidden",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    menuItemLast: {
        borderBottomWidth: 0,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    menuItemText: {
        fontSize: 15,
        color: "#2d3436",
        fontWeight: "500",
    },
    menuItemRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    menuItemValue: {
        fontSize: 14,
        color: "#999",
        marginRight: 10,
    },
    versionContainer: {
        alignItems: "center",
        paddingVertical: 30,
    },
    versionText: {
        fontSize: 12,
        color: "#999",
        marginBottom: 4,
    },
    copyrightText: {
        fontSize: 12,
        color: "#bbb",
    },
});