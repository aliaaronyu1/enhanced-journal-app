import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button, TouchableOpacity } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";



export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user?.id) {
      fetchUsersEntries(user.id);
    }
  }, [user]);

  const formatEntryTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / 60_000);
    const hours = Math.floor(diffMs / 3_600_000);
    const days = Math.floor(diffMs / 86_400_000);

    if (days >= 3) {
      // Older than 3 days → show full date
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) + " • " + date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    }

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `Just now`;
  };



  const fetchUsersEntries = async (userId: number) => {
    try {
      const res = await axios.get(`http://localhost:5000/user/${userId}`)
      
      // Map over entries and add formattedDate property
      const formattedEntries = res.data.map((entry: any) => ({
        ...entry,
        formattedDate: formatEntryTime(entry.created_at),
      }));
      
      setEntries(formattedEntries)
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateEntry = (entryId: number) => {
    router.push({
      pathname: "/edit-entry/[entryId]", // the route file
      params: { entryId: entryId }, // the dynamic param
    });
  }

  const handleAddEntry = () => {
    router.push({pathname: "/new-entry"});
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Journal</Text>
      {entries.length === 0 ? (
        <View>
          <Text>Recent entries will appear here.</Text>
          <Button title="Add" onPress={handleAddEntry} />
        </View>
      ) :
        (
          <View style={styles.content}>
            <FlatList
              data={entries}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.entryContainer} onPress={() => { handleUpdateEntry(item.id) }}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.entryDate}>{item.formattedDate}</Text>
                  </View>
                  <View style={styles.divider} />
                  <Text style={styles.entryBody} numberOfLines={3}>{item.body}</Text>
                </TouchableOpacity>
              )}
            />
            <View>
              <TouchableOpacity
                style={styles.fab}
                onPress={handleAddEntry}
                activeOpacity={0.8}>
                  <Ionicons name="add" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
  },
  entryContainer: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  entryDate: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 8,
  },
  entryTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 8,
  },
  entryBody: {
    fontSize: 16,
    // marginTop: 4,
    color: "#374151",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",

    // subtle shadow
    elevation: 6, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
