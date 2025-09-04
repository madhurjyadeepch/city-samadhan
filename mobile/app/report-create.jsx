import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Image,
    Alert,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function ReportCreate() {
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState("");
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const categories = [
        { id: "pothole", label: "Pothole", icon: "road" },
        { id: "garbage", label: "Garbage", icon: "delete" },
        { id: "streetlight", label: "Street Light", icon: "lightbulb-outline" },
        { id: "drainage", label: "Drainage", icon: "water" },
        { id: "traffic", label: "Traffic", icon: "traffic-light" },
        { id: "parks", label: "Parks & Gardens", icon: "tree" },
    ];

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission required", "Camera access is needed.");
            return;
        }
        const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
        if (!result.canceled) setImage(result.assets[0].uri);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
        if (!result.canceled) setImage(result.assets[0].uri);
    };

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission denied", "Location access is needed.");
            return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);

        let geocode = await Location.reverseGeocodeAsync(loc.coords);
        if (geocode.length > 0) {
            const { name, street, city, region } = geocode[0];
            setAddress(`${name || street || ""}, ${city}, ${region}`);
        }
    };

    const handleSubmit = async () => {
        if (!description || !category) {
            Alert.alert("Missing info", "Please select a category and enter description.");
            return;
        }
        setLoading(true);
        try {
            const newReport = {
                id: Date.now().toString(),
                description,
                image,
                category,
                location,
                address,
                createdAt: new Date().toLocaleString([], {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };

            const stored = await AsyncStorage.getItem("reports");
            const reports = stored ? JSON.parse(stored) : [];
            reports.push(newReport);
            await AsyncStorage.setItem("reports", JSON.stringify(reports));

            router.back();
        } catch (err) {
            console.error("Error saving report:", err);
        } finally {
            setLoading(false);
            setDescription("");
            setImage(null);
            setCategory(null);
            setAddress("");
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
            <ScrollView
                contentContainerStyle={[styles.container, { flexGrow: 1 }]}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Report an Issue</Text>
                <Text style={styles.subtitle}>
                    Help improve your community by reporting civic issues
                </Text>

                {/* Add Media */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Add Media</Text>
                    <View style={styles.row}>
                        <Button title="Photo" onPress={takePhoto} />
                        <Button title="Gallery" onPress={pickImage} />
                    </View>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.preview} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Ionicons name="camera-outline" size={40} color="#aaa" />
                            <Text>No media added</Text>
                        </View>
                    )}
                </View>

                {/* Location */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Location</Text>
                    <Text>{address || "No location selected"}</Text>
                    <Button title="Update" onPress={getLocation} />
                </View>

                {/* Categories */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Issue Category</Text>
                    <View style={styles.categories}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.categoryButton,
                                    category === cat.id && styles.categorySelected,
                                ]}
                                onPress={() => setCategory(cat.id)}
                            >
                                {cat.icon === "road" && (
                                    <FontAwesome5 name="road" size={20} color="#444" />
                                )}
                                {cat.icon === "delete" && (
                                    <MaterialIcons name="delete" size={20} color="#444" />
                                )}
                                {cat.icon === "lightbulb-outline" && (
                                    <MaterialIcons name="lightbulb-outline" size={20} color="#444" />
                                )}
                                {cat.icon === "water" && (
                                    <Ionicons name="water-outline" size={20} color="#444" />
                                )}
                                {cat.icon === "traffic-light" && (
                                    <FontAwesome5 name="traffic-light" size={20} color="#444" />
                                )}
                                {cat.icon === "tree" && (
                                    <FontAwesome5 name="tree" size={20} color="#444" />
                                )}
                                <Text style={styles.categoryLabel}>{cat.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Description */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Describe the issue in detail..."
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />
                </View>

                {/* Submit */}
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.submitText}>
                        {loading ? "Submitting..." : "Submit Report"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 15, backgroundColor: "#f9f9f9" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
    subtitle: { fontSize: 14, color: "#666", marginBottom: 15 },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
    preview: { width: "100%", height: 180, borderRadius: 8, marginTop: 10 },
    placeholder: {
        height: 120,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginTop: 10,
    },
    categories: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    categoryButton: {
        width: "47%",
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
        marginBottom: 10,
    },
    categorySelected: {
        borderColor: "#007AFF",
        backgroundColor: "#E6F0FF",
    },
    categoryLabel: { marginTop: 5, fontSize: 14, fontWeight: "500" },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        height: 100,
        textAlignVertical: "top",
    },
    submitButton: {
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 30,
    },
    submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
