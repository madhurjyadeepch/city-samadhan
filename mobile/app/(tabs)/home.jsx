// app/(tabs)/home.jsx

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";

export default function HomeScreen() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // In the future, you can add logic here to fetch new data or announcements
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Welcome!</Text>
                    <Text style={styles.headerSubtitle}>
                        Report local issues and help improve our community.
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.reportButton}
                    activeOpacity={0.8}
                    onPress={() => router.push("/report-create")}
                >
                    <LinearGradient
                        colors={["#667eea", "#764ba2"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.reportButtonGradient}
                    >
                        <Ionicons name="add-circle-outline" size={48} color="#fff" />
                        <View>
                            <Text style={styles.reportButtonTitle}>Report a New Issue</Text>
                            <Text style={styles.reportButtonSubtitle}>
                                Let's make our city better, together.
                            </Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.infoSection}>
                    <Ionicons name="information-circle-outline" size={24} color="#667eea" />
                    <Text style={styles.infoText}>Pull down to refresh the application.</Text>
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
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        justifyContent: "center",
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#2d3436",
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#636e72",
        marginTop: 8,
        textAlign: "center",
    },
    reportButton: {
        borderRadius: 20,
        shadowColor: "#667eea",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 12,
    },
    reportButtonGradient: {
        paddingVertical: 30,
        paddingHorizontal: 25,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
    },
    reportButtonTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    reportButtonSubtitle: {
        fontSize: 14,
        color: "#fff",
        opacity: 0.9,
        marginTop: 4,
    },
    infoSection: {
        marginTop: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#999',
    }
});