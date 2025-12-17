import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { useRef } from "react";
import { API_URL } from "@/lib/api";

export default function EditEntryScreen() {
  const { user } = useContext(AuthContext);
  const { entryId } = useLocalSearchParams(); // entry ID from route
  const [ saving, setSaving ] = useState(false);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const saveTimeout = useRef<number | null>(null);

  useEffect(() => {
    fetchEntry();
  }, []);

  const fetchEntry = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/${user.id}/journal-entry/${entryId}`);
      setTitle(res.data.title);
      setBody(res.data.body);
    } catch (error) {
      Alert.alert("Error", "Could not load entry");
    } finally {
      setLoading(false);
    }
  };

  const autoSave = (newTitle: string, newBody: string) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      setSaving(true);
      try {
        await axios.put(`${API_URL}/user/${user.id}/journal-entry/${entryId}`, {
          title: newTitle,
          body: newBody,
        });
        console.log("Auto-saved");
      } catch (err) {
        console.error("Auto-save failed", err);
      } finally {
        setSaving(false);
      }
    }, 1000);
  };

  // const handleSave = async () => {
  //   try {
  //     await axios.put(`${API_URL}/user/${user.id}/journal-entry/${entryId}`, {
  //       title,
  //       body,
  //     });

  //     router.back(); // go back to HomeScreen
  //   } catch (error) {
  //     Alert.alert("Error", "Failed to save changes");
  //   }
  // };
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/user/${user.id}/journal-entry/${entryId}`);

      router.back(); // go back to HomeScreen
    } catch (error) {
      Alert.alert("Error", "Failed to delete entry");
    }
  };
  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ fontSize: 16, color: "#007AFF" }}>← Back</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          autoSave(text, body);
        }}
      />

      <TextInput
        style={[styles.input, { height: 150 }]}
        value={body}
        onChangeText={(text) => {
          setBody(text);
          autoSave(title, text);
        }}
        multiline
      />
      <Text style={{ fontSize: 12, color: "#888" }}>
        {saving ? "Saving..." : "All changes saved"}
      </Text>
      {/* <Button title="Save" onPress={handleSave} /> */}
      {/* <Button title="Delete" onPress={handleDelete} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  titleInput: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flex: 1
  },
});
