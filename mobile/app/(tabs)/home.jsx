// app/(tabs)/home.jsx

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
// 1. IMPORT SafeAreaView from the recommended library
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        // 2. WRAP the entire screen in SafeAreaView
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Custom Header is now safely inside */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>City Samadhan</Text>
                <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={28} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.welcomeCard}>
                    <Text style={styles.welcomeTitle}>Welcome, {user?.name || 'User'}!</Text>
                    <Text style={styles.welcomeText}>
                        This is the central space for community updates. For now, it's a placeholder.
                        You can scroll here to see future content.
                    </Text>
                </View>
                <Text style={styles.placeholderText}>Scrollable Content Area...</Text>
                <View style={{ height: 500 }} />
            </ScrollView>

            {/* Floating 'Report New Issue' Button */}
            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.8}
                onPress={() => router.push("/report-create")}
            >
                <Ionicons name="add" size={32} color="#fff" />
                <Text style={styles.fabText}>Report New Issue</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F7FF",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        // 3. REMOVE paddingTop. SafeAreaView handles this now.
        paddingBottom: 10,
    },
    headerTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 24,
        color: '#2d3436',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 120,
    },
    welcomeCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
    },
    welcomeTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        color: '#333'
    },
    welcomeText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        lineHeight: 24,
    },
    placeholderText: {
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
        fontSize: 18,
        color: '#aaa',
        marginTop: 40,
    },
    fab: {
        position: 'absolute',
        bottom: 110,
        left: '50%',
        marginLeft: -125,
        width: 250,
        height: 60,
        backgroundColor: '#6A5AE0',
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6A5AE0',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    fabText: {
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        marginLeft: 8,
    },
});