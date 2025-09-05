// app/report--create.jsx

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
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

// A list of categories for the user to select from
const CATEGORIES = [
    "Pothole",
    "Garbage",
    "Streetlight",
    "Drainage",
    "Public Vandalism",
    "Illegal Parking",
    "General",
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
    const [isManualLocation, setIsManualLocation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(true);

    // Function to get user's current location automatically
    const getAutoLocation = useCallback(async () => {
        setIsFetchingLocation(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", "Location access is needed to auto-detect your location.");
            setIsFetchingLocation(false);
            setIsManualLocation(true); // Switch to manual if permission is denied
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

    // Function to get location from manually entered address
    const getLocationFromAddress = async () => {
        if (!address) return;
        try {
            let geocode = await Location.geocodeAsync(address);
            if (geocode.length > 0) {
                setLocation(geocode[0]);
                Alert.alert("Location Found", "Address has been successfully located on the map.");
            } else {
                Alert.alert("Location Not Found", "Could not find coordinates for the entered address.");
            }
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        if (!isManualLocation) {
            getAutoLocation();
        }
    }, [isManualLocation, getAutoLocation]);

    // Function to pick image from Gallery
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // Function to take a photo with the Camera
    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera access is needed to take a photo.');
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // Handle report submission
    const handleSubmit = async () => {
        if (!image || !location || !category || !title || !description) {
            Alert.alert("Incomplete Form", "Please fill out all fields, including adding a photo, location, and category.");
            return;
        }
        setIsSubmitting(true);
        try {
            const newReport = {
                id: `report_${Date.now()}`,
                title,
                description,
                category,
                image,
                location,
                address,
                status: "pending", // Default status
                createdAt: new Date().toISOString(),
            };
            const existingReports = await AsyncStorage.getItem("reports");
            const reports = existingReports ? JSON.parse(existingReports) : [];
            reports.unshift(newReport); // Add to the start of the list
            await AsyncStorage.setItem("reports", JSON.stringify(reports));

            Alert.alert("Success!", "Your report has been submitted.");
            router.replace("/my-reports");
        } catch (error) {
            Alert.alert("Error", "Something went wrong while saving your report.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close-circle" size={30} color="#999" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Report New Issue</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Add Photo Section */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>1. Add a Photo</Text>
                    {image ? (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: image }} style={styles.imagePreview} />
                            <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)}>
                                <Ionicons name="close-circle" size={28} color="#d9534f" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.photoButtons}>
                            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                                <Ionicons name="camera-outline" size={24} color="#667eea" />
                                <Text style={styles.photoButtonText}>Take Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                                <Ionicons name="image-outline" size={24} color="#667eea" />
                                <Text style={styles.photoButtonText}>From Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Location Section */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>2. Location</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.switchLabel}>Auto</Text>
                            <Switch
                                value={!isManualLocation}
                                onValueChange={(value) => setIsManualLocation(!value)}
                                trackColor={{ false: '#8a99f3', true: '#ccc' }}
                                thumbColor={!isManualLocation ? '#667eea' : '#f4f3f4'}
                            />
                            <Text style={styles.switchLabel}>Manual</Text>
                        </View>
                    </View>

                    {isManualLocation ? (
                        <View style={styles.manualLocationContainer}>
                            <TextInput
                                style={styles.locationInput}
                                placeholder="Enter address, city, or postal code"
                                value={address}
                                onChangeText={setAddress}
                            />
                            <TouchableOpacity style={styles.geocodeButton} onPress={getLocationFromAddress}>
                                <Text style={styles.geocodeButtonText}>Find</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.autoLocationContainer}>
                            <Ionicons name="location-outline" size={20} color="#636e72" />
                            {isFetchingLocation ? (
                                <ActivityIndicator style={{ marginLeft: 10 }} />
                            ) : (
                                <Text style={styles.addressText}>{address}</Text>
                            )}
                        </View>
                    )}
                </View>

                {/* Category Section */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>3. Select a Category</Text>
                    <View style={styles.categoryGrid}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[styles.categoryChip, category === cat && styles.categoryChipSelected]}
                                onPress={() => setCategory(cat)}
                            >
                                <Text style={[styles.categoryText, category === cat && styles.categoryTextSelected]}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Details Section */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>4. Title & Description</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter a short title for the issue"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={[styles.input, styles.descriptionInput]}
                        placeholder="Describe the issue in detail"
                        multiline
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Submit Report</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

// You can expect a long list of styles here for the UI
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fff' },
    headerTitle: { fontSize: 20, fontWeight: '600', color: '#2d3436', marginLeft: 15 },
    scrollContainer: { padding: 15, paddingBottom: 40 },
    card: { backgroundColor: '#f8f9fa', borderRadius: 12, padding: 15, marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#2d3436', marginBottom: 15 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    photoButtons: { flexDirection: 'row', justifyContent: 'space-around', gap: 15 },
    photoButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, backgroundColor: '#eef0ff', borderRadius: 10, gap: 10 },
    photoButtonText: { color: '#667eea', fontWeight: '600' },
    imagePreviewContainer: { alignItems: 'center' },
    imagePreview: { width: '100%', height: 200, borderRadius: 10 },
    removeImageButton: { position: 'absolute', top: -10, right: -10 },
    switchLabel: { marginHorizontal: 5, color: '#636e72' },
    manualLocationContainer: { flexDirection: 'row', gap: 10 },
    locationInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#fff' },
    geocodeButton: { backgroundColor: '#667eea', paddingHorizontal: 15, justifyContent: 'center', borderRadius: 8 },
    geocodeButtonText: { color: '#fff', fontWeight: 'bold' },
    autoLocationContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
    addressText: { flex: 1, marginLeft: 10, color: '#636e72' },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    categoryChip: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#eef0ff', borderRadius: 20 },
    categoryChipSelected: { backgroundColor: '#667eea' },
    categoryText: { color: '#667eea', fontWeight: '500' },
    categoryTextSelected: { color: '#fff' },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 10 },
    descriptionInput: { height: 120, textAlignVertical: 'top' },
    submitButton: { backgroundColor: '#667eea', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});