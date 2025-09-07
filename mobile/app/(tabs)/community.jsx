// app/(tabs)/community.jsx

import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    RefreshControl,
} from "react-native";
import { useState, useCallback } from "react";
import ReportCard from '../../components/ReportCard'; // Import the new component

// Using the same mock data structure as before
const mockCommunityReports = [
    {
        id: "comm_1", user: "Jane Doe", avatarInitial: "J", category: "Pothole", status: "in-progress",
        title: "Dangerous pothole on Main Street",
        description: "A large pothole near the intersection is causing issues for traffic. Multiple cars have been damaged.",
        image: "https://plus.unsplash.com/premium_photo-1672883551999-9512f308b3e3?q=80&w=2070",
        address: "123 Main St, Anytown", upvotes: 121, downvotes: 5, createdAt: "2 hours ago",
    },
    {
        id: "comm_2", user: "John Smith", avatarInitial: "J", category: "Garbage", status: "pending",
        title: "Overflowing bins at City Park",
        description: "The garbage bins at the park entrance haven't been emptied for a week and are attracting pests.",
        image: "https://images.unsplash.com/photo-1604191316191-b3b841249b65?q=80&w=1974",
        address: "City Park, Anytown", upvotes: 98, downvotes: 2, createdAt: "1 day ago",
    },
];

export default function CommunityScreen() {
    const [reports, setReports] = useState(mockCommunityReports);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setReports([...mockCommunityReports].reverse());
            setRefreshing(false);
        }, 1500);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Community Feed</Text>
            </View>
            <FlatList
                data={reports}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={({ item }) => (
                    <ReportCard
                        report={item}
                        type="community"
                    />
                )}
            />
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