import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useContext, useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import { AuthContext } from "@/context/AuthContext";

export default function NewEntryScreen() {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();
  
  const handleCreateEntry = async () => {
    try {
      await axios.post(`http://localhost:5000/user/${user.id}`, {
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
    backgroundColor: "#f3f3f3",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f3f3f3",
    height: 200,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
});
