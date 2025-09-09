// components/ReportCard.jsx

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// V V V ADD THIS LINE V V V
// Replace with your computer's local IP address

// Helper for styling status badges
const getStatusStyle = (status) => {
    switch (status) {
        case "in-progress": return { backgroundColor: "#FFFBEB", color: "#F59E0B" };
        case "resolved": return { backgroundColor: "#F0FDF4", color: "#16A34A" }; // Changed 'done' to 'resolved' to match schema
        case "pending": default: return { backgroundColor: "#FEF2F2", color: "#DC2626" };
    }
};

const ReportCard = ({ report, type, onDelete, onOpenMap }) => {
    const router = useRouter();
    const statusStyle = getStatusStyle(report.status);
    
    // V V V ADD THIS LINE V V V
    // Construct the full URL for the image
    const imageUrl = `${process.env.EXPO_PUBLIC_API_URL}/${report.image}`;
    

    // Navigate to the correct detail page based on the card type
    const handlePress = () => {
        if (type === 'my-report') {
            router.push(`/my-reports/${report._id}`); // Use _id for MongoDB documents
        } else {
            router.push(`/community/${report._id}`); // Use _id for MongoDB documents
        }
    };

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={handlePress}>
            
            {/* V V V THIS LINE IS CHANGED V V V */}
            {/* Report Image */}
            <Image source={{ uri: imageUrl }} style={styles.cardImage} />

            <View style={styles.cardContent}>
                {/* Top Row: Category & Status */}
                <View style={styles.topRow}>
                    <Text style={styles.categoryText}>{report.category}</Text>
                    {/* <Text style={styles.categoryText}>{report.image}</Text> */}
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>{report.status}</Text>
                    </View>
                </View>

                {/* Title */}
                <Text style={styles.titleText}>{report.title}</Text>

                {/* Conditional User Info for Community Cards */}
                {type === 'community' && report.author && ( // Check if author exists
                    <View style={styles.userInfo}>
                        <View style={styles.avatar}><Text style={styles.avatarText}>{report.author.name.charAt(0)}</Text></View>
                        <Text style={styles.userName}>{report.author.name}</Text>
                        {/* You might want to format this date */}
                        <Text style={styles.timestamp}>• {new Date(report.createdAt).toLocaleDateString()}</Text>
                    </View>
                )}

                {/* Description */}
                <Text style={styles.descriptionText} numberOfLines={2}>{report.description}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
                {type === 'my-report' ? (
                    <>
                        <TouchableOpacity style={styles.actionButton} onPress={onOpenMap}>
                            <Ionicons name="map-outline" size={20} color="#3498db" />
                            <Text style={styles.actionText}>Map</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="create-outline" size={20} color="#f39c12" />
                            <Text style={styles.actionText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(report._id)}>
                            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                            <Text style={styles.actionText}>Delete</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="arrow-up-outline" size={22} color="#16A34A" />
                            <Text style={styles.actionText}>{report.upvotes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="arrow-down-outline" size={22} color="#DC2626" />
                            <Text style={styles.actionText}>{report.downvotes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="chatbubble-outline" size={20} color="#666" />
                            <Text style={styles.actionText}>Comment</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
};

// Styles remain the same
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#959595',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        overflow: 'hidden'
    },
    cardImage: {
        width: '100%',
        height: 180,
    },
    cardContent: {
        padding: 15,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        color: '#6A5AE0',
        backgroundColor: '#F0EEFF',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        overflow: 'hidden', // for iOS
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    statusText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        textTransform: 'capitalize'
    },
    titleText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        color: '#2d3436',
        marginBottom: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#6A5AE0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8
    },
    avatarText: {
        color: '#fff',
        fontFamily: 'Poppins-Bold',
        fontSize: 10
    },
    userName: {
        fontFamily: 'Poppins-SemiBold',
        color: '#333'
    },
    timestamp: {
        fontFamily: 'Poppins-Regular',
        color: '#999',
        marginLeft: 5
    },
    descriptionText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#636e72',
        lineHeight: 22,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingVertical: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    actionText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#555',
    }
});


export default ReportCard;