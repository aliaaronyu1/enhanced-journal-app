import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";

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

  const fetchUsersEntries = async (userId: number) => {
    try {
      const res = await axios.get(`http://localhost:5000/user/${userId}`)
      setEntries(res.data);
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
          <View>
            <FlatList
              style={styles.list}
              data={entries}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.entryContainer}>
                  <Text style={styles.entryTitle}>{item.title}</Text>
                  <Text style={styles.entryBody}>{item.body}</Text>
                  <Button title="Edit" onPress={() => { handleUpdateEntry(item.id) }} />
                </View>
              )}
            />
            <Button title="Add" onPress={handleAddEntry}/>
          </View>
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
  list: {
    height: 600,
    overflow: "scroll"
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
