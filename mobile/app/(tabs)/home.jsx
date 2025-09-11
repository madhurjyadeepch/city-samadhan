// mobile/app/(tabs)/home.jsx
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "../../context/AuthContext";

export default function HomeScreen() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F7FF" />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.userName}>{user?.name || 'User'}!</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={28} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Main Content Card */}
            <View style={styles.content}>
                <View style={styles.card}>
                    <Image 
                        source={require('../../assets/images/streetlight.png')} // Add a relevant illustration to your assets
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                    <Text style={styles.cardTitle}>See an issue?</Text>
                    <Text style={styles.cardSubtitle}>
                        Help improve your community by reporting problems like potholes or broken streetlights.
                    </Text>
                    <TouchableOpacity
                        style={styles.ctaButton}
                        activeOpacity={0.8}
                        onPress={() => router.push("/report-create")}
                    >
                        <Ionicons name="add-circle" size={24} color="#fff" />
                        <Text style={styles.ctaButtonText}>Report a New Issue</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 20,
    },
    welcomeText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#636e72',
    },
    userName: {
        fontFamily: 'Poppins-Bold',
        fontSize: 26,
        color: '#2d3436',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 30,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#6A5AE0',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
    },
    illustration: {
        width: 200,
        height: 150,
        marginBottom: 20,
    },
    cardTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 22,
        color: '#333',
        marginBottom: 10,
    },
    cardSubtitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },
    ctaButton: {
        backgroundColor: '#6A5AE0',
        borderRadius: 30,
        paddingVertical: 18,
        paddingHorizontal: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    ctaButtonText: {
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        marginLeft: 10,
    },
});