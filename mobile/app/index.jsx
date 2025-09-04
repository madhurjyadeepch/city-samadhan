import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Home() {
  const router = useRouter();

  const stats = [
    { label: "Reports Today", value: "12", icon: "document-text", color: "#FF6B6B" },
    { label: "Resolved", value: "89", icon: "checkmark-circle", color: "#4ECDC4" },
    { label: "In Progress", value: "23", icon: "time", color: "#FFD93D" },
    { label: "Community", value: "2.4k", icon: "people", color: "#6C5CE7" },
  ];

  const quickActions = [
    { id: "pothole", label: "Pothole", icon: "road", color: "#FF6B6B" },
    { id: "garbage", label: "Garbage", icon: "trash", color: "#4ECDC4" },
    { id: "streetlight", label: "Lights", icon: "lightbulb", color: "#FFD93D" },
    { id: "drainage", label: "Drainage", icon: "water", color: "#45B7D1" },
  ];

  const recentActivity = [
    { id: 1, title: "Street light fixed", area: "MG Road", time: "2 hours ago", status: "resolved" },
    { id: 2, title: "Pothole reported", area: "Park Street", time: "4 hours ago", status: "pending" },
    { id: 3, title: "Garbage collected", area: "Main Market", time: "6 hours ago", status: "resolved" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.headerTitle}>Jorhat Community</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => router.push("/report-create")}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#fff", "#f0f0f0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.reportButtonGradient}
          >
            <MaterialCommunityIcons name="plus-circle" size={28} color="#667eea" />
            <Text style={styles.reportButtonText}>Report New Issue</Text>
            <Ionicons name="arrow-forward" size={20} color="#667eea" />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <TouchableOpacity key={index} style={styles.statCard} activeOpacity={0.7}>
              <View style={[styles.statIconContainer, { backgroundColor: stat.color + "20" }]}>
                <Ionicons name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Report</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickAction}
                onPress={() => router.push({
                  pathname: "/report-create",
                  params: { category: action.id }
                })}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + "20" }]}>
                  {action.icon === "road" && <FontAwesome5 name="road" size={24} color={action.color} />}
                  {action.icon === "trash" && <Ionicons name="trash" size={24} color={action.color} />}
                  {action.icon === "lightbulb" && <Ionicons name="bulb" size={24} color={action.color} />}
                  {action.icon === "water" && <Ionicons name="water" size={24} color={action.color} />}
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentActivity.map((item) => (
            <TouchableOpacity key={item.id} style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Ionicons
                  name={item.status === "resolved" ? "checkmark-circle" : "time-outline"}
                  size={24}
                  color={item.status === "resolved" ? "#4ECDC4" : "#FFD93D"}
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <View style={styles.activityMeta}>
                  <Ionicons name="location-outline" size={14} color="#999" />
                  <Text style={styles.activityArea}>{item.area}</Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Contact */}
        <TouchableOpacity style={styles.emergencyCard}>
          <LinearGradient
            colors={["#FF6B6B", "#FF8787"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.emergencyGradient}
          >
            <Ionicons name="call" size={24} color="#fff" />
            <View style={styles.emergencyContent}>
              <Text style={styles.emergencyTitle}>Emergency Hotline</Text>
              <Text style={styles.emergencyNumber}>100 / 1090</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  greeting: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
  notificationBtn: {
    position: "relative",
    padding: 10,
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    backgroundColor: "#FF6B6B",
    borderRadius: 4,
  },
  reportButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  reportButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 15,
  },
  reportButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#667eea",
    flex: 1,
    marginLeft: 12,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3436",
  },
  statLabel: {
    fontSize: 13,
    color: "#636e72",
    marginTop: 2,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: 15,
  },
  seeAll: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "600",
  },
  quickAction: {
    alignItems: "center",
    marginRight: 20,
  },
  quickActionIcon: {
    width: 65,
    height: 65,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 13,
    color: "#636e72",
    fontWeight: "500",
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  activityIcon: {
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 5,
  },
  activityMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityArea: {
    fontSize: 13,
    color: "#999",
    marginLeft: 4,
    marginRight: 10,
  },
  activityTime: {
    fontSize: 13,
    color: "#999",
  },
  emergencyCard: {
    marginBottom: 30,
    borderRadius: 15,
    overflow: "hidden",
  },
  emergencyGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  emergencyContent: {
    flex: 1,
    marginLeft: 15,
  },
  emergencyTitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  emergencyNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 2,
  },
});