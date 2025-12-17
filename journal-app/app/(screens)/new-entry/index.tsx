import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useContext, useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import { AuthContext } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";

export default function NewEntryScreen() {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();
  
  const handleCreateEntry = async () => {
    try {
      await axios.post(`${API_URL}/user/${user.id}`, {
        title,
        body,
      });

      router.push({pathname: "/(tabs)"});
    } catch (error) {
      Alert.alert("Error", "Failed to save changes");
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ fontSize: 16, color: "#007AFF" }}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>New Journal Entry</Text>
      <TextInput
        style={styles.titleInput}
        placeholder="Title..."
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        multiline
        placeholder="Write your thoughts..."
        value={body}
        onChangeText={setBody}
      />

      <Button title="Save Entry" onPress={handleCreateEntry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  titleInput: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    flex: 1
  },
});
