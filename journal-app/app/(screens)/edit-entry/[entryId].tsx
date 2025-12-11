import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";

export default function EditEntryScreen() {
  const { user } = useContext(AuthContext);
  const { entryId } = useLocalSearchParams(); // entry ID from route
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntry();
  }, []);

  const fetchEntry = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/user/${user.id}/journal-entry/${entryId}`);
      setTitle(res.data.title);
      setBody(res.data.body);
    } catch (error) {
      Alert.alert("Error", "Could not load entry");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      console.log(entryId)
      await axios.put(`http://localhost:5000/user/${user.id}/journal-entry/${entryId}`, {
        title,
        body,
      });

      router.back(); // go back to HomeScreen
    } catch (error) {
      Alert.alert("Error", "Failed to save changes");
    }
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, { height: 150 }]}
        value={body}
        onChangeText={setBody}
        multiline
      />

      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});
