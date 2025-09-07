// app/report-create.jsx

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
    Image,
    Alert,
    ActivityIndicator,
    Switch,
    Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

// NEW: Category data with images. Make sure you have these images in assets/images/
const CATEGORIES = [
    { label: "Pothole", image: require("../assets/images/pothole.png") },
    { label: "Garbage", image: require("../assets/images/garbage.png") },
    { label: "Streetlight", image: require("../assets/images/streetlight.png") },
    { label: "Drainage", image: require("../assets/images/drainage.png") },
    { label: "Vandalism", image: require("../assets/images/vandalism.png") },
    { label: "General", image: require("../assets/images/general.png") },
];

export default function ReportCreateScreen() {
    const router = useRouter();

    // State for all form fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState("");
    const [category, setCategory] = useState(null);

    // State for UI and logic
    const [isAutoLocation, setIsAutoLocation] = useState(true); // Default to Auto
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(true);

    const getAutoLocation = useCallback(async () => {
        setIsFetchingLocation(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", "Location access is needed to auto-detect your location.");
            setIsFetchingLocation(false);
            setIsAutoLocation(false); // Switch to manual if permission denied
            return;
        }
        try {
            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
            let geocode = await Location.reverseGeocodeAsync(loc.coords);
            if (geocode.length > 0) {
                const g = geocode[0];
                setAddress(`${g.name || g.street}, ${g.city}, ${g.postalCode}`);
            }
        } catch (error) {
            Alert.alert("Location Error", "Could not fetch your current location.");
        } finally {
            setIsFetchingLocation(false);
        }
    }, []);

    useEffect(() => {
        if (isAutoLocation) {
            getAutoLocation();
        } else {
            setAddress(""); // Clear address when switching to manual
        }
    }, [isAutoLocation, getAutoLocation]);

    const pickImage = async (useCamera = false) => {
        let result;
        if (useCamera) {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Camera access is needed to take a photo.');
                return;
            }
            result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.8 });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.8 });
        }
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!image || !category || !title || !description || (!isAutoLocation && !address)) {
            Alert.alert("Incomplete Form", "Please fill out all fields and select a photo and category.");
            return;
        }
        setIsSubmitting(true);
        // ... (Submission logic remains the same)
        setIsSubmitting(false);
        Alert.alert("Success!", "Your report has been submitted.");
        router.replace("/my-reports");
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* NEW: Redesigned header to fix UX issues */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Ionicons name="close" size={28} color="#555" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Report a New Issue</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Section 1: Add Photo */}
                <Text style={styles.sectionTitle}>Add Photo</Text>
                <View style={styles.card}>
                    {image ? (
                        <View>
                            <Image source={{ uri: image }} style={styles.imagePreview} />
                            <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)}>
                                <Ionicons name="close-circle" size={32} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.photoButtonsContainer}>
                            <TouchableOpacity style={styles.photoButton} onPress={() => pickImage(true)}>
                                <Ionicons name="camera-outline" size={28} color="#6A5AE0" />
                                <Text style={styles.photoButtonText}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.photoButton} onPress={() => pickImage(false)}>
                                <Ionicons name="image-outline" size={28} color="#6A5AE0" />
                                <Text style={styles.photoButtonText}>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Section 2: Title & Description (Reordered as requested) */}
                <Text style={styles.sectionTitle}>Details</Text>
                <View style={styles.card}>
                    <TextInput
                        style={styles.input}
                        placeholder="Title (e.g., Large Pothole on MG Road)"
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor="#999"
                    />
                    <TextInput
                        style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                        placeholder="Description (add more details about the issue)"
                        multiline
                        value={description}
                        onChangeText={setDescription}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Section 3: Category with Images */}
                <Text style={styles.sectionTitle}>Select Category</Text>
                <View style={styles.categoryGrid}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.label}
                            style={[styles.categoryItem, category === cat.label && styles.categoryItemSelected]}
                            onPress={() => setCategory(cat.label)}
                        >
                            <Image source={cat.image} style={styles.categoryImage} />
                            <Text style={[styles.categoryText, category === cat.label && styles.categoryTextSelected]}>{cat.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Section 4: Location with improved toggle */}
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.card}>
                    <View style={styles.locationToggle}>
                        <Text style={styles.locationToggleText}>Auto-detect Location</Text>
                        <Switch
                            value={isAutoLocation}
                            onValueChange={setIsAutoLocation}
                            trackColor={{ false: '#ccc', true: '#C9C2F8' }}
                            thumbColor={isAutoLocation ? '#6A5AE0' : '#f4f3f4'}
                        />
                    </View>
                    {!isAutoLocation ? (
                        <TextInput
                            style={[styles.input, { marginTop: 15 }]}
                            placeholder="Enter address manually"
                            value={address}
                            onChangeText={setAddress}
                            placeholderTextColor="#999"
                        />
                    ) : (
                        <View style={styles.autoLocationDisplay}>
                            <Ionicons name="location-outline" size={20} color="#6A5AE0" />
                            {isFetchingLocation ? <ActivityIndicator style={{ marginLeft: 10 }} /> : <Text style={styles.addressText}>{address}</Text>}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Redesigned Submit Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit Report</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// NEW Styles to match the theme
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F4F7FF" },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EAEBEE'
    },
    closeButton: { padding: 5 },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#333'
    },
    scrollContainer: { padding: 20, paddingBottom: 100 },
    sectionTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
        marginTop: 15
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3
    },
    imagePreview: { width: '100%', height: 200, borderRadius: 10 },
    removeImageButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 16
    },
    photoButtonsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
    photoButton: {
        alignItems: 'center',
        backgroundColor: '#F4F7FF',
        padding: 20,
        borderRadius: 10,
        width: '45%'
    },
    photoButtonText: {
        fontFamily: 'Poppins-Regular',
        color: '#6A5AE0',
        marginTop: 5
    },
    input: {
        backgroundColor: '#F4F7FF',
        borderRadius: 10,
        padding: 15,
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#EAEBEE',
        marginBottom: 10,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    categoryItem: {
        width: '30%',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    categoryItemSelected: {
        borderColor: '#6A5AE0',
        backgroundColor: '#F0EEFF'
    },
    categoryImage: { width: 40, height: 40, marginBottom: 5 },
    categoryText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        textAlign: 'center',
    },
    categoryTextSelected: { fontFamily: 'Poppins-SemiBold' },
    locationToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    locationToggleText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#333'
    },
    autoLocationDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: '#F4F7FF',
        padding: 15,
        borderRadius: 10
    },
    addressText: {
        fontFamily: 'Poppins-Regular',
        marginLeft: 10,
        flex: 1,
        color: '#555'
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#EAEBEE'
    },
    submitButton: {
        backgroundColor: '#6A5AE0',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center'
    },
    submitButtonText: {
        color: '#fff',
        fontFamily: 'Poppins-Bold',
        fontSize: 18
    },
});