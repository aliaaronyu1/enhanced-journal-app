import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { AuthContext } from "@/context/AuthContext";

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchUsersEntries(user.id);
    }
  }, [user]);

  const fetchUsersEntries = async (userId: number) => {
    try {
      const res = await axios.get(`http://localhost:5000/journal-entries/${userId}`)
      setEntries(res.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
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
        <Text>Recent entries will appear here.</Text>
      ) :
        (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.entryContainer}>
                <Text style={styles.entryTitle}>{item.title}</Text>
                <Text style={styles.entryBody}>{item.body}</Text>
              </View>
            )}
          />
        )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
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
  },
  entryTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  entryBody: {
    fontSize: 16,
    marginTop: 4,
  },
});
