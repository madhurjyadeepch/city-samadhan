// mobile/app/(tabs)/home.jsx
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Image,
    Platform,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F7FF" />

            {/* Custom Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Text style={styles.headerTitle}>City Samadhan</Text>
                <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={28} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={[
                    styles.scrollContainer,
                    { paddingBottom: Platform.OS === 'ios' ? 150 : 130 }
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Welcome Card */}
                <View style={styles.welcomeCard}>
                    <Text style={styles.welcomeTitle}>Welcome, John!</Text>
                    <Text style={styles.welcomeText}>
                        This is the central space for community updates. For now, it's a placeholder.
                        You can scroll here to see future content.
                    </Text>
                </View>

                <Text style={styles.placeholderText}>Scrollable Content Area...</Text>

                {/* Add some dummy content to test scrolling */}
                <View style={styles.dummyContent}>
                    {Array.from({ length: 10 }, (_, index) => (
                        <View key={index} style={styles.dummyCard}>
                            <Text style={styles.dummyCardText}>Content Card {index + 1}</Text>
                            <Text style={styles.dummyCardSubtext}>
                                This is some placeholder content to test the scrolling behavior.
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Floating 'Report New Issue' Button */}
            <TouchableOpacity
                style={[
                    styles.fab,
                    {
                        bottom: Platform.OS === 'ios' ? insets.bottom + 95 : 85,
                    }
                ]}
                activeOpacity={0.8}
                onPress={() => router.push("/report-create")}
            >
                <Ionicons name="add" size={32} color="#fff" />
                <Text style={styles.fabText}>Report New Issue</Text>
            </TouchableOpacity>
        </View>
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
        paddingBottom: 10,
        backgroundColor: '#F4F7FF',
    },
    headerTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 24,
        color: '#2d3436',
    },
    scrollContainer: {
        padding: 20,
    },
    welcomeCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
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
        marginTop: 20,
        marginBottom: 20,
    },
    dummyContent: {
        gap: 15,
    },
    dummyCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    dummyCardText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    dummyCardSubtext: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#666',
    },
    fab: {
        position: 'absolute',
        left: '50%',
        marginLeft: -125, // Half of width to center
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