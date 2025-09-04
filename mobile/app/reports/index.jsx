import { useEffect, useState, useCallback } from "react";
import { ScrollView } from "react-native";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Image, SafeAreaView, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";

export default function Reports() {
    const [reports, setReports] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState("all");

    const loadReports = async () => {
        try {
            const stored = await AsyncStorage.getItem("reports");
            if (stored) setReports(JSON.parse(stored).reverse());
        } catch (e) {
            setReports([]);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadReports();
        setRefreshing(false);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "resolved": return "#4ECDC4";
            case "in-progress": return "#FFD93D";
            default: return "#FF6B6B";
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "pothole": return "road";
            case "garbage": return "trash";
            case "streetlight": return "bulb";
            case "drainage": return "water";
            case "traffic": return "car";
            case "parks": return "leaf";
            default: return "alert-circle";
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case "pothole": return "#FF6B6B";
            case "garbage": return "#4ECDC4";
            case "streetlight": return "#FFD93D";
            case "drainage": return "#45B7D1";
            case "traffic": return "#6C5CE7";
            case "parks": return "#A8E6CF";
            default: return "#999";
        }
    };

    const filters = [
        { id: "all", label: "All Reports", count: reports.length },
        { id: "pending", label: "Pending", count: reports.filter(r => !r.status || r.status === "pending").length },
        { id: "resolved", label: "Resolved", count: reports.filter(r => r.status === "resolved").length },
    ];

    const filteredReports = reports.filter(report => {
        if (filter === "all") return true;
        if (filter === "pending") return !report.status || report.status === "pending";
        if (filter === "resolved") return report.status === "resolved";
        return true;
    });

    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.95}>
            <View style={styles.cardHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + "20" }]}>
                    <Ionicons name={getCategoryIcon(item.category)} size={16} color={getCategoryColor(item.category)} />
                    <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
                        {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : "General"}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status || "pending") + "20" }]}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status || "pending") }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(item.status || "pending") }]}>
                        {item.status || "Pending"}
                    </Text>
                </View>
            </View>

            {item.image && (
                <Image source={{ uri: item.image }} style={styles.reportImage} />
            )}

            <Text style={styles.description} numberOfLines={3}>{item.description}</Text>

            <View style={styles.cardFooter}>
                <View style={styles.locationContainer}>
                    <Ionicons name="location" size={16} color="#667eea" />
                    <Text style={styles.address} numberOfLines={1}>{item.address || "Location not specified"}</Text>
                </View>

                {item.location && (
                    <TouchableOpacity
                        style={styles.mapButton}
                        onPress={() =>
                            Linking.openURL(
                                `https://www.google.com/maps?q=${item.location.latitude},${item.location.longitude}`
                            )
                        }
                    >
                        <MaterialCommunityIcons name="map-marker-radius" size={20} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.cardMeta}>
                <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color="#999" />
                    <Text style={styles.timestamp}>{item.createdAt}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.reportId}>ID: #{item.id.slice(-6)}</Text>
                </View>
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="share-social-outline" size={20} color="#667eea" />
                    <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="chatbubble-outline" size={20} color="#667eea" />
                    <Text style={styles.actionText}>Updates</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
                    <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                    <Text style={[styles.actionText, { color: "#FF6B6B" }]}>Delete</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <LinearGradient
                colors={["#667eea", "#764ba2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>My Reports</Text>
                <Text style={styles.headerSubtitle}>Track your civic contributions</Text>
            </LinearGradient>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {filters.map((f) => (
                        <TouchableOpacity
                            key={f.id}
                            style={[styles.filterButton, filter === f.id && styles.filterActive]}
                            onPress={() => setFilter(f.id)}
                        >
                            <Text style={[styles.filterText, filter === f.id && styles.filterTextActive]}>
                                {f.label}
                            </Text>
                            <View style={[styles.filterCount, filter === f.id && styles.filterCountActive]}>
                                <Text style={[styles.filterCountText, filter === f.id && styles.filterCountTextActive]}>
                                    {f.count}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {filteredReports.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIcon}>
                        <Ionicons name="document-text-outline" size={60} color="#ccc" />
                    </View>
                    <Text style={styles.emptyTitle}>No reports yet</Text>
                    <Text style={styles.emptyText}>Your reported issues will appear here</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredReports}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["#667eea"]}
                            tintColor="#667eea"
                        />
                    }
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
    },
    filterContainer: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "#f8f9fa",
        marginRight: 10,
    },
    filterActive: {
        backgroundColor: "#667eea",
    },
    filterText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#636e72",
    },
    filterTextActive: {
        color: "#fff",
    },
    filterCount: {
        marginLeft: 8,
        backgroundColor: "#fff",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    filterCountActive: {
        backgroundColor: "rgba(255,255,255,0.3)",
    },
    filterCountText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#667eea",
    },
    filterCountTextActive: {
        color: "#fff",
    },
    listContent: {
        padding: 20,
        paddingBottom: 30,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        overflow: "hidden",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        paddingBottom: 10,
    },
    categoryBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: "600",
        marginLeft: 5,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 5,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
        textTransform: "capitalize",
    },
    reportImage: {
        width: "100%",
        height: 200,
        backgroundColor: "#f0f0f0",
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        color: "#2d3436",
        padding: 15,
        paddingBottom: 10,
    },
    cardFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    address: {
        fontSize: 13,
        color: "#636e72",
        marginLeft: 5,
        flex: 1,
    },
    mapButton: {
        backgroundColor: "#667eea",
        padding: 8,
        borderRadius: 8,
        marginLeft: 10,
    },
    cardMeta: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    timestamp: {
        fontSize: 12,
        color: "#999",
        marginLeft: 5,
    },
    reportId: {
        fontSize: 12,
        color: "#999",
        fontFamily: "monospace",
    },
    cardActions: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    actionText: {
        fontSize: 13,
        color: "#667eea",
        marginLeft: 5,
        fontWeight: "500",
    },
    deleteButton: {
        opacity: 0.8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    emptyIcon: {
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#2d3436",
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
    },
});